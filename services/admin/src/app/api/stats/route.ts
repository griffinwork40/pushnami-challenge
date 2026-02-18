import { NextRequest, NextResponse } from 'next/server';

const METRICS_SERVICE_URL = process.env.METRICS_SERVICE_URL ?? 'http://localhost:3002';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const experimentId = searchParams.get('experimentId');
    const qs = experimentId ? `?experimentId=${experimentId}` : '';

    const res = await fetch(`${METRICS_SERVICE_URL}/api/stats${qs}`, { cache: 'no-store' });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('[proxy/stats GET]', err);
    return NextResponse.json({ error: 'Failed to reach metrics-service' }, { status: 502 });
  }
}
