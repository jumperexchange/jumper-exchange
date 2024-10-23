'use client';

import type { ReactElement, ReactNode } from 'react';
import { inter } from 'src/fonts/fonts';
import { titanOne } from './fonts';

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
