import * as tls from 'tls';
import {
  ProtoMessageUtils,
  ProtoOaPayloadType,
  ProtoOaApplicationAuthReqUtils,
  ProtoOaAccountAuthReqUtils,
  ProtoOaDealListReqUtils,
  ProtoOaDealListResUtils,
  ProtoOaErrorResUtils,
  ProtoOADeal,
} from '@claasahl/spotware-protobuf';
import { CTraderTrade } from './ctrader-db';

const { PbfWriter, PbfReader } = require('pbf');

// Monkey-patch readVarint64 which is missing in pbf@4 but used by spotware-protobuf.
// Pass isSigned=true so int64 fields decode with two's-complement sign handling —
// otherwise negative values (e.g. commission, swap) read as a ~2^64 unsigned giant
// and lose precision as a JS double. Positive 64-bit values (timestamps, balance)
// are unaffected because they sit well inside the safe-integer range.
if (!PbfReader.prototype.readVarint64) {
  PbfReader.prototype.readVarint64 = function() {
    return this.readVarint(true);
  };
}

/**
 * spotware-protobuf's generated `*Utils.read()` signatures only declare the
 * fields the wire format requires; optional ones (payload, clientMsgId,
 * description) are present at runtime but absent from the return type. These
 * shapes restore them at the single decode point instead of casting inline.
 */
type DecodedProtoMessage = {
  payloadType: number;
  payload?: Uint8Array;
  clientMsgId?: string;
};

type DecodedProtoError = {
  errorCode: string;
  description?: string;
};

const LIVE_HOST = 'live.ctraderapi.com';
const DEMO_HOST = 'demo.ctraderapi.com';
const PORT = 5035;

/**
 * Connects to cTrader OpenAPI, authenticates app and account, and fetches deals.
 */
