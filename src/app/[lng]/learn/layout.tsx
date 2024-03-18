import '../global.css';

import UserTracking from '@/components/UserTracking/UserTracking';
import { locales } from '@/i18n/i18next-locales';
import { ReactQueryProvider } from '@/providers/ReactQueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { WalletProvider } from '@/providers/WalletProvider';
import { dir } from 'i18next';
import { Layout } from 'src/Layout';

export async function generateStaticParams() {
  return locales.map((lng) => ({ lng }));
}

export default function RootLayout({
  children,
  params: { lng },
}: {
  children: React.ReactNode;
  params: {
    lng: string;
  };
}) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>
        <UserTracking />
        <ReactQueryProvider>
          <ThemeProvider>
            <WalletProvider>
              <Layout>{children}</Layout>
            </WalletProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
