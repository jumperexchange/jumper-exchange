import dynamic from 'next/dynamic';

import type { Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const App = dynamic(() => import('../ui/app/App'), { ssr: true });

export default async function Page() {
  return (
    <>
      {/* <p>{t('navbar.welcome.title')}</p> */}
      <App starterVariant="default" />
    </>
  );
}
