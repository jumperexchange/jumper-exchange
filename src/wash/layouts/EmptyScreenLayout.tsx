'use client';

import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import { titanOne } from 'src/wash/common/WithFonts';
import { WashText } from '../utils/theme';
import { ChainType } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';
import styled from '@emotion/styled';

import type { ReactElement } from 'react';

/**************************************************************************************************
 * Defining the styled components style for the EmptyScreenLayout component
 *************************************************************************************************/
const EmptyScreenLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;
const EmptyScreenLayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 560px;
  align-items: center;
`;
const EmptyScreenLayoutTitle = styled.h1`
  font-size: 56px;
  line-height: 56px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 16px;
  margin-top: 32px;
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
`;
const EmptyScreenLayoutText = styled(WashText)`
  margin-bottom: 24px;
  text-align: center;
  color: white;
`;

/**************************************************************************************************
 * EmptyScreenLayout: Component for displaying the empty screen layout
 *
 * This component renders the layout for when the user hasn't minted an NFT yet. It displays
 * a title, explanatory text, and either a "Mint NFT" button (if the wallet is connected) or
 * a "Connect wallet" button (if the wallet is not connected).
 *
 * The component uses the useAccount hook to check the wallet connection status,
 * the useWalletMenu hook to handle wallet connection, and the useWashTrading hook
 * to access the mint functionality.
 ************************************************************************************************/
export function EmptyScreenLayout(): ReactElement {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { openWalletMenu } = useWalletMenu();
  const { mint } = useWashTrading();

  return (
    <EmptyScreenLayoutContainer>
      <EmptyScreenLayoutContent>
        <EmptyScreenLayoutTitle>
          {'Hold your horses there! '}
        </EmptyScreenLayoutTitle>
        <EmptyScreenLayoutText className={'mb-6 text-center text-white'}>
          {
            "You've got to mint an NFT and then wash it clean with your trades. Your average bot farm could never..."
          }
        </EmptyScreenLayoutText>
        {account.isConnected ? (
          <Button theme={'pink'} title={'Mint NFT'} onClick={mint.onMint} />
        ) : (
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
        )}
      </EmptyScreenLayoutContent>
    </EmptyScreenLayoutContainer>
  );
}
