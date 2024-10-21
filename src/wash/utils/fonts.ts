import { Inter, Modak, Titan_One } from 'next/font/google';

export const modak = Modak({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--modak-font',
});

export const titanOne = Titan_One({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--titan-one-font',
});

export const inter = Inter({
  weight: ['400', '500', '600', '700', '900'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--inter-font',
});
