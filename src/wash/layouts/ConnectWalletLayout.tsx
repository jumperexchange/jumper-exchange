'use client';

import { Button } from '../common/Button';
import { titanOne } from '../common/fonts';
import { WashText } from '../utils/theme';
import { ChainType } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';
import { useWashTrading } from '../contexts/useWashTrading';

/**************************************************************************************************
 * Defining the styled components style for the ConnectWalletLayout component
 *************************************************************************************************/
const ConnectWalletLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const ConnectWalletLayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 560px;
  align-items: center;
`;
const ConnectWalletLayoutTitle = styled.h1`
  font-size: 56px;
  line-height: 56px;
  font-weight: inherit;
  text-transform: uppercase;
  color: white;
  margin-left: 0;
  margin-right: 0;
  margin-bottom: 16px;
  margin-top: 32px;
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
`;
const ConnectWalletLayoutText = styled(WashText)`
  margin-bottom: 24px;
  text-align: center;
  color: white;
  margin-bottom: 24px;
  text-align: center;
  color: white;
`;

/**************************************************************************************************
 * ConnectWalletLayout: Component for displaying the empty screen layout
 *
 * This component renders the layout for when the user hasn't minted an NFT yet. It displays
 * a title, explanatory text, and either a "Mint NFT" button (if the wallet is connected) or
 * a "Connect wallet" button (if the wallet is not connected).
 *
 * The component uses the useAccount hook to check the wallet connection status,
 * the useWalletMenu hook to handle wallet connection, and the useWashTrading hook
 * to access the mint functionality.
 ************************************************************************************************/
export function ConnectWalletLayout(): ReactElement {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { openWalletMenu } = useWalletMenu();
  const { nft } = useWashTrading();

  return (
    <ConnectWalletLayoutContainer>
      <ConnectWalletLayoutContent>
        <ConnectWalletLayoutTitle>
          {'Hold your horses there! '}
        </ConnectWalletLayoutTitle>
        <ConnectWalletLayoutText>
          {
            "You've got to mint an NFT and then wash it clean with your trades. Your average bot farm could never..."
          }
        </ConnectWalletLayoutText>
        <Button
          title={'Connect wallet'}
          theme={'pink'}
          size={'long'}
          isBusy={account.isConnecting || (account.isConnected && !nft.isReady)}
          onClick={async () => {
            if (!account.isConnected) {
              openWalletMenu();
            }
          }}
        />
      </ConnectWalletLayoutContent>
    </ConnectWalletLayoutContainer>
  );
}
