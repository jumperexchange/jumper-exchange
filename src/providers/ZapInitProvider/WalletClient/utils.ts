import { createWalletClient, http, WalletClient } from 'viem';

const NEXUS_V120 = '0x000000004F43C49e93C970E84001853a70923B03';

// This will not actually work for json-rpc wallets
// We need to use privateKeyToAccount to create a wallet client
// and then use that to sign the authorization, otherwise it will throw an error
// https://docs.biconomy.io/new/getting-started/enable-mee-eoa-7702
export const createEIP7702Authorization = async (
  walletClient: WalletClient | undefined,
  currentChainId: number,
) => {
  if (!walletClient?.account) {
    throw new Error('No wallet client or account available');
  }

  const authorization = await createWalletClient({
    transport: http(),
    chain: walletClient.chain,
    account: walletClient.account,
  }).signAuthorization({
    chainId: currentChainId,
    address: NEXUS_V120,
  });

  return authorization;
};
