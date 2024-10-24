'use client';

import React from 'react';

import type { ReactElement, ReactNode } from 'react';
import { inter } from 'src/fonts/fonts';
import { Titan_One } from 'next/font/google';

export const titanOne = Titan_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--titan-one-font',
});

export function WithFonts({ children }: { children: ReactNode }): ReactElement {
  return (
    <div
      style={{
        fontFamily: `${inter.style.fontFamily}, ${titanOne.style.fontFamily}`,
      }}
    >
      <style jsx global>
        {`
          :root {
            --titan-one-font: ${titanOne.style.fontFamily};
          }
        `}
      </style>

      {children}
    </div>
  );
}