export async function fetchCTraderDeals(
  clientId: string,
  clientSecret: string,
  accessToken: string,
  fromTimestamp?: number,
  toTimestamp?: number,
  targetAccountId?: number
): Promise<ProtoOADeal[]> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const tryConnect = (host: string, targetAccountId?: number) => {
      console.log(`[cTrader API] Connecting to ${host}:${PORT}`);
      let isSwitchingHost = false;
      const socket = tls.connect({
        host: host,
        port: PORT,
        servername: host,
        rejectUnauthorized: false
      }, () => {
        console.log(`[cTrader API] Connected to ${host} via TLS`);
        sendProtoMessage(socket, ProtoOaPayloadType.PROTO_OA_APPLICATION_AUTH_REQ, (writer: any) => {
          ProtoOaApplicationAuthReqUtils.write({ clientId, clientSecret }, writer);
        });
      });

      let buffer = Buffer.alloc(0);
      let cTraderAccountId = targetAccountId || 0; 
      
      socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        
        while (buffer.length >= 4) {
          const length = buffer.readInt32BE(0);
          if (buffer.length >= 4 + length) {
            const msgBuffer = buffer.subarray(4, 4 + length);
            buffer = buffer.subarray(4 + length);
            
            const msgReader = new PbfReader(msgBuffer);
            const msg = ProtoMessageUtils.read(msgReader, msgReader.length) as DecodedProtoMessage;
            const payload = msg.payload || new Uint8Array(0);
            
            handleProtoMessage(msg.payloadType, payload, msg.clientMsgId);
          } else {
            break;
          }
        }
      });

      socket.on('error', (err) => {
        if (isSwitchingHost) return; // Ignore errors after intentionally closing
        console.error(`[cTrader API] Socket Error on ${host}:`, err);
        if (host === LIVE_HOST) {
          console.log(`[cTrader API] Live host connection failed. Falling back to Demo host...`);
          setTimeout(() => tryConnect(DEMO_HOST, targetAccountId), 500);
          return;
        }
        if (!resolved) {
          reject(err);
          resolved = true;
        }
      });
      
      socket.on('end', () => {
         console.log(`[cTrader API] Socket closed on ${host}`);
      });

      function sendProtoMessage(sock: tls.TLSSocket, payloadType: number, payloadWriterCb: (w: any) => void, clientMsgId?: string) {
        if (sock.destroyed) return;
        const payloadWriter = new PbfWriter();
        payloadWriterCb(payloadWriter);
        const payload = payloadWriter.finish();

        const msgWriter = new PbfWriter();
        ProtoMessageUtils.write({ payloadType, payload, clientMsgId }, msgWriter);
        const msg = msgWriter.finish();

        const header = Buffer.alloc(4);
        header.writeInt32BE(msg.length, 0);
        sock.write(header);
        sock.write(msg);
      }

      function handleProtoMessage(payloadType: number, payload: Uint8Array, clientMsgId?: string) {
        const payloadReader = new PbfReader(payload);

        if (payloadType === ProtoOaPayloadType.PROTO_OA_ERROR_RES) {
          const err = ProtoOaErrorResUtils.read(payloadReader, payloadReader.length) as DecodedProtoError;
          console.error(`[cTrader API] Error Res on ${host}:`, err);
          isSwitchingHost = true;
          socket.destroy();
          if (!resolved) {
            reject(new Error(`cTrader API Error: ${err.errorCode} - ${err.description}`));
            resolved = true;
          }
          return;
        }

        switch (payloadType) {
          case ProtoOaPayloadType.PROTO_OA_APPLICATION_AUTH_RES: {
            console.log(`[cTrader API] App Auth Successful on ${host}.`);
            // Always fetch accounts first to determine if target is Live or Demo
            const { ProtoOaGetAccountsByAccessTokenReqUtils } = require('@claasahl/spotware-protobuf');
            sendProtoMessage(socket, ProtoOaPayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ, (w: any) => {
               ProtoOaGetAccountsByAccessTokenReqUtils.write({ accessToken }, w);
            });
            break;
          }

          case ProtoOaPayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES: {
            const { ProtoOaGetAccountsByAccessTokenResUtils } = require('@claasahl/spotware-protobuf');
            const res = ProtoOaGetAccountsByAccessTokenResUtils.read(payloadReader, payloadReader.length);
            if (!res.ctidTraderAccount || res.ctidTraderAccount.length === 0) {
              isSwitchingHost = true;
              socket.destroy();
              if (!resolved) {
                reject(new Error("No cTrader accounts found for this access token"));
                resolved = true;
              }
              return;
            }
            
            let selectedAccount = null;
            if (targetAccountId && targetAccountId > 0) {
              selectedAccount = res.ctidTraderAccount.find((a: any) => a.ctidTraderAccountId === targetAccountId);
              if (!selectedAccount) {
                 isSwitchingHost = true;
                 socket.destroy();
                 if (!resolved) {
                   reject(new Error(`Account ${targetAccountId} not found in this cTrader profile`));
                   resolved = true;
                 }
                 return;
              }
            } else {
              const liveAccounts = res.ctidTraderAccount.filter((a: any) => a.isLive);
              const demoAccounts = res.ctidTraderAccount.filter((a: any) => !a.isLive);
              if (liveAccounts.length > 0) selectedAccount = liveAccounts[0];
              else if (demoAccounts.length > 0) selectedAccount = demoAccounts[demoAccounts.length - 1];
            }

            if (selectedAccount) {
              cTraderAccountId = selectedAccount.ctidTraderAccountId;
              const expectedHost = selectedAccount.isLive ? LIVE_HOST : DEMO_HOST;
              
              if (host !== expectedHost) {
                console.log(`[cTrader API] Account ${cTraderAccountId} is on ${expectedHost}. Reconnecting...`);
                isSwitchingHost = true;
                socket.destroy();
                setTimeout(() => tryConnect(expectedHost, cTraderAccountId), 500);
              } else {
                console.log(`[cTrader API] Authenticating Account ID: ${cTraderAccountId}...`);
                sendProtoMessage(socket, ProtoOaPayloadType.PROTO_OA_ACCOUNT_AUTH_REQ, (w: any) => {
                   ProtoOaAccountAuthReqUtils.write({ ctidTraderAccountId: cTraderAccountId, accessToken }, w);
                });
              }
            }
            break;
          }

          case ProtoOaPayloadType.PROTO_OA_ACCOUNT_AUTH_RES: {
            console.log(`[cTrader API] Account ${cTraderAccountId} Auth Successful. Fetching deals...`);
            const now = Date.now();
            const fromTime = fromTimestamp || (now - 1 * 365 * 24 * 60 * 60 * 1000); // 1 year back
            const toTime = toTimestamp || now;
            
            sendProtoMessage(socket, ProtoOaPayloadType.PROTO_OA_DEAL_LIST_REQ, (w: any) => {
               ProtoOaDealListReqUtils.write({
                 ctidTraderAccountId: cTraderAccountId,
                 fromTimestamp: fromTime,
                 toTimestamp: toTime
               }, w);
            });
            break;
          }

          case ProtoOaPayloadType.PROTO_OA_DEAL_LIST_RES: {
            const res = ProtoOaDealListResUtils.read(payloadReader, payloadReader.length);
            console.log(`[cTrader API] Fetched ${res.deal?.length || 0} deals.`);
            isSwitchingHost = true;
            socket.destroy();
            if (!resolved) {
              const returnedDeals = res.deal || [];
              returnedDeals.forEach((d: any) => d._cTraderAccountId = cTraderAccountId);
              resolve(returnedDeals);
              resolved = true;
            }
            break;
          }
          
          case 51: // HEARTBEAT_EVENT
            break;
          
          default:
            console.log(`[cTrader API] Unhandled Payload Type: ${payloadType}`);
        }
      }
    };

    // Initial connection to Live host
    tryConnect(LIVE_HOST, targetAccountId);
  });
}

