import { ChainId } from '@lifi/sdk';
import Link from 'next/link';
import { useChainTokenSelectionStore } from 'src/stores/chainTokenSelection';
import { BackgroundFooterImage } from './Widgets/WidgetsContainer.style';
import { useMainPaths } from 'src/hooks/useMainPaths';

export const PartnerThemeFooterImage = () => {
  const { sourceChainToken, destinationChainToken } =
    useChainTokenSelectionStore();
  const { isMainPaths } = useMainPaths();

  const activeChainAlert =
    sourceChainToken?.chainId === ChainId.SEI ||
    destinationChainToken?.chainId === ChainId.SEI ||
    sourceChainToken?.chainId === ChainId.SOL ||
    destinationChainToken?.chainId === ChainId.SOL;

  return (
    !activeChainAlert &&
    isMainPaths && (
      <Link href={''} target="_blank" style={{ zIndex: 1 }}>
        <BackgroundFooterImage
          alt="footer-image"
          src={''}
          width={300}
          height={200}
        />
      </Link>
    )
  );
};
