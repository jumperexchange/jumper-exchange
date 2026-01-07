import 'server-only';

import config from '@/config/env-config';
import { parse } from 'yaml';

interface DenyListData {
  wallets: string[];
  updatedAt: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedList: Set<string> = new Set();
let lastFetchTime = 0;
let isRefreshing = false;

function normalizeAddress(address: string): string {
  return address.toLowerCase().trim();
}

function getDenyListUrl(): string {
  const url = config.DENY_LIST_URL;
  if (!url) {
    throw new Error('DENY_LIST_URL environment variable is not set');
  }
  return url;
}

function getGithubToken(): string | undefined {
  return config.DENY_LIST_GITHUB_TOKEN;
}

async function fetchDenyList(): Promise<DenyListData> {
  const url = getDenyListUrl();
  const token = getGithubToken();

  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3.raw',
  };

  if (token) {
    headers.Authorization = `token ${token}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    throw new Error(
      `Failed to fetch deny list: ${response.status} ${response.statusText}`,
    );
  }

  const text = await response.text();
  const data = parse(text) as DenyListData;

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
    // Keep using cachedList - no update on error (graceful degradation)
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
