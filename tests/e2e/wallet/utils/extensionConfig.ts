import path from 'node:path';

import { EXTENSION_SOURCE } from '../constants/extensionConstants';

import type {
  ChromeStoreExtensionConfig,
  ExtensionConfig,
  ExtensionName,
  GitHubExtensionConfig,
  LocalExtensionConfig,
} from '../constants/extensionConstants';

const CHROME_STORE =
  'https://clients2.google.com/service/update2/crx?response=redirect&prodversion=129.0.6668.72&acceptformat=crx2,crx3&x=id%3D';
const METAMASK_GITHUB =
  'https://github.com/MetaMask/metamask-extension/releases/download';

/**
 * Resolve the root path for an extension directory under the project.
 */
export const getRootExtensionPath = (name: ExtensionName): string =>
  path.resolve(process.cwd(), 'extensions', name);

/**
 * Resolve the local archive path for an extension bundle under the project.
 */
export const getRootExtensionArchivePath = (name: ExtensionName): string =>
  path.resolve(process.cwd(), 'extensions', `${name}.zip`);

/**
 * Build a Chrome Web Store-backed extension config.
 */
export const createChromeStoreExtension = (config: {
  id: string;
  name: ExtensionName;
}): ChromeStoreExtensionConfig => {
  const { id, name } = config;
  return {
    downloadUrl: `${CHROME_STORE}${id}%26uc`,
    extractPath: getRootExtensionPath(name),
    id,
    name,
    source: EXTENSION_SOURCE.CHROME_STORE,
  };
};

/**
 * Build a GitHub-backed extension config.
 */
export const createGitHubExtension = (config: {
  githubUrl?: string;
  id: string;
  name: ExtensionName;
  version: string;
}): GitHubExtensionConfig => {
  const { githubUrl, id, name, version } = config;
  return {
    extractPath: getRootExtensionPath(name),
    githubUrl:
      githubUrl ??
      `${METAMASK_GITHUB}/v${version}/metamask-chrome-${version}.zip`,
    id,
    name,
    source: EXTENSION_SOURCE.GITHUB,
    version,
  };
};

/**
 * Build a local extension config pointing to the extensions' folder.
 */
export const createLocalExtension = (config: {
  id: string;
  name: ExtensionName;
  version?: string;
}): LocalExtensionConfig => {
  const { id, name, version } = config;
  return {
    archivePath: getRootExtensionArchivePath(name),
    extractPath: getRootExtensionPath(name),
    id,
    name,
    source: EXTENSION_SOURCE.LOCAL,
    version,
  };
};

/**
 * Build an extension config based on source selection.
 */
export const createExtension = (config: {
  github?: boolean;
  githubUrl?: string;
  id: string;
  name: ExtensionName;
  version?: string;
}): ExtensionConfig => {
  if (config.github) {
    if (!config.version) {
      throw new Error(`GitHub extensions require a version for ${config.name}`);
    }
    return createGitHubExtension({
      githubUrl: config.githubUrl,
      id: config.id,
      name: config.name,
      version: config.version,
    });
  }
  return createChromeStoreExtension({ id: config.id, name: config.name });
};
