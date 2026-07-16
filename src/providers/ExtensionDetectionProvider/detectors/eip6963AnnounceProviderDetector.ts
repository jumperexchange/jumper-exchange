import type { ExtensionDetector } from '../types';

export interface Eip6963AnnounceProviderMatch {
  rdns?: string;
  nameIncludes?: string;
  rdnsIncludes?: string;
}

const eip6963DetailMatches = (
  detail: unknown,
  match: Eip6963AnnounceProviderMatch,
): boolean => {
  if (detail == null || typeof detail !== 'object' || !('info' in detail)) {
    return false;
  }
  const info = (detail as { info?: unknown }).info;
  if (info == null || typeof info !== 'object') {
    return false;
  }
  const rec = info as { name?: unknown; rdns?: unknown };
  const name = typeof rec.name === 'string' ? rec.name : '';
  const rdns = typeof rec.rdns === 'string' ? rec.rdns : '';
  const nameLower = name.toLowerCase();
  const rdnsLower = rdns.toLowerCase();

  if (match.rdns !== undefined && rdns === match.rdns) {
    return true;
  }
  if (
    match.rdnsIncludes !== undefined &&
    rdnsLower.includes(match.rdnsIncludes.toLowerCase())
  ) {
    return true;
  }
  if (
    match.nameIncludes !== undefined &&
    nameLower.includes(match.nameIncludes.toLowerCase())
  ) {
    return true;
  }
  return false;
};

const eip6963MatchIsEmpty = (match: Eip6963AnnounceProviderMatch): boolean =>
  match.rdns === undefined &&
  match.nameIncludes === undefined &&
  match.rdnsIncludes === undefined;

export const eip6963AnnounceProviderDetector = (
  match: Eip6963AnnounceProviderMatch,
  listenMs = 8000,
): ExtensionDetector => {
  if (eip6963MatchIsEmpty(match)) {
    return {
      strategy: 'eip6963:announceProvider:noop',
      detect: async () => false,
    };
  }

  const strategyKey = [
    match.rdns ?? '',
    match.nameIncludes ?? '',
    match.rdnsIncludes ?? '',
  ]
    .filter(Boolean)
    .join('|');

  return {
    strategy: `eip6963:announceProvider:${strategyKey}`,
    timeout: listenMs + 150,
    detect: () =>
      new Promise<boolean>((resolve) => {
        const timer = setTimeout(() => {
          window.removeEventListener('eip6963:announceProvider', handler);
          resolve(false);
        }, listenMs);

        function handler(event: Event) {
          if (!(event instanceof CustomEvent)) {
            return;
          }
          if (!eip6963DetailMatches(event.detail, match)) {
            return;
          }
          clearTimeout(timer);
          window.removeEventListener('eip6963:announceProvider', handler);
          resolve(true);
        }

        window.addEventListener('eip6963:announceProvider', handler);
        window.dispatchEvent(new CustomEvent('eip6963:requestProvider'));
      }),
  };
};
