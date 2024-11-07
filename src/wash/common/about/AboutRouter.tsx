import type { ReactElement } from 'react';
import { Button } from 'src/wash/common/Button';
import {
  useWashTrading,
  WashTradingContextApp,
} from 'src/wash/contexts/useWashTrading';
import styled from '@emotion/styled';
import { ChainType } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import { useRouter } from 'next/navigation';

const ButtonWrapper = styled.div`
  display: flex;
  margin: 40px 0 64px;
  max-width: 1200px;
  justify-content: center;
`;
function AboutRouter(): ReactElement {
  const { mint, nft } = useWashTrading();
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { openWalletMenu } = useWalletMenu();
  const router = useRouter();

  /************************************************************************************************
   * getButton: Function to determine which button to display based on the current state
   * This function checks the following conditions:
   * 1. If the wallet is not connected, it returns a "Connect wallet" button
   * 2. If the user has an NFT that's not revealed, it returns a "Wash NFT" button
   * 3. Otherwise, it returns a "Mint NFT" button
   ************************************************************************************************/
  const getButton = (): ReactElement => {
    if (!account.isConnected) {
      return (
        <Button
          title={'Connect wallet'}
          theme={'pink'}
          size={'long'}
          onClick={async () => {
            if (!account.isConnected) {
              openWalletMenu();
            }
          }}
        />
      );
    }
    if (nft.hasNFT && !nft.nft?.isRevealed) {
      return (
        <Button
          title={'Wash NFT'}
          theme={'pink'}
          size={'long'}
          onClick={() => router.push('/wash')}
        />
      );
    }
    return (
      <Button
        title={'Mint NFT'}
        theme={'pink'}
        size={'long'}
        onClick={mint.onMint}
        isBusy={mint.isMinting}
      />
    );
  };

  return <ButtonWrapper>{getButton()}</ButtonWrapper>;
}

export function AboutRouterWithContext(): ReactElement {
  return (
    <WashTradingContextApp>
      <AboutRouter />
    </WashTradingContextApp>
  );
}
