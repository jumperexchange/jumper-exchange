import envConfig from '@/config/env-config';
import type { ExtensionDetector } from '../types';

const messageHandshakeMatchesReply = (
  data: unknown,
  expectedReplyType: string,
): boolean => {
  if (expectedReplyType === '*') {
    return data != null && typeof data === 'object';
  }
  if (data == null || typeof data !== 'object' || !('type' in data)) {
    return false;
  }
  return (data as { type: unknown }).type === expectedReplyType;
};

/**
 * Posts `outgoing` to `window.location.origin` and listens for a reply from
 * `event.source === window` on the same origin. When `expectedReplyType` is
 * `'*'`, any non-null object `data` counts as success; otherwise `data.type` must match.
 */
export const messageHandshakeDetector = (
  outgoing: Record<string, unknown>,
  expectedReplyType: string,
  timeoutMs = 500,
): ExtensionDetector => {
  const targetOrigin = window.location.origin;
  return {
    strategy: `message-handshake:${expectedReplyType}`,
    timeout: timeoutMs + 100,
    detect: () =>
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          window.removeEventListener('message', handler, true);
          resolve(false);
        }, timeoutMs);

        function handler(event: MessageEvent) {
          if (event.source !== window || event.origin !== targetOrigin) {
            return;
          }
          if (!messageHandshakeMatchesReply(event.data, expectedReplyType)) {
            return;
          }
          if (envConfig.NODE_ENV === 'development') {
            console.log('[extension-detection:messageHandshake]', {
              data: event.data,
              origin: event.origin,
              expectedReplyType,
            });
          }
          clearTimeout(timer);
          window.removeEventListener('message', handler, true);
          resolve(true);
        }

        window.addEventListener('message', handler, true);
        window.postMessage(outgoing, targetOrigin);
      }),
  };
};
