// This file works on both server and client automatically

interface RuntimeConfig {
  [key: string]: string;
}

declare global {
  interface Window {
    _env_: RuntimeConfig;
  }
}

let config: RuntimeConfig;

export function getEnvVars(): RuntimeConfig {
  return Object.keys(process.env)
    .filter((key) => key.startsWith('NEXT_PUBLIC_'))
    .reduce<RuntimeConfig>((acc, key) => {
      acc[key] = process.env[key] ?? '';
      return acc;
    }, {});
}

// Initialize config based on environment
if (typeof window === 'undefined') {
  // Server-side: read from process.env
  config = getEnvVars();
} else {
  // Client-side: read from window._env_
  config = window._env_ || {};
}

export default config;