/**
 * Maps cTrader ProtoOADeal to our standard CTraderTrade structure
 */
const SYMBOL_MAP: Record<string, string> = {
  "1": "EURUSD",
  "2": "GBPUSD",
  "3": "EURJPY",
  "4": "USDJPY",
  "5": "AUDUSD",
  "9": "EURGBP",
  "41": "XAUUSD",
  "42": "XAGUSD"
};

export function mapProtoDealToCTraderTrade(deal: any, cTraderAccountId?: number): CTraderTrade {
  const volumeUnits = deal.volume / 100;
  
  // A closing deal's side is opposite to the position's side
  // tradeSide 1 (Buy deal) -> closed a Sell position
  // tradeSide 2 (Sell deal) -> closed a Buy position
  const positionSide = deal.tradeSide === 1 ? 'sell' : 'buy';
  
  const entryPrice = deal.closePositionDetail?.entryPrice || 0;
  const exitPrice = deal.executionPrice || 0;
  const cpd = deal.closePositionDetail;

  // cTrader reports money in cents of the deposit currency. closePositionDetail
  // carries the real gross profit and the costs (commission, swap) directly, so
  // prefer those over the price-diff estimate; net = gross + commission + swap
  // (commission and swap are <= 0). balance is the running account equity.
  const grossProfit = cpd?.grossProfit != null ? Number(cpd.grossProfit) / 100 : null;
  const commission = cpd?.commission != null ? Number(cpd.commission) / 100 : 0;
  const swap = cpd?.swap != null ? Number(cpd.swap) / 100 : 0;
  const balance = cpd?.balance != null ? Number(cpd.balance) / 100 : undefined;

  let netProfit: number;
  if (grossProfit != null) {
    netProfit = grossProfit + commission + swap;
  } else {
    const priceDiff = positionSide === 'buy' ? (exitPrice - entryPrice) : (entryPrice - exitPrice);
    const conversionRate = cpd?.quoteToDepositConversionRate || 1;
    netProfit = Math.round(priceDiff * volumeUnits * conversionRate * 100) / 100;
  }

  return {
    ticket: deal.dealId?.toString() || "unknown",
    userId: "admin",
    cTraderAccountId,
    symbol: SYMBOL_MAP[deal.symbolId?.toString()] || `SYMBOL-${deal.symbolId}`,
    volume: volumeUnits,
    openTime: new Date(Number(deal.createTimestamp)).toISOString(),
    closeTime: new Date(Number(deal.executionTimestamp)).toISOString(),
    profit: netProfit,
    grossProfit: grossProfit ?? netProfit,
    commission,
    swap,
    balance,
    side: positionSide,
    entryPrice: entryPrice,
    exitPrice: exitPrice,
  };
}

