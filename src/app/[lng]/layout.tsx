import React from 'react';
import { Navbar } from 'src/components/Navbar/Navbar';
import { AppProvider } from 'src/providers/AppProvider';

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: { lng: string };
}) {
  // if (locales.indexOf(lng) < 0) {
  //   lng = fallbackLng;
  // }
  return (
    <AppProvider lng={lng}>
      <Navbar />
      {children}
    </AppProvider>
  );
}
