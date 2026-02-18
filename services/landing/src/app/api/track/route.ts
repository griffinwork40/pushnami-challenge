import { NextRequest, NextResponse } from 'next/server';

const METRICS_SERVICE_URL = process.env.METRICS_SERVICE_URL || 'http://localhost:3002';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const upstream = await fetch(`${METRICS_SERVICE_URL}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[track] proxy error:', err);
    return NextResponse.json({ error: 'Metrics service unavailable' }, { status: 503 });
  }
}
