import { NextRequest, NextResponse } from 'next/server';

const AB_SERVICE_URL = process.env.AB_SERVICE_URL ?? 'http://localhost:3001';

export async function GET() {
  try {
    const res = await fetch(`${AB_SERVICE_URL}/api/experiments`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy/experiments GET]', err);
    return NextResponse.json({ error: 'Failed to reach ab-service' }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const res = await fetch(`${AB_SERVICE_URL}/api/experiments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy/experiments POST]', err);
    return NextResponse.json({ error: 'Failed to reach ab-service' }, { status: 502 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...rest } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const res = await fetch(`${AB_SERVICE_URL}/api/experiments/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(rest),
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy/experiments PATCH]', err);
    return NextResponse.json({ error: 'Failed to reach ab-service' }, { status: 502 });
  }
}
