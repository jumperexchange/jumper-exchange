const PLAYABLE_VIDEO_MIME_TYPES = new Set([
  'video/mp4',
  'video/webm',
  'video/ogg',
]);

const normalizeMime = (mime: string): string => mime.trim().toLowerCase();

const getBaseMimeType = (mime: string): string =>
  normalizeMime(mime).split(';')[0]?.trim() ?? '';

export const canBrowserPlayVideoMime = (mime: string): boolean => {
  if (typeof document === 'undefined') {
    return PLAYABLE_VIDEO_MIME_TYPES.has(getBaseMimeType(mime));
  }

  const support = document
    .createElement('video')
    .canPlayType(normalizeMime(mime));

  return support === 'probably' || support === 'maybe';
};

export const isVideoMime = (mime?: string | null): boolean => {
  if (typeof mime !== 'string' || !mime.trim()) {
    return false;
  }

  const baseMime = getBaseMimeType(mime);

  if (!baseMime.startsWith('video/')) {
    return false;
  }

  return PLAYABLE_VIDEO_MIME_TYPES.has(baseMime);
};
