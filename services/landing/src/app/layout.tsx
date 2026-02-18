import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { tokens } from '@pushnami/shared';

export const metadata: Metadata = {
  title: 'Pushnami — Intelligent Push Notifications',
  description:
    'Reach your audience at the right moment. Pushnami delivers intelligent push notifications that drive real engagement.',
  openGraph: {
    title: 'Pushnami — Intelligent Push Notifications',
    description: 'Drive real engagement with AI-powered push notifications.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, background: tokens.color.surface.dark, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