export async function fetchCTraderAccounts(
  clientId: string,
  clientSecret: string,
  accessToken: string
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    let resolved = false;

    const tryConnect = (host: string) => {
      let isSwitchingHost = false;
      const socket = tls.connect({
        host: host,
        port: PORT,
        servername: host,
        rejectUnauthorized: false
      }, () => {
        sendProtoMessage(socket, ProtoOaPayloadType.PROTO_OA_APPLICATION_AUTH_REQ, (writer: any) => {
          ProtoOaApplicationAuthReqUtils.write({ clientId, clientSecret }, writer);
        });
      });

      let buffer = Buffer.alloc(0);
      
      socket.on('data', (data) => {
        buffer = Buffer.concat([buffer, data]);
        while (buffer.length >= 4) {
          const length = buffer.readInt32BE(0);
          if (buffer.length >= 4 + length) {
            const msgBuffer = buffer.subarray(4, 4 + length);
            buffer = buffer.subarray(4 + length);
            const msgReader = new PbfReader(msgBuffer);
            const msg = ProtoMessageUtils.read(msgReader, msgReader.length) as DecodedProtoMessage;
            const payload = msg.payload || new Uint8Array(0);
            handleProtoMessage(msg.payloadType, payload, msg.clientMsgId);
          } else {
            break;
          }
        }
      });

      socket.on('error', (err) => {
        if (isSwitchingHost) return;
        if (!resolved) {
          reject(err);
          resolved = true;
        }
      });

      function sendProtoMessage(sock: tls.TLSSocket, payloadType: number, payloadWriterCb: (w: any) => void, clientMsgId?: string) {
        if (sock.destroyed) return;
        const payloadWriter = new PbfWriter();
        payloadWriterCb(payloadWriter);
        const payload = payloadWriter.finish();
        const msgWriter = new PbfWriter();
        ProtoMessageUtils.write({ payloadType, payload, clientMsgId }, msgWriter);
        const msg = msgWriter.finish();
        const header = Buffer.alloc(4);
        header.writeInt32BE(msg.length, 0);
        sock.write(header);
        sock.write(msg);
      }

      function handleProtoMessage(payloadType: number, payload: Uint8Array, clientMsgId?: string) {
        const payloadReader = new PbfReader(payload);
        if (payloadType === ProtoOaPayloadType.PROTO_OA_ERROR_RES) {
          const err = ProtoOaErrorResUtils.read(payloadReader, payloadReader.length) as DecodedProtoError;
          socket.destroy();
          if (!resolved) {
            reject(new Error(`API Error: ${err.errorCode}`));
            resolved = true;
          }
          return;
        }

        switch (payloadType) {
          case ProtoOaPayloadType.PROTO_OA_APPLICATION_AUTH_RES: {
            const { ProtoOaGetAccountsByAccessTokenReqUtils } = require('@claasahl/spotware-protobuf');
            sendProtoMessage(socket, ProtoOaPayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_REQ, (w: any) => {
               ProtoOaGetAccountsByAccessTokenReqUtils.write({ accessToken }, w);
            });
            break;
          }
          case ProtoOaPayloadType.PROTO_OA_GET_ACCOUNTS_BY_ACCESS_TOKEN_RES: {
            const { ProtoOaGetAccountsByAccessTokenResUtils } = require('@claasahl/spotware-protobuf');
            const res = ProtoOaGetAccountsByAccessTokenResUtils.read(payloadReader, payloadReader.length);
            socket.destroy();
            if (!resolved) {
              resolve(res.ctidTraderAccount || []);
              resolved = true;
            }
            break;
          }
        }
      }
    };
    tryConnect(LIVE_HOST);
  });
}
