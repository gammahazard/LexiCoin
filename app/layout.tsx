'use client';

import './globals.css';
import { NeynarContextProvider, Theme } from '@neynar/react';
import '@neynar/react/dist/style.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_NEYNAR_CLIENT_ID;

  if (!clientId) {
    throw new Error('❌ Missing NEXT_PUBLIC_NEYNAR_CLIENT_ID in .env.local');
  }

  return (
    <html lang="en">
      <body>
        <NeynarContextProvider
          settings={{
            clientId,
            defaultTheme: Theme.Dark,
            eventsCallbacks: {
              onAuthSuccess: (user) => {
                console.log('✅ Logged in:', user);
              },
              onSignout: () => {
                console.log('👋 Signed out');
              },
            },
          }}
        >
          {children}
        </NeynarContextProvider>
      </body>
    </html>
  );
}
