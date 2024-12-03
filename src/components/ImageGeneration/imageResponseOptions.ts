import type { Font } from 'node_modules/next/dist/compiled/@vercel/og/satori';

export const imageResponseOptions = async ({
  width,
  height,
  scalingFactor,
}: {
  width: number;
  height: number;
  scalingFactor: number;
}) => {
  return {
    headers: {
      'Cache-Control': `public, max-age=${60 * 60 * 1000 * 24}, immutable`,
    },
    width: width * scalingFactor,
    height: height * scalingFactor,
    fonts: await getInterFonts(), // Await properly within the async function
  };
};

async function getInterFonts(): Promise<Font[]> {
  // This is unfortunate but I can't figure out how to load local font files
  // when deployed to vercel.
  const [interRegular, interSemiBold, interBold] = await Promise.all([
    fetch(`https://fonts.cdnfonts.com/s/19795/Inter-Regular.woff`).then((res) =>
      res.arrayBuffer(),
    ),
    fetch(`https://fonts.cdnfonts.com/s/19795/Inter-SemiBold.woff`).then(
      (res) => res.arrayBuffer(),
    ),
    fetch(`https://fonts.cdnfonts.com/s/19795/Inter-Bold.woff`).then((res) =>
      res.arrayBuffer(),
    ),
  ]);

  return [
    {
      name: 'Inter',
      data: interRegular,
      style: 'normal',
      weight: 400,
    },
    {
      name: 'Inter',
      data: interSemiBold,
      style: 'normal',
      weight: 600,
    },
    {
      name: 'Inter',
      data: interBold,
      style: 'normal',
      weight: 700,
    },
  ];
}
