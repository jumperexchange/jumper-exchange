/**
 * Google Drive Share Adapter
 *
 * Stores a Shamir recovery share as a JSON file inside a visible "Jumper Wallet Recovery"
 * folder in the user's Google Drive. The file is accessible directly from drive.google.com
 * even when the Jumper app is unavailable.
 *
 * Uses Google Identity Services (GIS) for OAuth2 token acquisition with the
 * `drive.file` scope (only files created by this app are accessible).
 */
import envConfig from '@/config/env-config';
import type {
  ShareMetadata,
  ShareStorageAdapter,
} from './ShareStorageAdapter.types';

const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DRIVE_FILES_URL = 'https://www.googleapis.com/drive/v3/files';
const DRIVE_UPLOAD_URL =
  'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
const SHARE_FILE_NAME = 'jumper-recovery-share.json';
const RECOVERY_FOLDER_NAME = 'Jumper Wallet Recovery';

const TOKEN_SESSION_KEY = 'jumper-gdrive-access-token';
const TOKEN_EXPIRY_KEY = 'jumper-gdrive-token-expiry';

function getCachedToken(): string | null {
  try {
    const token = sessionStorage.getItem(TOKEN_SESSION_KEY);
    const expiry = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!token || !expiry) {
      return null;
    }
    if (Date.now() >= Number(expiry)) {
      clearCachedToken();
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

function setCachedToken(token: string, expiresIn: number): void {
  try {
    sessionStorage.setItem(TOKEN_SESSION_KEY, token);
    sessionStorage.setItem(
      TOKEN_EXPIRY_KEY,
      String(Date.now() + expiresIn * 1000),
    );
  } catch {}
}

function clearCachedToken(): void {
  try {
    sessionStorage.removeItem(TOKEN_SESSION_KEY);
    sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  } catch {}
}

interface DriveFileMetadata {
  id: string;
  name: string;
}

interface DriveFileList {
  files: DriveFileMetadata[];
}

interface ShareFileContent {
  share: string;
  walletAddress: string;
  createdAt: number;
}

/**
 * Request an OAuth2 access token from Google Identity Services.
 * Returns null if the user cancels or the flow fails.
 */
function requestAccessToken(): Promise<string | null> {
  return new Promise((resolve) => {
    const clientId = envConfig['NEXT_PUBLIC_GOOGLE_CLIENT_ID'] ?? '';
    if (!clientId) {
      console.error(
        '[GoogleDriveShareAdapter] NEXT_PUBLIC_GOOGLE_CLIENT_ID is not configured',
      );
      resolve(null);
      return;
    }

    if (
      typeof window === 'undefined' ||
      !('google' in window) ||
      !(window as any).google?.accounts?.oauth2
    ) {
      console.error(
        '[GoogleDriveShareAdapter] Google Identity Services SDK not loaded',
      );
      resolve(null);
      return;
    }

    const tokenClient = (window as any).google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: SCOPES,
      callback: (response: any) => {
        if (response.error) {
          console.error(
            '[GoogleDriveShareAdapter] OAuth error:',
            response.error,
          );
          resolve(null);
          return;
        }
        const token = response.access_token as string;
        setCachedToken(token, response.expires_in ?? 3600);
        resolve(token);
      },
      error_callback: () => {
        resolve(null);
      },
    });

    tokenClient.requestAccessToken();
  });
}

/**
 * Return a valid access token: use the cached one if still fresh, otherwise
 * open the OAuth popup interactively.
 */
async function getOrRequestAccessToken(): Promise<string | null> {
  const cached = getCachedToken();
  if (cached) {
    return cached;
  }
  return requestAccessToken();
}

/**
 * Clear the cached token on auth errors and throw a descriptive error.
 */
function handleApiError(resp: Response, context: string): never {
  if (resp.status === 401 || resp.status === 403) {
    clearCachedToken();
  }
  throw new Error(`${context} (${resp.status})`);
}

/**
 * Find the "Jumper Wallet Recovery" folder in Drive, creating it if it doesn't exist.
 * Returns the folder ID.
 */
async function findOrCreateFolder(accessToken: string): Promise<string> {
  const query = encodeURIComponent(
    `name='${RECOVERY_FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder' and trashed=false`,
  );
  const searchResp = await fetch(
    `${DRIVE_FILES_URL}?q=${query}&fields=files(id,name)`,
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (!searchResp.ok) {
    handleApiError(searchResp, 'Drive folder search failed');
  }

  const { files } = await searchResp.json();
  if (files?.length) {
    return files[0].id as string;
  }

  const createResp = await fetch(DRIVE_FILES_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: RECOVERY_FOLDER_NAME,
      mimeType: 'application/vnd.google-apps.folder',
    }),
  });

  if (!createResp.ok) {
    handleApiError(createResp, 'Drive folder creation failed');
  }

  const folder = await createResp.json();
  return folder.id as string;
}

