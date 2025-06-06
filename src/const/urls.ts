import type { SitemapPage } from '@/types/sitemap';

export const JUMPER_URL = 'https://jumper.exchange';
export const DISCORD_URL = 'https://discord.gg/jumperexchange';
export const DISCORD_URL_INVITE = 'https://discord.com/invite/jumperexchange';
export const X_URL = 'https://x.com/JumperExchange';
export const GITHUB_URL = 'https://github.com/jumperexchange';
export const X_SHARE_URL = 'https://x.com/share';
export const FB_SHARE_URL = 'https://www.facebook.com/sharer/sharer.php';
export const LINKEDIN_SHARE_URL = 'https://www.linkedin.com/shareArticle';
export const JUMPER_LEARN_PATH = '/learn';
export const JUMPER_LOYALTY_PATH = '/profile';
export const JUMPER_SCAN_PATH = '/scan';
export const JUMPER_ZAP_PATH = '/zap';
export const JUMPER_BRIDGE_PATH = '/bridge';
export const JUMPER_SWAP_PATH = '/swap';
export const JUMPER_TX_PATH = '/tx';
export const JUMPER_WALLET_PATH = '/wallet';
export const JUMPER_QUESTS_PATH = '/quests';
export const JUMPER_CAMPAIGN_PATH = '/campaign';

export const DEFAULT_WALLET_ADDRESS =
  '0x0000000000000000000000000000000000000000';

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_BRANCH_URL}`
    : process.env.NEXT_PUBLIC_SITE_URL;
}

// prepare sitemap
export const pages: SitemapPage[] = [
  { path: '/', priority: 1.0 },
  { path: JUMPER_LEARN_PATH, priority: 0.9 },
  { path: JUMPER_LOYALTY_PATH, priority: 0.8 },
  { path: '/gas', priority: 0.7 },
];
