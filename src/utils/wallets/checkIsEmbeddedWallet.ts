import { Account } from '@lifi/wallet-management';

const EMBEDDED_WALLETS = [
  'magic',
  'privy',
  'dynamic',
  'thirdweb',
  'particle',
  'web3auth',
  'fireblocks',
  'fortmatic',
  'torus',
  'capsule',
  'turnkey',
  'dfns',
];

export const checkIsEmbeddedWallet = (account: Account) => {
  if (!account?.connector) return false;

  const connector = account.connector as any;

  // Check explicit flags first
  if (
    connector.isEmbedded === true ||
    connector.custodial === true ||
    connector.options?.isEmbedded === true
  ) {
    return true;
  }

  // If explicitly injected, it's external
  if (connector.isInjected === true || connector.type === 'injected') {
    return false;
  }

  // Check by wallet name/id
  const name = (connector.name || '').toLowerCase();
  const id = (connector.id || '').toLowerCase();

  return EMBEDDED_WALLETS.some(
    (wallet) => name.includes(wallet) || id.includes(wallet),
  );
};
