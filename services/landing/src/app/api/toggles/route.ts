import { NextResponse } from 'next/server';

const AB_SERVICE_URL = process.env.AB_SERVICE_URL || 'http://localhost:3001';

export async function GET() {
  try {
    const upstream = await fetch(`${AB_SERVICE_URL}/api/toggles`, {
      next: { revalidate: 30 },
    });
    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error('[toggles] proxy error:', err);
    return NextResponse.json({ error: 'Toggle service unavailable' }, { status: 503 });
  }
}
