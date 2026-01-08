import 'server-only';

import config from '@/config/env-config';
import { App } from '@octokit/app';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parse } from 'yaml';

interface DenyListEntry {
  address: string;
  reason?: string;
  status?: string;
}

type DenyListData = DenyListEntry[];

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

let cachedList: Set<string> = new Set();
let lastFetchTime = 0;
let isRefreshing = false;
let octokitApp: App | null = null;

function normalizeAddress(address: string): string {
  return address.toLowerCase().trim();
}

function getDenyListFileName(): string {
  const nodeEnv = config.NEXT_PUBLIC_ENVIRONMENT || 'development';
  return `denied.${nodeEnv}.yaml`;
}

function getDenyListFilePath(): string {
  return `users/${getDenyListFileName()}`;
}

function isGithubConfigured(): boolean {
  return !!(
    config.ALLOWLIST_APP_ID &&
    config.ALLOWLIST_PRIVATE_KEY &&
    config.ALLOWLIST_INSTALLATION_ID &&
    config.ALLOWLIST_REPO
  );
}

function parseOrgAndRepo(): { owner: string; repo: string } {
  const [owner, repo] = config.ALLOWLIST_REPO!.split('/');
  return { owner, repo };
}

function isDevelopmentOrTest(): boolean {
  const nodeEnv = config.NODE_ENV || 'development';
  return nodeEnv === 'development' || nodeEnv === 'test';
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

function parseDenyListData(content: string): DenyListData {
  const data = parse(content);

  if (!Array.isArray(data)) {
    throw new Error('Invalid deny list format: expected an array');
  }

  return data as DenyListData;
}

async function fetchDenyListFromGithub(): Promise<DenyListData> {
  const installationId = config.ALLOWLIST_INSTALLATION_ID;
  const { owner, repo } = parseOrgAndRepo();
  const filePath = getDenyListFilePath();

  const app = getOctokitApp();
  const octokit = await app.getInstallationOctokit(Number(installationId));

  const response = await octokit.request(
    'GET /repos/{owner}/{repo}/contents/{path}',
    {
      owner,
      repo,
      path: filePath,
      headers: {
        Accept: 'application/vnd.github.raw+json',
      },
    },
  );

  if (typeof response.data !== 'string') {
    throw new Error('Unexpected response format from GitHub API');
  }

  return parseDenyListData(response.data);
}

async function fetchDenyListLocally(): Promise<DenyListData> {
  const localPath = join(process.cwd(), 'data', getDenyListFileName());
  const content = await readFile(localPath, 'utf-8');
  return parseDenyListData(content);
}

function getEmptyDenyList(): DenyListData {
  return [];
}

async function fetchDenyList(): Promise<DenyListData> {
  if (isGithubConfigured()) {
    return fetchDenyListFromGithub();
  }

  if (isDevelopmentOrTest()) {
    try {
      return await fetchDenyListLocally();
    } catch (error) {
      console.warn(
        'GitHub not configured and local deny list not found, using empty list:',
        error,
      );
      return getEmptyDenyList();
    }
  }

  throw new Error(
    'ALLOWLIST_APP_ID, ALLOWLIST_PRIVATE_KEY, ALLOWLIST_INSTALLATION_ID, and ALLOWLIST_REPO are required in production',
  );
}

export async function refreshDenyList(): Promise<void> {
  if (isRefreshing) {
    return;
  }

  isRefreshing = true;

  try {
    const data = await fetchDenyList();
    cachedList = new Set(data.map((entry) => normalizeAddress(entry.address)));
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
