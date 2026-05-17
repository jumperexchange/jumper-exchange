import { promises as fsPromises } from 'node:fs';
import path from 'node:path';

import axios, { type AxiosRequestConfig } from 'axios';
import JSZip from 'jszip';

import {
  EXTENSION_NAME,
  EXTENSION_SOURCE,
} from '../constants/extensionConstants';
import { createChromeStoreExtension } from './extensionConfig';

import type {
  ChromeStoreExtensionConfig,
  ExtensionConfig,
  ExtensionName,
  GitHubExtensionConfig,
  LocalExtensionConfig,
} from '../constants/extensionConstants';

/**
 * Represents the structure of an extension's manifest.json file.
 */
type ExtensionManifest = {
  [key: string]: unknown;
  name?: string;
  side_panel?: unknown;
  version?: string;
};

/**
 * A function that applies modifications to an extension manifest.
 * @returns true if the manifest was modified, false otherwise.
 */
type ManifestPatcher = (manifest: ExtensionManifest) => boolean;

/**
 * Maps extension names to their respective manifest patchers.
 */
const manifestPatchers: Partial<Record<ExtensionName, ManifestPatcher>> = {
  [EXTENSION_NAME.METAMASK]: removeSidePanel,
};

/**
 * Base downloader for extension archives with extract/validate workflow.
 */
abstract class ExtensionDownloader<TConfig extends ExtensionConfig> {
  /**
   * Ensures the extension is downloaded and extracted to its target folder.
   */
  async downloadAndExtract(config: TConfig): Promise<string> {
    if (await pathHasEntries(config.extractPath)) {
      if (await this.isCachedExtensionValid(config)) {
        console.log(`${this.formatName(config)} extension already extracted.`);
        return config.extractPath;
      }
      console.log(
        `Cached ${this.formatName(config)} extension at ${config.extractPath} is invalid; re-extracting.`,
      );
      await fsPromises.rm(config.extractPath, { force: true, recursive: true });
    }

    await fsPromises.mkdir(path.dirname(config.extractPath), {
      recursive: true,
    });
    await fsPromises.mkdir(config.extractPath, { recursive: true });

    const tempFilePath = path.join(
      path.dirname(config.extractPath),
      this.getTempFileName(config),
    );
    try {
      await this.downloadArchive(config, tempFilePath);
      console.log('Extracting extension...');
      await this.extractArchive(tempFilePath, config.extractPath);
      console.log('Extraction complete.');

      const manifest = await validateExtractedExtension(config.extractPath);
      await applyManifestPatches(config.extractPath, config.name, manifest);

      return config.extractPath;
    } finally {
      await safeUnlink(tempFilePath);
    }
  }

  /**
   * Downloads the archive to a temp file and validates its size.
   */
  protected async downloadArchive(
    config: TConfig,
    tempFilePath: string,
  ): Promise<void> {
    const url = this.getDownloadUrl(config);
    console.log(`Downloading ${this.formatName(config)} from ${url} ...`);

    const response = await axios.get<ArrayBuffer>(
      url,
      this.getDownloadConfig(),
    );
    await fsPromises.writeFile(tempFilePath, Buffer.from(response.data));

    console.log('Download complete.');

    const { size } = await fsPromises.stat(tempFilePath);
    if (size === 0) {
      throw new Error('Downloaded file is empty.');
    }
  }

  /**
   * Extracts the downloaded archive into the output directory.
   */
  protected abstract extractArchive(
    archivePath: string,
    outputDir: string,
  ): Promise<void>;

  /**
   * Formats the extension label for logs.
   */
  protected formatName(config: TConfig): string {
    return config.name;
  }

  /**
   * Provides axios configuration for archive downloads.
   */
  protected getDownloadConfig(): AxiosRequestConfig {
    return {
      maxRedirects: 5,
      responseType: 'arraybuffer',
      timeout: 60_000,
      validateStatus: (status) => status >= 200 && status < 400,
    };
  }

