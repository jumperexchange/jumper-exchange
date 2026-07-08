import { afterEach, describe, expect, it, vi } from 'vitest';
import { canBrowserPlayVideoMime, isVideoMime } from './isVideoMime';

describe('isVideoMime', () => {
  it('returns true for browser-playable video MIME types', () => {
    expect(isVideoMime('video/mp4')).toBe(true);
    expect(isVideoMime('video/webm')).toBe(true);
    expect(isVideoMime('video/ogg')).toBe(true);
  });

  it('normalizes MIME values before checking', () => {
    expect(isVideoMime('  VIDEO/MP4  ')).toBe(true);
    expect(isVideoMime('video/mp4; codecs="avc1.42E01E"')).toBe(true);
  });

  it('returns false for unsupported or non-video MIME types', () => {
    expect(isVideoMime('video/quicktime')).toBe(false);
    expect(isVideoMime('video/x-msvideo')).toBe(false);
    expect(isVideoMime('image/png')).toBe(false);
    expect(isVideoMime(null)).toBe(false);
    expect(isVideoMime(undefined)).toBe(false);
    expect(isVideoMime('')).toBe(false);
  });
});

describe('canBrowserPlayVideoMime', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('falls back to the playable MIME whitelist when document is unavailable', () => {
    vi.stubGlobal('document', undefined);

    expect(canBrowserPlayVideoMime('video/mp4')).toBe(true);
    expect(canBrowserPlayVideoMime('video/webm')).toBe(true);
    expect(canBrowserPlayVideoMime('video/quicktime')).toBe(false);
  });

  it('returns false when the browser cannot play the MIME type', () => {
    const canPlayType = vi.fn().mockReturnValue('');

    vi.stubGlobal('document', {
      createElement: () => ({ canPlayType }),
    });

    expect(canBrowserPlayVideoMime('video/mp4')).toBe(false);
    expect(canPlayType).toHaveBeenCalledWith('video/mp4');
  });

  it('returns true when the browser reports maybe or probably support', () => {
    const canPlayType = vi
      .fn()
      .mockReturnValueOnce('maybe')
      .mockReturnValueOnce('probably');

    vi.stubGlobal('document', {
      createElement: () => ({ canPlayType }),
    });

    expect(canBrowserPlayVideoMime('video/mp4')).toBe(true);
    expect(canBrowserPlayVideoMime('video/webm')).toBe(true);
  });
});
