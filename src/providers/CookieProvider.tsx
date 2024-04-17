'use client';
import type { PropsWithChildren } from 'react';
import type { Cookies } from 'react-cookie';
import { CookiesProvider as ReactCookiesProvider } from 'react-cookie';

interface CookieProviderProps {
  cookies?: Cookies;
}

export const CookieProvider: React.FC<
  PropsWithChildren<CookieProviderProps>
> = ({ children, cookies }) => {
  return (
    <ReactCookiesProvider cookies={cookies}>{children}</ReactCookiesProvider>
  );
};
