export const isBeta = (): boolean =>
  typeof window !== 'undefined' &&
  window.localStorage.getItem('use-beta') === 'true';
