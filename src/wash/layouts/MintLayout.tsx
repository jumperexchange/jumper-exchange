'use client';

import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import { titanOne } from '../common/fonts';
import { mq, WashText } from '../utils/theme';
import styled from '@emotion/styled';

import { Fragment, type ReactElement } from 'react';

/**************************************************************************************************
 * Defining the styled components style for the MintLayout component
 *************************************************************************************************/
const MintLayoutContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding-top: 28vh;
`;
const MintLayoutContent = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 560px;
  align-items: center;
`;
const MintLayoutTitle = styled.h1`
  font-size: 56px;
  line-height: 56px;
  text-transform: uppercase;
  color: white;
  margin-bottom: 16px;
  margin-top: 32px;
  text-align: center;
  font-family: ${titanOne.style.fontFamily};
  z-index: 10;
  ${mq[0]} {
    font-size: 32px;
    line-height: 32px;
  }
  ${mq[1]} {
    font-size: 48px;
    line-height: 48px;
  }
`;
const MintLayoutText = styled(WashText)`
  margin-bottom: 24px;
  text-align: center;
  color: white;
  margin-bottom: 24px;
  text-align: center;
  color: white;
  ${mq[0]} {
    font-size: 16px;
    line-height: 16px;
  }
`;

/**************************************************************************************************
 * MintLayout: Component for displaying the empty screen layout
 *
 * This component renders the layout for when the user hasn't minted an NFT yet. It displays
 * a title, explanatory text, and either a "Mint NFT" button (if the wallet is connected) or
 * a "Connect wallet" button (if the wallet is not connected).
 *
 * The component uses the useAccount hook to check the wallet connection status,
 * the useWalletMenu hook to handle wallet connection, and the useWashTrading hook
 * to access the mint functionality.
 ************************************************************************************************/
export function MintLayout(): ReactElement {
  const { mint, nft } = useWashTrading();

  if (!nft.isReady) {
    return <Fragment />;
  }

  return (
    <MintLayoutContainer>
      <MintLayoutContent>
        <MintLayoutTitle>{'Hold your horses there! '}</MintLayoutTitle>
        <MintLayoutText>
          {
            "You've got to mint an NFT and then wash it clean with your trades. Your average bot farm could never..."
          }
        </MintLayoutText>
        <Button
          isBusy={nft.isLoading || mint.isMinting}
          theme={'pink'}
          title={'Mint NFT'}
          onClick={mint.onMint}
        />
      </MintLayoutContent>
    </MintLayoutContainer>
  );
}
