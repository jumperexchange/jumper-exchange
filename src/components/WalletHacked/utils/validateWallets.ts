import { verifyMessage } from 'ethers';
import { EVMAddress } from 'src/types/internal';
import { isAddress } from 'viem';
import { WalletState } from '../types';

const isValidSignature = async (
  message: string,
  address: string,
  signature: string,
): Promise<boolean> => {
  const recovered = await verifyMessage(message, signature);
  return recovered.toLowerCase() === address.toLowerCase();
};

interface ValidateWalletResult {
  address: string;
  message: string;
  signature: EVMAddress;
}

const validateWallet = async (
  wallet: WalletState,
): Promise<ValidateWalletResult | false> => {
  if (!wallet.message || !wallet.signature || !wallet.account?.address) {
    return false;
  }
  const validAddress =
    wallet.account.address && isAddress(wallet.account.address);
  const validMessage = wallet.message && typeof wallet.message === 'string';
  const validSignature = isValidSignature(
    wallet.message,
    wallet.account?.address,
    wallet.signature,
  );

  if (!validAddress || !validMessage || !validSignature) {
    return false;
  }
  return {
    address: wallet.account?.address,
    message: wallet.message,
    signature: wallet.signature as EVMAddress,
  };
};

export const sanitizeAndValidateWallets = async (
  originWallet: WalletState,
  destinationWallet: WalletState,
) => {
  const sanitizedOriginWallet = await validateWallet(originWallet);
  const sanitizedDestinationWallet = await validateWallet(destinationWallet);
  if (!sanitizedOriginWallet || !sanitizedDestinationWallet) {
    throw new Error('Invalid wallets');
  }
  return {
    originWallet: sanitizedOriginWallet,
    destinationWallet: sanitizedDestinationWallet,
  };
};
