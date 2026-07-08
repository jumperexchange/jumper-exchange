export const URLS = {
  AERODROME_QUESTS: '/quests/rewards-from-aerodrome-on-base',
  DISCORD: 'https://discord.com/invite/jumperapp',
  EXPLORE_FILAMENT: '/quests/rewards-from-filament',
  GITHUB: 'https://github.com/jumperexchange',
  LEARN_LOCAL: '/learn',
  LINK3: 'https://link3.to/jumperapp_',
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

// Deeplink chain id → LiFi display name (the widget token card's subheader).
export const CHAIN_NAMES_BY_ID: Record<string, string> = {
  '1': 'Ethereum',
  '42161': 'Arbitrum',
};

export const JUMPER_BUTTONS = {
  CONNECT: 'Connect',
  PASS: 'Pass',
} as const;

// Widget tab names that render in EVERY feature-flag bucket: Simple always
// shows Swap & Bridge + Gas (Private is flag-gated), Advanced always shows
// Swap + Bridge (Limit is flag-gated). Anchor tests on these so runs stay
// deterministic across buckets.
export const WIDGET_TABS = {
  ADVANCED_BRIDGE: 'Bridge',
  SIMPLE_SWAP_AND_BRIDGE: 'Swap & Bridge',
} as const;
