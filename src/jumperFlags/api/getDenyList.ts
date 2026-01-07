import 'server-only';

import config from '@/config/env-config';
import { App } from '@octokit/app';
import { parse } from 'yaml';

interface DenyListData {
  wallets: string[];
  updatedAt: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedList: Set<string> = new Set();
let lastFetchTime = 0;
let isRefreshing = false;
let octokitApp: App | null = null;

function normalizeAddress(address: string): string {
  return address.toLowerCase().trim();
}

function getOctokitApp(): App {
  if (octokitApp) {
    return octokitApp;
  }

  const appId = config.ALLOWLIST_APP_ID;
  const privateKey = config.ALLOWLIST_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error(
      'ALLOWLIST_APP_ID and ALLOWLIST_PRIVATE_KEY environment variables are required',
    );
  }

  octokitApp = new App({
    appId,
    privateKey: privateKey.replace(/\\n/g, '\n'),
  });

  return octokitApp;
}

function getDenyListFilePath(): string {
  const nodeEnv = config.NODE_ENV || 'development';
  return `users/denied.${nodeEnv}.yaml`;
}

async function fetchDenyList(): Promise<DenyListData> {
  const installationId = config.ALLOWLIST_INSTALLATION_ID;
  const repoOwner = config.ALLOWLIST_REPO_OWNER;
  const repoName = config.ALLOWLIST_REPO_NAME;
  const filePath = getDenyListFilePath();

  if (!installationId || !repoOwner || !repoName) {
    throw new Error(
      'ALLOWLIST_INSTALLATION_ID, ALLOWLIST_REPO_OWNER, and ALLOWLIST_REPO_NAME are required',
    );
  }

  const app = getOctokitApp();
  const octokit = await app.getInstallationOctokit(Number(installationId));

  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner: repoOwner,
      repo: repoName,
      path: filePath,
      headers: {
        Accept: 'application/vnd.github.raw+json',
      },
    },
  );

  if (typeof response.data !== 'string') {
    throw new Error('Unexpected response format from GitHub API');
  }

  const data = parse(response.data) as DenyListData;

  if (!data || !Array.isArray(data.wallets)) {
    throw new Error('Invalid deny list format: missing wallets array');
  }

  return data;
}

export async function refreshDenyList(): Promise<void> {
  if (isRefreshing) {
    return;
  }

  isRefreshing = true;

  try {
    const data = await fetchDenyList();
    cachedList = new Set(data.wallets.map(normalizeAddress));
    lastFetchTime = Date.now();
  } catch (error) {
    console.error('Failed to refresh deny list, keeping previous:', error);
  } finally {
    isRefreshing = false;
  }
}

async function ensureFreshCache(): Promise<void> {
  const now = Date.now();
  const cacheExpired = now - lastFetchTime > CACHE_TTL_MS;

  if (cacheExpired || cachedList.size === 0) {
    await refreshDenyList();
  }
}

export async function isWalletBlocked(address: string): Promise<boolean> {
  await ensureFreshCache();
  return cachedList.has(normalizeAddress(address));
}

export async function getBlockedWalletsCount(): Promise<number> {
  await ensureFreshCache();
  return cachedList.size;
}
