export const isVideoMime = (mime?: string | null): boolean =>
  typeof mime === 'string' && mime.startsWith('video/');
