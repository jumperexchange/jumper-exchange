import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { type BrowserContext, chromium } from '@playwright/test';

import { attachCloudflareAccessHeaders } from '../../../utils/cloudflareAccess';
import * as extensionConstants from '../../constants/extensionConstants';
import { downloadAndExtractWalletAuto } from '../../utils/extensionUtils';
import {
  clearUserDataDir,
  createNewUserDataDirForParallelExecution,
} from '../../utils/util';

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const USER_DATA_DIR_BASE = path.join(MODULE_DIR, '../..', 'user_data');

/**
 * Launches a persistent Chromium context with the chosen wallet extension loaded.
 * @param walletName - Key of the extension in extensionConstants (e.g. EXTENSION_NAME.METAMASK)
 * @param testId - Identifier for isolation. Defaults to TEST_WORKER_INDEX so each
 *   Playwright worker gets its own Chromium profile — required for parallel execution
 *   with a loaded extension (Chromium cannot share a user-data-dir across concurrent workers).
 */
export async function launchBrowserWithExtension(
  walletName: keyof typeof extensionConstants,
  testId: string = `worker-${process.env.TEST_WORKER_INDEX ?? '0'}`,
): Promise<BrowserContext> {
  const useParallelUserDataDir = true;

  const userDataDir = getUserDataDir(testId, useParallelUserDataDir);
  prepareUserDataDir(userDataDir, useParallelUserDataDir);

  const walletConfig = getWalletConfig(walletName);
  const extensionPath = await downloadAndExtractWalletAuto(walletConfig);

  const channel = resolveChromiumChannel();
  const extraArgs = parseChromiumArgs(process.env.CHROMIUM_ARGS);
  const isCi = isTrueEnv('CI');

  logLaunchInfo(channel);

  const context = await chromium.launchPersistentContext(userDataDir, {
    args: buildChromiumArgs(extensionPath, extraArgs, isCi),
    // Pages created from this context (the wallet's MetaMask tab + any
    // `walletContext.newPage()` for Jumper) need a baseURL so `goto("/")`,
    // `goto("/earn")` etc. resolve. Playwright's top-level `use.baseURL`
    // does not propagate to manually-launched persistent contexts.
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    channel,
    headless: false,
    // Playwright 1.58 rejects `viewport: null` paired with the implicit
    // deviceScaleFactor on macOS — set an explicit viewport everywhere.
    viewport: { height: 720, width: 1280 },
  });

  await attachCloudflareAccessHeaders(context);

  logBrowserVersion(context);
  return context;
}

/**
 * Build Chromium args for extension loading and CI sizing.
 */
function buildChromiumArgs(
  extensionPath: string,
  extraArgs: string[],
  isCi: boolean,
): string[] {
  return [
    '--start-maximized',
    ...(isCi ? ['--window-size=1280,720'] : []),
    ...extraArgs,
    `--disable-extensions-except=${extensionPath}`,
    `--load-extension=${extensionPath}`,
  ];
}

/**
 * Resolve the user data directory based on parallel execution settings.
 */
function getUserDataDir(
  testId: string,
  useParallelUserDataDir: boolean,
): string {
  const dirName = useParallelUserDataDir ? `test-${testId}` : 'test-default';
  return path.join(USER_DATA_DIR_BASE, dirName);
}

function getWalletConfig(
  walletName: keyof typeof extensionConstants,
): extensionConstants.ExtensionConfig {
  return extensionConstants[walletName] as extensionConstants.ExtensionConfig;
}

function isTrueEnv(key: string): boolean {
  return String(process.env[key] ?? '').toLowerCase() === 'true';
}

function logBrowserVersion(context: BrowserContext): void {
  console.log('Browser version:', context.browser()?.version());
}

function logLaunchInfo(channel: string): void {
  console.log(`Launching browser with channel: ${channel}`);
}

/**
 * Parse Chromium args from a comma-delimited env value.
 */
function parseChromiumArgs(rawArgs: string | undefined): string[] {
  return (rawArgs || '')
    .split(',')
    .map((arg) => arg.trim())
    .filter(Boolean);
}

/**
 * Prepare the user data directory: always clear it so each test launches into
 * fresh MetaMask onboarding. Without this, the second run would boot into an
 * already-onboarded-but-locked extension and the import flow can't proceed.
 * Per-worker isolation is preserved by the directory path (test-worker-N).
 */
function prepareUserDataDir(
  userDataDir: string,
  _useParallelUserDataDir: boolean,
): void {
  clearUserDataDir(userDataDir);
  createNewUserDataDirForParallelExecution(userDataDir);
}

/**
 * Resolve the Chromium channel dynamically
 */
function resolveChromiumChannel(): string {
  const channel = (process.env.BROWSER_CHANNEL || 'chromium').toLowerCase();

  const allowed = ['chromium', 'chrome', 'msedge'];
  if (!allowed.includes(channel)) {
    throw new Error(
      `Unsupported BROWSER_CHANNEL="${channel}". ` +
        `Allowed values: ${allowed.join(', ')}`,
    );
  }

  return channel;
}
