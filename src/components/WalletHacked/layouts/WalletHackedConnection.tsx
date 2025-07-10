import { useWalletMenu } from '@lifi/wallet-management';
import { useCallback } from 'react';
import { WalletHackedStep } from 'src/components/WalletHacked/layouts/WalletHackedStep';
import { useWalletHacked } from '../context/WalletHackedContext';

interface WalletHackedConnectionProps {
  title: string;
  description: string;
  buttonLabel: string;
}

export const WalletHackedConnection = ({
  title,
  description,
  buttonLabel,
}: WalletHackedConnectionProps) => {
  const { error } = useWalletHacked();
  const { openWalletMenu } = useWalletMenu();

  const handleWalletMenu = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      openWalletMenu();
    },
    [openWalletMenu],
  );

  return (
    <WalletHackedStep
      buttonLabel={buttonLabel}
      error={error}
      disabled={false}
      onClickAction={handleWalletMenu}
      title={title}
      text={description}
    />
  );
};
