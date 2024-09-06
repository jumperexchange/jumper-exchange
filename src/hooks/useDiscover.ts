import { usePathname } from 'next/navigation';
import { JUMPER_DISCOVER_PATH } from 'src/const/urls';

interface useDiscoverProps {
  isDiscover: boolean;
}

export const useDiscover = (): useDiscoverProps => {
  const pathname = usePathname();

  return {
    isDiscover: pathname?.includes(JUMPER_DISCOVER_PATH) ?? false,
  };
};
