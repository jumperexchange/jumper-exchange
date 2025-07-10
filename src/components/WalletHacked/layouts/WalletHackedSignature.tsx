import { useCallback } from 'react';
import { ModalMenuPage } from 'src/components/WalletHacked/layouts/WalletHackedLayout';
import { useWalletSigning } from 'src/hooks/useWalletSigning';
import { WalletState } from '../types';

interface WalletHackedSignatureProps {
  title: string;
  description: string;
  buttonLabel: string;
  message: string;
  wallet: WalletState;
  setWallet: (wallet: WalletState) => void;
}

export const WalletHackedSignature = ({
  title,
  description,
  buttonLabel,
  message,
  wallet,
  setWallet,
}: WalletHackedSignatureProps) => {
  const { signWallet } = useWalletSigning();

  const handleSignature = useCallback(
    async (event?: React.MouseEvent) => {
      event?.stopPropagation();
      const signature = await signWallet(message);
      setWallet({
        ...wallet,
        signed: true,
        signature: signature as `0x${string}`,
        message,
      });
    },
    [wallet, signWallet, setWallet],
  );

  return (
    <ModalMenuPage
      title={title}
      text={description}
      buttonLabel={buttonLabel}
      onClickAction={handleSignature}
    />
  );
};