/**
 * Search the recovery folder for a file by name.
 */
async function findShareFile(
  accessToken: string,
): Promise<DriveFileMetadata | null> {
  const query = encodeURIComponent(
    `name='${SHARE_FILE_NAME}' and trashed=false`,
  );
  const url = `${DRIVE_FILES_URL}?q=${query}&fields=files(id,name)`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    handleApiError(response, 'Drive file search failed');
  }

  const data: DriveFileList = await response.json();
  return data.files?.[0] ?? null;
}

/**
 * Download the content of a Drive file by ID.
 */
async function downloadFile(
  accessToken: string,
  fileId: string,
): Promise<ShareFileContent> {
  const url = `${DRIVE_FILES_URL}/${fileId}?alt=media`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    handleApiError(response, 'Drive file download failed');
  }

  return response.json();
}

/**
 * Create (or overwrite) a JSON file in the recovery folder using multipart upload.
 */
async function uploadFile(
  accessToken: string,
  content: ShareFileContent,
  folderId: string,
  existingFileId?: string,
): Promise<boolean> {
  const metadata: Record<string, unknown> = {
    name: SHARE_FILE_NAME,
    mimeType: 'application/json',
  };

  if (!existingFileId) {
    metadata['parents'] = [folderId];
  }

  const boundary = '---jumper_share_boundary';
  const body = [
    `--${boundary}`,
    'Content-Type: application/json; charset=UTF-8',
    '',
    JSON.stringify(metadata),
    `--${boundary}`,
    'Content-Type: application/json',
    '',
    JSON.stringify(content),
    `--${boundary}--`,
  ].join('\r\n');

  const url = existingFileId
    ? `https://www.googleapis.com/upload/drive/v3/files/${existingFileId}?uploadType=multipart`
    : DRIVE_UPLOAD_URL;

  const method = existingFileId ? 'PATCH' : 'POST';

  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body,
  });

  if (!response.ok) {
    handleApiError(response, 'Drive file upload failed');
  }

  return true;
}

export class GoogleDriveShareAdapter implements ShareStorageAdapter {
  static readonly retrieval = 'auto' as const;
  readonly retrieval = GoogleDriveShareAdapter.retrieval;
  readonly type = 'googleDrive' as const;
  readonly label = 'Google Drive';

  async store(share: string, metadata: ShareMetadata): Promise<boolean> {
    try {
      const accessToken = await getOrRequestAccessToken();
      if (!accessToken) {
        return false;
      }

      const content: ShareFileContent = {
        share,
        walletAddress: metadata.walletAddress,
        createdAt: metadata.createdAt,
      };

      // Ensure the visible recovery folder exists
      const folderId = await findOrCreateFolder(accessToken);

      // Check for an existing file to overwrite
      const existing = await findShareFile(accessToken);
      await uploadFile(accessToken, content, folderId, existing?.id);

      // Token is no longer needed — discard it to limit its exposure.
      clearCachedToken();
      return true;
    } catch (error) {
      console.error('[GoogleDriveShareAdapter] store failed:', error);
      return false;
    }
  }

  async retrieve(metadata: ShareMetadata): Promise<string | null> {
    try {
      const accessToken = await getOrRequestAccessToken();
      if (!accessToken) {
        return null;
      }

      const file = await findShareFile(accessToken);
      if (!file) {
        return null;
      }

      const content = await downloadFile(accessToken, file.id);

      // Verify the file belongs to the expected wallet (skip when address
      // is unknown, e.g. during recovery after a full data wipe).
      if (
        metadata.walletAddress &&
        content.walletAddress !== metadata.walletAddress
      ) {
        console.warn(
          '[GoogleDriveShareAdapter] Wallet address mismatch in stored share',
        );
        return null;
      }

      // Return the full file content so the caller can extract the share data.
      return JSON.stringify(content);
    } catch (error) {
      console.error('[GoogleDriveShareAdapter] retrieve failed:', error);
      return null;
    }
  }

  async isAvailable(): Promise<boolean> {
    const token = await getOrRequestAccessToken();
    return token !== null;
  }
}
