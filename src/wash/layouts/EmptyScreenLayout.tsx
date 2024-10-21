'use client';

import { Button } from '../common/Button';
import { useWashTrading } from '../contexts/useWashTrading';
import { titanOne } from '../utils/fonts';
import { WashText } from '../utils/theme';
import { cl } from '../utils/utils';
import { ChainType } from '@lifi/sdk';
import { useAccount, useWalletMenu } from '@lifi/wallet-management';

import type { ReactElement } from 'react';

export function EmptyScreenLayout(): ReactElement {
  const { account } = useAccount({ chainType: ChainType.SVM });
  const { openWalletMenu } = useWalletMenu();
  const { mint } = useWashTrading();

  return (
    <div className={'flex w-full flex-col items-center justify-center'}>
      <div className={'flex max-w-[560px] flex-col items-center'}>
        <h1
          className={cl(
            'uppercase text-white',
            'mb-4 mt-8 text-center text-[56px] leading-[56px]',
            titanOne.className,
          )}
        >
          {'Hold your horses there! '}
        </h1>
        <WashText className={'mb-6 text-center text-white'}>
          {
            'You’ve got to mint an NFT and then wash it clean with your trades. Your average bot farm could never...'
          }
        </WashText>
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
      </div>
    </div>
  );
}
