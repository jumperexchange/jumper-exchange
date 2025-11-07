import { usePathname } from 'next/navigation';
import { AppPaths } from 'src/const/urls';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { useThemeStore } from 'src/stores/theme';

export const useThemeConditionsMet = () => {
  const pathname = usePathname();
  const configTheme = useThemeStore((state) => state.configTheme);
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  const shouldShowForChain =
    sourceChainToken?.chainId === configTheme.showForFromChain ||
    destinationChainToken?.chainId === configTheme.showForToChain;
  const shouldShowForPath = pathname === AppPaths.Main;
  return shouldShowForChain && shouldShowForPath;
};
