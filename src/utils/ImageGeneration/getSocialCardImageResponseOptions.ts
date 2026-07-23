import type { Font } from 'next/dist/compiled/@vercel/og/satori';

const URBANIST_FILE = (weight: number) =>
  `https://cdn.jsdelivr.net/npm/@fontsource/urbanist/files/urbanist-latin-${weight}-normal.woff`;

/**
 * Image response options for the social share card. Uses Urbanist (the font
 * used in the Figma design) loaded from a CDN, matching the existing OG image
 * pipeline which cannot reliably resolve local font files on Vercel.
 */
export const getSocialCardImageResponseOptions = async ({
  width,
  height,
}: {
  width: number;
  height: number;
}) => {
  return {
    headers: {
      'Cache-Control': `public, max-age=${60 * 60 * 1000 * 24}, immutable`,
    },
    width,
    height,
    fonts: await getUrbanistFonts(),
  };
};

async function getUrbanistFonts(): Promise<Font[]> {
  const [regular, medium, semiBold] = await Promise.all([
    fetch(URBANIST_FILE(400)).then((res) => res.arrayBuffer()),
    fetch(URBANIST_FILE(500)).then((res) => res.arrayBuffer()),
    fetch(URBANIST_FILE(600)).then((res) => res.arrayBuffer()),
  ]);

  return [
    { name: 'Urbanist', data: regular, style: 'normal', weight: 400 },
    { name: 'Urbanist', data: medium, style: 'normal', weight: 500 },
    { name: 'Urbanist', data: semiBold, style: 'normal', weight: 600 },
  ];
}
