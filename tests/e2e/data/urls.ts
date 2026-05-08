export const URLS = {
  AERODROME_QUESTS: '/quests/rewards-from-aerodrome-on-base',
  DISCORD: 'https://discord.com/invite/jumperapp',
  EXPLORE_FILAMENT: '/quests/rewards-from-filament',
  GITHUB: 'https://github.com/jumperexchange',
  LEARN_LOCAL: '/learn',
  LINK3: 'https://link3.to/jumperexchange',
  MORPHO: 'https://morpho.org/',
  NEWSLETTER: '/newsletter',
  PORTFOLIO_LOCAL: '/portfolio',
  PRIVACY_POLICY: '/privacy-policy',
  SCAN_LOCAL: '/scan',
  TELEGRAM: 'https://t.me/jumperapp',
  TERMS_OF_BUSINESS: '/terms-of-business',
  X: 'https://x.com/jumperapp',
} as const;

export const UI_STRINGS = {
  SCAN_QR_CODE_TITLE: 'Scan this QR Code with your phone',
} as const;

export const WALLET_OPTIONS = {
  METAMASK: 'MetaMask',
  WALLET_CONNECT: 'WalletConnect',
} as const;

export const ROUTE_LABELS = {
  BEST_RETURN: 'Best Return',
  NO_ROUTES_AVAILABLE: 'No routes available',
  RELAY_VIA_LIFI: 'Relay via LI.FI',
  WELCOME_HEADING: 'Find the best route',
} as const;

export const CHAINS = {
  ETHEREUM: 'Ethereum',
  SOLANA: 'Solana',
} as const;

export type ChainName = (typeof CHAINS)[keyof typeof CHAINS];

export const JUMPER_BUTTONS = {
  CONNECT: 'Connect',
  PASS: 'Pass',
} as const;

// All known label variants for the swap/bridge tab. The label is driven by
// the `a-b-test-trade-display` AB test (JUM-797) and will change once
// JUM-838 ships "Swap & Bridge" to 100%. Tests must accept any of these
// since the test wallet's bucket is server-resolved per address and not
// overridable client-side.
export const TAB_LABELS = {
  EXCHANGE: 'Exchange',
  SWAP_AND_BRIDGE: 'Swap & Bridge',
  TRADE: 'Trade',
} as const;

export const EXCHANGE_TAB_LABEL_PATTERN = new RegExp(
  `^(${Object.values(TAB_LABELS).join('|')})$`,
);
