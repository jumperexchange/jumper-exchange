import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { useThemeStore } from 'src/stores/theme';
import { usePathname } from 'next/navigation';
import { AppPaths } from 'src/const/urls';

export const useGetPartnerThemeImage = () => {
  const configTheme = useThemeStore((state) => state.configTheme);
  const pathname = usePathname();
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();

  const shouldShowForChain =
    sourceChainToken?.chainId === configTheme.showForFromChain ||
    destinationChainToken?.chainId === configTheme.showForToChain;

  const shouldShowForPath = pathname === AppPaths.Main;

  const imageUrl =
    shouldShowForChain && shouldShowForPath
      ? configTheme?.backgroundImageUrl?.href
      : null;

  return imageUrl;
};
