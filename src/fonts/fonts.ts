import { Inter, Sora, Urbanist } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const urbanist = Urbanist({
  subsets: ['latin'],
  display: 'swap',
});

export const sora = Sora({
  subsets: ['latin'],
  display: 'swap',
});

export const sequel65 = localFont({
  src: './customFonts/Sequel100Wide-65.woff2',
});

export const sequel85 = localFont({
  src: './customFonts/Sequel100Wide-85.woff2',
});
