// import { GoogleAnalytics } from '@next/third-parties/google';
// import Script from 'next/script';
// import React from 'react';
// import { BackgroundGradient, Navbar } from 'src/components';
// import {
//   ReactQueryProvider,
//   ThemeProvider,
//   WalletProvider,
// } from 'src/providers';

// import { dir } from 'i18next';

// const languages = ['en', 'fr', 'es'];

// export async function generateStaticParams() {
//   return languages.map((lng) => ({ lng }));
// }

// export default function LocaleLayout({
//   children,
//   params: { lng },
// }: {
//   children: React.ReactNode;
//   params: { lng: string };
// }) {
//   return (
//     <html lang={lng} dir={dir(lng)}>
//       <body>
//         <ReactQueryProvider>
//           <ThemeProvider>
//             <WalletProvider>
//               <BackgroundGradient />
//               {/* <NextIntlClientProvider messages={messages}> */}
//               <Navbar />
//               {children}
//               {/* </NextIntlClientProvider> */}
//             </WalletProvider>
//           </ThemeProvider>
//         </ReactQueryProvider>
//         <Script
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: `
//             const cookie3Options = {
//             siteId: 403,
//             additionalTracking: true
//           }

//           var _paq = window._paq = window._paq || [];
//           (function() {
//             var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//             g.async=true; g.src='https://cdn.cookie3.co/scripts/analytics/latest/cookie3.analytics.min.js'; s.parentNode.insertBefore(g,s);
//           })();
//          `,
//           }}
//         />

//         <GoogleAnalytics
//           gaId={process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}
//         />
//         <Script
//           strategy="afterInteractive"
//           dangerouslySetInnerHTML={{
//             __html: `
//             const cookie3Options = {
//             siteId: 403,
//             additionalTracking: true
//           }

//           var _paq = window._paq = window._paq || [];
//           (function() {
//             var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//             g.async=true; g.src='https://cdn.cookie3.co/scripts/analytics/latest/cookie3.analytics.min.js'; s.parentNode.insertBefore(g,s);
//           })();
//          `,
//           }}
//         />
//       </body>
//     </html>
//   );
// }

import { dir } from 'i18next';
import { languages } from 'src/i18n';

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

export default function RootLayout({ children, params: { lng } }) {
  return (
    <html lang={lng} dir={dir(lng)}>
      <head />
      <body>{children}</body>
    </html>
  );
}
