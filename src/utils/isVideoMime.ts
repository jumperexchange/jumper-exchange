export const isVideoMime = (mime?: string | null): boolean =>
  typeof mime === 'string' &&
  mime.trim().toLowerCase().startsWith('video/');
