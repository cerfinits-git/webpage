import { NextResponse } from 'next/server';
import { getPlaybookSetups, savePlaybookSetups, deletePlaybookSetup, PlaybookSetup } from '@/lib/playbook-db';
import { getSessionUserId } from '@/lib/auth/session';

function unauthorized() {
  return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบ' }, { status: 401 });
}

export async function GET(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const url = new URL(request.url);
    const accountId = url.searchParams.get('accountId') || undefined;

    const setups = await getPlaybookSetups(userId, accountId);
    return NextResponse.json({ success: true, setups });
  } catch (error: any) {
    console.error('Failed to get playbook setups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const body = await request.json();

    if (!body.setups || !Array.isArray(body.setups)) {
      return NextResponse.json({ error: 'Invalid payload: setups array required' }, { status: 400 });
    }

    const incoming: PlaybookSetup[] = body.setups;
    const accountId = body.accountId ? String(body.accountId) : undefined;

    // This endpoint replaces the playbook setups for the specific account
    if (incoming.length === 0) {
      const existing = await getPlaybookSetups(userId, accountId);
      if (existing.length > 0 && body.confirmDeleteAll !== true) {
        return NextResponse.json(
          {
            error: 'การบันทึกรายการว่างจะลบ setup ทั้งหมด — ส่ง confirmDeleteAll: true หากตั้งใจ',
            existingCount: existing.length,
          },
          { status: 409 },
        );
      }
    }

    for (const setup of incoming) {
      if (!setup || typeof setup !== 'object') {
        return NextResponse.json({ error: 'Invalid setup entry' }, { status: 400 });
      }
      if (!String(setup.id ?? '').trim()) {
        return NextResponse.json({ error: 'Setup ต้องมี id' }, { status: 400 });
      }
      if (!String(setup.name ?? '').trim()) {
        return NextResponse.json({ error: 'กรุณาตั้งชื่อ setup ก่อนบันทึก' }, { status: 400 });
      }
    }

    const setups: PlaybookSetup[] = incoming.map((setup) => ({
      ...setup,
      accountId: accountId || setup.accountId,
      name: String(setup.name).trim(),
      rules: Array.isArray(setup.rules) ? setup.rules : [],
    }));

    await savePlaybookSetups(userId, setups, accountId);

    return NextResponse.json({ success: true, message: 'Playbook saved successfully', setups });
  } catch (error: any) {
    console.error('Failed to save playbook setups:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getSessionUserId();
    if (!userId) return unauthorized();

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const accountId = url.searchParams.get('accountId') || undefined;

    if (!id) {
      return NextResponse.json({ error: 'Setup ID required' }, { status: 400 });
    }

    await deletePlaybookSetup(userId, id, accountId);
    return NextResponse.json({ success: true, message: 'Setup deleted successfully' });
  } catch (error: any) {
    console.error('Failed to delete playbook setup:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