  /**
   * Returns the download URL for the archive.
   */
  protected abstract getDownloadUrl(config: TConfig): string;

  /**
   * Returns the temp archive filename for the download.
   */
  protected abstract getTempFileName(config: TConfig): string;

  protected async isCachedExtensionValid(config: TConfig): Promise<boolean> {
    try {
      const manifest = await validateExtractedExtension(config.extractPath);
      return this.matchesConfig(manifest, config);
    } catch {
      return false;
    }
  }

  protected matchesConfig(
    _manifest: ExtensionManifest,
    _config: TConfig,
  ): boolean {
    return true;
  }
}

/**
 * Downloader for Chrome Web Store CRX artifacts.
 */
class ChromeStoreExtensionDownloader extends ExtensionDownloader<ChromeStoreExtensionConfig> {
  /**
   * Extracts a CRX archive into the target directory.
   * @param archivePath - Path to the CRX file.
   * @param outputDir - Directory to extract into.
   */
  protected extractArchive(
    archivePath: string,
    outputDir: string,
  ): Promise<void> {
    return extractCRX(archivePath, outputDir);
  }

  /**
   * Provides axios configuration for CRX downloads, including a Chrome User-Agent.
   * @returns The Axios request configuration.
   */
  protected getDownloadConfig(): AxiosRequestConfig {
    return {
      ...super.getDownloadConfig(),
      headers: { 'User-Agent': 'Chrome' },
    };
  }

  /**
   * Returns the Chrome Web Store CRX URL.
   * @param config - The Chrome Store extension configuration.
   * @returns The download URL.
   */
  protected getDownloadUrl(config: ChromeStoreExtensionConfig): string {
    return config.downloadUrl;
  }

  /**
   * Returns the temporary filename for the downloaded CRX.
   * @param config - The Chrome Store extension configuration.
   * @returns The filename based on the extension ID.
   */
  protected getTempFileName(config: ChromeStoreExtensionConfig): string {
    return `${config.id}.crx`;
  }
}

/**
 * Downloader for GitHub-hosted zip artifacts.
 */
class GitHubExtensionDownloader extends ExtensionDownloader<GitHubExtensionConfig> {
  /**
   * Extracts a zip archive into the target directory.
   * @param archivePath - Path to the zip file.
   * @param outputDir - Directory to extract into.
   */
  protected extractArchive(
    archivePath: string,
    outputDir: string,
  ): Promise<void> {
    return extractZipArchive(archivePath, outputDir);
  }

  /**
   * Formats the extension name for logs including its version.
   * @param config - The GitHub extension configuration.
   * @returns The formatted name (e.g., name@version).
   */
  protected formatName(config: GitHubExtensionConfig): string {
    return `${config.name}@${config.version}`;
  }

  /**
   * Returns the GitHub download URL.
   * @param config - The GitHub extension configuration.
   * @returns The download URL.
   */
  protected getDownloadUrl(config: GitHubExtensionConfig): string {
    return config.githubUrl;
  }

  /**
   * Returns the temporary filename for the downloaded zip.
   * @param config - The GitHub extension configuration.
   * @returns The filename based on ID and version.
   */
  protected getTempFileName(config: GitHubExtensionConfig): string {
    return `${config.id}_${config.version}.zip`;
  }

  protected matchesConfig(
    manifest: ExtensionManifest,
    config: GitHubExtensionConfig,
  ): boolean {
    return manifest.version === config.version;
  }
}

/**
 * Applies wallet-specific manifest patches after extraction.
 */
