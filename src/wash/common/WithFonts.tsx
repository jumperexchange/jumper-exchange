'use client';

import React from 'react';
import { Inter, Modak, Titan_One } from 'next/font/google';

import type { ReactElement, ReactNode } from 'react';

const modak = Modak({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--modak-font',
});

const titanOne = Titan_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--titan-one-font',
});

const inter = Inter({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--inter-font',
});

export function WithFonts({ children }: { children: ReactNode }): ReactElement {
  return (
    <div
      style={{
        fontFamily: `${inter.style.fontFamily}, ${modak.style.fontFamily}, ${titanOne.style.fontFamily}`,
      }}
    >
      <style jsx global>
        {`
          :root {
            --inter-font: ${inter.style.fontFamily};
            --modak-font: ${modak.style.fontFamily};
            --titan-one-font: ${titanOne.style.fontFamily};
          }
        `}
      </style>

      {children}
    </div>
  );
}
