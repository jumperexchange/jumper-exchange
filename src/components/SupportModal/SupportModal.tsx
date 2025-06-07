'use client';

import { useMenuStore } from '@/stores/menu';
import { Support } from './Support';

export const SupportModal = () => {
  const [openSupportModal] = useMenuStore((state) => [state.openSupportModal]);

  if (!openSupportModal) return null;

  return <Support />;
};
