import { ThemeProviderV2 } from '@/providers/ThemeProviderV2';
import { type PropsWithChildren } from 'react';
import { cookies } from 'next/headers';
import { getPartnerThemes } from '@/app/lib/getPartnerThemes';

interface AppProviderProps {
  children: React.ReactNode | JSX.Element;
  lang?: string;
}

export const AppProvider: React.FC<
  PropsWithChildren<AppProviderProps>
> = async ({ children, lang }) => {
  const s = await getPartnerThemes();
  const cookiesHandler = cookies();

  return (
    <ThemeProviderV2
      activeTheme={cookiesHandler.get('theme')?.value}
      themes={s.data}
    >
      {children}
    </ThemeProviderV2>
  );
};