async function applyManifestPatches(
  extensionPath: string,
  walletName: ExtensionName,
  manifest: ExtensionManifest,
): Promise<void> {
  const patcher = manifestPatchers[walletName];
  if (!patcher) {
    return;
  }

  try {
    const updated = patcher(manifest);
    if (!updated) {
      return;
    }

    const manifestPath = path.join(extensionPath, 'manifest.json');
    await fsPromises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Updated ${walletName} manifest.json`);
  } catch (error) {
    console.log(
      `Failed to update ${walletName} manifest.json: ${formatErrorMessage(error)}`,
    );
  }
}

/**
 * Detects a single top-level directory inside a zip archive.
 */
function detectZipRootDir(entries: string[]): string {
  const rootDirs = entries
    .filter((name) => name.endsWith('/') && name.split('/').length === 2)
    .map((name) => name.split('/')[0]);
  return rootDirs.length === 1 ? `${rootDirs[0]}/` : '';
}

/**
 * Extracts a Chrome CRX archive into the output directory.
 */
async function extractCRX(
  crxFilePath: string,
  outputDir: string,
): Promise<void> {
  const buf = await fsPromises.readFile(crxFilePath);

  // Magic number "Cr24"
  if (buf[0] !== 67 || buf[1] !== 114 || buf[2] !== 50 || buf[3] !== 52) {
    throw new Error('Invalid header: Does not start with Cr24');
  }

  const version = buf.readUInt32LE(4);
  if (version !== 3) {
    throw new Error(`Unsupported CRX version: ${version}`);
  }

  const headerLength = buf.readUInt32LE(8);
  const zipStartOffset = 12 + headerLength;
  const zipBuffer = buf.subarray(zipStartOffset);

  await extractZipBuffer(zipBuffer, outputDir, false);
}

/**
 * Extracts a standard zip archive into the output directory.
 */
async function extractZipArchive(
  zipFilePath: string,
  outputDir: string,
): Promise<void> {
  const zipData = await fsPromises.readFile(zipFilePath);
  await extractZipBuffer(zipData, outputDir, true);
}

/**
 * Extracts a zip buffer into a target folder, optionally stripping the root directory.
 */
async function extractZipBuffer(
  zipBuffer: Buffer,
  outputDir: string,
  stripRootDir: boolean,
): Promise<void> {
  const zip = await JSZip.loadAsync(zipBuffer);
  const entries = Object.keys(zip.files);
  const rootDir = stripRootDir ? detectZipRootDir(entries) : '';
  const rootLen = rootDir.length;
  const resolvedOutputDir = path.resolve(outputDir);
  const outputDirPrefix = `${resolvedOutputDir}${path.sep}`;

  await Promise.all(
    entries.map(async (filename) => {
      if (filename === rootDir) {
        return;
      }

      const destFilename =
        rootLen > 0 && filename.startsWith(rootDir)
          ? filename.slice(rootLen)
          : filename;

      if (!destFilename) {
        return;
      }

      const file = zip.files[filename];
      const destPath = path.resolve(outputDir, destFilename);

      // Defence against zip-slip: reject entries that resolve outside outputDir.
      if (
        destPath !== resolvedOutputDir &&
        !destPath.startsWith(outputDirPrefix)
      ) {
        throw new Error(`Unsafe zip entry path: ${destFilename}`);
      }

      if (file.dir) {
        await fsPromises.mkdir(destPath, { recursive: true });
        return;
      }

      const content = await file.async('nodebuffer');
      await fsPromises.mkdir(path.dirname(destPath), { recursive: true });
      await fsPromises.writeFile(destPath, content);
    }),
  );
}

/**
 * Checks whether a file path exists.
 */
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fsPromises.stat(filePath);
    return true;
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

/**
 * Normalizes unknown errors into a readable message.
 */
function formatErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

/**
 * Type guard for Node.js errors with a code property.
 */
function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && 'code' in error;
}

/**
 * Checks whether a directory exists and contains entries.
 */
async function pathHasEntries(dirPath: string): Promise<boolean> {
  try {
    const entries = await fsPromises.readdir(dirPath);
    return entries.length > 0;
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return false;
    }
    throw error;
  }
}

/**
 * Removes the side panel entry from a manifest to avoid extension side panel issues.
 */
function removeSidePanel(manifest: ExtensionManifest): boolean {
  if (!('side_panel' in manifest)) {
    return false;
  }
  delete manifest.side_panel;
  return true;
}

/**
 * Removes a temporary file and logs cleanup failures.
 */
async function safeUnlink(filePath: string): Promise<void> {
  try {
    await fsPromises.unlink(filePath);
    console.log('Cleanup complete.');
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      return;
    }
    console.log(`Cleanup failed for ${filePath}: ${formatErrorMessage(error)}`);
  }
}

/**
 * Loads and validates manifest.json for an extracted extension.
 */
async function validateExtractedExtension(
  extractPath: string,
): Promise<ExtensionManifest> {
  const manifestPath = path.join(extractPath, 'manifest.json');
  let rawManifest: string;

  try {
    rawManifest = await fsPromises.readFile(manifestPath, 'utf8');
  } catch (error) {
    if (isNodeError(error) && error.code === 'ENOENT') {
      throw new Error(
        'Extracted extension is invalid: manifest.json not found',
      );
    }
    throw error;
  }

  try {
    const manifest = JSON.parse(rawManifest) as ExtensionManifest;
    const name = manifest.name ?? 'unknown';
    const version = manifest.version ?? 'unknown';
    console.log(`Validated extension: ${name} v${version}`);
    return manifest;
  } catch (error) {
    throw new Error(`Invalid manifest.json: ${formatErrorMessage(error)}`);
  }
}

const chromeStoreDownloader = new ChromeStoreExtensionDownloader();
const gitHubDownloader = new GitHubExtensionDownloader();

/**
 * Resolves an extension by source and ensures it is available on disk.
 * If the extension is already extracted, it skips the download.
 * @param wallet - The extension configuration.
 * @returns The path to the extracted extension.
 */
export async function downloadAndExtractWalletAuto(
  wallet: ExtensionConfig,
): Promise<string> {
  switch (wallet.source) {
    case EXTENSION_SOURCE.CHROME_STORE:
      return chromeStoreDownloader.downloadAndExtract(wallet);
    case EXTENSION_SOURCE.GITHUB:
      return gitHubDownloader.downloadAndExtract(wallet);
    case EXTENSION_SOURCE.LOCAL:
      return resolveLocalExtensionPath(wallet);
    default: {
      return wallet;
    }
  }
}

/**
 * Resolves the path for a local extension.
 * If the local folder is empty, it falls back to downloading the extension from the Chrome Web Store.
 * @param wallet - The local extension configuration.
 * @returns The path to the extension folder.
 */
async function resolveLocalExtensionPath(
  wallet: LocalExtensionConfig,
): Promise<string> {
  if (!(await pathHasEntries(wallet.extractPath))) {
    if (await fileExists(wallet.archivePath)) {
      console.log(
        `Extracting local ${wallet.name} extension from ${wallet.archivePath}.`,
      );
      await fsPromises.mkdir(path.dirname(wallet.extractPath), {
        recursive: true,
      });
      await fsPromises.mkdir(wallet.extractPath, { recursive: true });
      await extractZipArchive(wallet.archivePath, wallet.extractPath);

      const manifest = await validateExtractedExtension(wallet.extractPath);
      await applyManifestPatches(wallet.extractPath, wallet.name, manifest);

      return wallet.extractPath;
    }

    console.log(
      `Local extension missing for ${wallet.name}. Falling back to download.`,
    );
    const fallbackConfig = createChromeStoreExtension({
      id: wallet.id,
      name: wallet.name,
    });
    return chromeStoreDownloader.downloadAndExtract(fallbackConfig);
  }

  const version = wallet.version;
  if (version) {
    console.log(
      `Using local ${wallet.name} extension at ${wallet.extractPath} (README version ${version}).`,
    );
  } else {
    console.log(
      `Using local ${wallet.name} extension at ${wallet.extractPath}.`,
    );
  }

  await validateExtractedExtension(wallet.extractPath);
  return wallet.extractPath;
}
