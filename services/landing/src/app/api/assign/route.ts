import { NextRequest, NextResponse } from 'next/server';

const AB_SERVICE_URL = process.env.AB_SERVICE_URL || 'http://localhost:3001';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${AB_SERVICE_URL}/api/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[assign] proxy error:', err);
    return NextResponse.json({ error: 'Assignment service unavailable' }, { status: 503 });
  }
}
