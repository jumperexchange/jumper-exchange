import {
  JUMPER_BRIDGE_PATH,
  JUMPER_LEARN_PATH,
  JUMPER_LOYALTY_PATH,
  JUMPER_SCAN_PATH,
  JUMPER_SWAP_PATH,
} from '@/const/urls';
import { usePathname } from 'next/navigation';

interface useMainPathsProps {
  isMainPaths: boolean;
}

export const useMainPaths = (): useMainPathsProps => {
  const pathname = usePathname();

  const isGas = pathname?.includes('/gas');
  const isBuy = pathname?.includes('/buy');
  //Todo: find better way to check
  const isExchange =
    !pathname?.includes(JUMPER_SWAP_PATH) &&
    !pathname?.includes(JUMPER_LOYALTY_PATH) &&
    !pathname?.includes(JUMPER_LEARN_PATH) &&
    !pathname?.includes(JUMPER_SCAN_PATH) &&
    !pathname?.includes(JUMPER_BRIDGE_PATH) &&
    (pathname === '/' ||
      pathname?.split('/').length === 3 ||
      pathname?.split('/').length === 2);

  return {
    isMainPaths: isGas || isBuy || isExchange,
  };
};
