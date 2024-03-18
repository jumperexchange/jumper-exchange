import Script from 'next/script';

export default async function Head() {
  return (
    <>
      <title>Jumper | Multi-Chain Bridging & Swapping (powered by LI.FI)</title>
      <meta
        name="description"
        content="A playground to explore new Next.js 13 app directory features such as nested layouts, instant loading states, streaming, and component level data fetching."
      />
      {/* <meta charset="utf-8" /> */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Jumper.Exchange" />
      <meta
        property="og:description"
        content="Multi-Chain Bridging & Swapping (powered by LI.FI)"
      />
      <meta property="og:title" content="Jumper.Exchange" />
      <meta property="og:image" content="https://jumper.exchange/preview.png" />
      <meta
        property="og:image:secure_url"
        content="https://jumper.exchange/preview.png"
      />
      <meta property="og:image:width" content="900" />
      <meta property="og:image:height" content="450" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@JumperExchange" />
      <meta name="twitter:title" content="Jumper.Exchange" />
      <meta
        name="twitter:description"
        content="Multi-Chain Bridging & Swapping (powered by LI.FI)"
      />
      <meta
        name="twitter:image"
        content="https://jumper.exchange/preview.png"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon_DT.svg"
        sizes="any"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon_DT.png"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        href="/favicon_DT.ico"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="icon"
        type="image/svg+xml"
        href="/favicon.svg"
        sizes="any"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        type="image/png"
        href="/favicon.png"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="icon"
        href="/favicon.ico"
        media="(prefers-color-scheme: light)"
      />

      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/apple-touch-icon-57x57.png"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon-180x180.png"
        media="(prefers-color-scheme: light)"
      />
      <link
        rel="apple-touch-icon"
        sizes="57x57"
        href="/apple-touch-icon-57x57_DT.png"
        media="(prefers-color-scheme: dark)"
      />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon-180x180_DT.png"
        media="(prefers-color-scheme: dark)"
      />
      <Script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}`}
      />
      <Script id="google-analytics">
        {`
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag('js', new Date());
    gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_TRACKING_ID}');
`}
      </Script>
    </>
  );
}
