import { Inter, Manrope, Sora, Urbanist } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true,
});

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
  preload: false,
});

export const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
  preload: true,
});

export const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
  preload: false,
});

export const sequel65 = localFont({
  src: './customFonts/Sequel100Wide-65.woff2',
  variable: '--font-sequel-65',
  preload: false,
});

export const sequel85 = localFont({
  src: './customFonts/Sequel100Wide-85.woff2',
  variable: '--font-sequel-85',
  preload: false,
});

export const fonts = [inter, urbanist, sora, sequel65, sequel85, manrope];
