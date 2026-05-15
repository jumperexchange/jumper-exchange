import { createGitHubExtension } from '../utils/extensionConfig';

/**
 * Represents the source from which an extension is retrieved.
 * 'chromeStore' - Download from Google Chrome Web Store.
 * 'github' - Download from GitHub releases.
 * 'local' - Use a locally provided extension folder.
 */
export const EXTENSION_SOURCE = {
  CHROME_STORE: 'chromeStore',
  GITHUB: 'github',
  LOCAL: 'local',
} as const;

export type ExtensionSource =
  (typeof EXTENSION_SOURCE)[keyof typeof EXTENSION_SOURCE];

/**
 * Supported wallet extension names.
 */
export const EXTENSION_NAME = {
  METAMASK: 'metamask',
} as const;

/**
 * Configuration for extensions downloaded from the Chrome Web Store.
 */
export interface ChromeStoreExtensionConfig extends BaseExtensionConfig {
  /** URL for direct CRX download */
  downloadUrl: string;
  source: typeof EXTENSION_SOURCE.CHROME_STORE;
}

export type ExtensionConfig =
  | ChromeStoreExtensionConfig
  | GitHubExtensionConfig
  | LocalExtensionConfig;

export type ExtensionName =
  (typeof EXTENSION_NAME)[keyof typeof EXTENSION_NAME];

/**
 * Configuration for extensions downloaded from GitHub releases.
 */
export interface GitHubExtensionConfig extends BaseExtensionConfig {
  /** URL to the specific release asset (zip) */
  githubUrl: string;
  source: typeof EXTENSION_SOURCE.GITHUB;
  /** Version string of the release */
  version: string;
}

/**
 * Configuration for locally provided extensions.
 */
export interface LocalExtensionConfig extends BaseExtensionConfig {
  /** Local archive path for the extension bundle */
  archivePath: string;
  source: typeof EXTENSION_SOURCE.LOCAL;
  /** Version string of the local extension (for logging) */
  version?: string;
}

/**
 * Base configuration common to all extension sources.
 */
interface BaseExtensionConfig {
  /** Path where the extension should be extracted or located */
  extractPath: string;
  /** Unique extension ID (e.g., from Chrome Web Store) */
  id: string;
  /** Human-readable name of the extension */
  name: ExtensionName;
  /** The source type of the extension */
  source: ExtensionSource;
}

/**
 * Extension definitions.
 */
export const metamask = createGitHubExtension({
  id: 'nkbihfbeogaeaoehlefnkodbefgpgknn',
  name: EXTENSION_NAME.METAMASK,
  version: '13.16.0',
});

/**
 * Extension registry indexed by extension name.
 */
export const extensions: Record<ExtensionName, ExtensionConfig> = {
  [EXTENSION_NAME.METAMASK]: metamask,
};
