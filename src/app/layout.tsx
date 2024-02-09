import { NextIntlClientProvider, useMessages } from 'next-intl';
import React from 'react';

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const messages = useMessages();
  // console.log('messages', messages);
  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          test
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
