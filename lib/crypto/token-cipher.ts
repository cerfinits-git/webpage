import crypto from 'crypto';

/**
 * At-rest encryption for cTrader OAuth tokens (access + refresh).
 *
 * The key lives in the CTRADER_TOKEN_KEY env var, never in the database or the
 * local fallback file. A leaked DB row / JSON file is therefore useless without
 * the separately-held key. This does NOT protect against a full server
 * compromise (the key is in the process env) — that is inherent to app-level
 * encryption.
 *
 * Envelope format: `enc:v1:` + base64( iv[12] | authTag[16] | ciphertext ).
 * Values without the prefix are treated as legacy plaintext and passed through
 * on read, so existing rows keep working until they are re-saved (or purged).
 */

const PREFIX = 'enc:v1:';
const IV_LEN = 12;
const TAG_LEN = 16;

function loadKey(): Buffer | null {
  const raw = process.env.CTRADER_TOKEN_KEY;
  if (!raw) return null;
  const trimmed = raw.trim();
  const key = /^[0-9a-fA-F]{64}$/.test(trimmed)
    ? Buffer.from(trimmed, 'hex')
    : Buffer.from(trimmed, 'base64');
  if (key.length !== 32) {
    throw new Error('CTRADER_TOKEN_KEY must decode to 32 bytes (use `node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'base64\'))"`)');
  }
  return key;
}

export function isEncrypted(value: unknown): value is string {
  return typeof value === 'string' && value.startsWith(PREFIX);
}

/**
 * Encrypt a token for storage. Fails closed: if no key is configured it throws
 * rather than silently persisting plaintext. Empty/falsy input is returned
 * unchanged (nothing to protect).
 */
export function encryptToken(plain: string | null | undefined): string {
  if (!plain) return plain as string;
  if (isEncrypted(plain)) return plain; // already encrypted, don't double-wrap
  const key = loadKey();
  if (!key) {
    throw new Error('CTRADER_TOKEN_KEY is not set — refusing to store cTrader tokens in plaintext');
  }
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
  const ciphertext = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return PREFIX + Buffer.concat([iv, tag, ciphertext]).toString('base64');
}

/**
 * Decrypt a stored token. Legacy plaintext (no `enc:v1:` prefix) is returned
 * as-is so pre-encryption rows still work. An encrypted value with no key
 * configured throws — we cannot recover it.
 */
export function decryptToken(stored: string | null | undefined): string {
  if (!stored) return stored as string;
  if (!isEncrypted(stored)) return stored; // legacy plaintext passthrough
  const key = loadKey();
  if (!key) {
    throw new Error('CTRADER_TOKEN_KEY is not set — cannot decrypt cTrader tokens');
  }
  const buf = Buffer.from(stored.slice(PREFIX.length), 'base64');
  const iv = buf.subarray(0, IV_LEN);
  const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
  const ciphertext = buf.subarray(IV_LEN + TAG_LEN);
  const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}
