import { NextRequest, NextResponse } from 'next/server';

const AB_SERVICE_URL = process.env.AB_SERVICE_URL ?? 'http://localhost:3001';

export async function GET() {
  try {
    const res = await fetch(`${AB_SERVICE_URL}/api/toggles`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy/toggles GET]', err);
    return NextResponse.json({ error: 'Failed to reach ab-service' }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const res = await fetch(`${AB_SERVICE_URL}/api/toggles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy/toggles PATCH]', err);
    return NextResponse.json({ error: 'Failed to reach ab-service' }, { status: 502 });
  }
}
