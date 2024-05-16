import { Inter, Urbanist } from 'next/font/google';
import localFont from 'next/font/local';

export const inter = Inter({ subsets: ['latin'] });
export const interVar = localFont({
  src: [
    { path: 'Inter-roman.var.woff2', weight: '100 900', style: 'normal' },
    { path: 'Inter-italic.var.woff2', weight: '100 900', style: 'italic' },
  ],
});
export const urbanist = Urbanist({ subsets: ['latin'] });
