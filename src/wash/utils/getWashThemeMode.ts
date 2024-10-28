import type { cookies } from 'next/headers';

export const getWashThemeMode = (
  cookiesHandler: ReturnType<typeof cookies>,
) => {
  const pathname = cookiesHandler.get('pathname')?.value || '/';
  const segments = pathname.split('/').slice(0, 3);
  if (segments.includes('wash')) {
    return 'dark';
  }
  return undefined;
};
