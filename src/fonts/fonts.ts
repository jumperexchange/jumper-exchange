import { Inter, Manrope, Sora, Urbanist } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
});

export const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-urbanist',
});

export const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sora',
});

export const sequel65 = localFont({
  src: './customFonts/Sequel100Wide-65.woff2',
  variable: '--font-sequel-65',
});

export const sequel85 = localFont({
  src: './customFonts/Sequel100Wide-85.woff2',
  variable: '--font-sequel-85',
});

export const fonts = [inter, urbanist, sora, sequel65, sequel85, manrope];
