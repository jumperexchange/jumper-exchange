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
  console.log('getEnvVars is called', process.env, (import.meta as any).env);
  if (typeof window !== 'undefined') {
    throw new Error('getEnvVars is not available on the client');
  }

  return process.env as RuntimeConfig;
}

export function getPublicEnvVars(): RuntimeConfig {
  console.log('getPublicEnvVars is called');
  if (typeof window !== 'undefined') {
    throw new Error('getPublicEnvVars is not available on the client');
  }

  return Object.keys(process.env)
    .filter((key) => key.startsWith('NEXT_PUBLIC_'))
    .reduce<RuntimeConfig>((acc, key) => {
      acc[key] = process.env[key] ?? '';
      return acc;
    }, {});
}

// Initialize config based on environment
if (typeof window === 'undefined') {
  console.log('config is initialized on server');
  // Server-side: read from process.env
  config = getEnvVars();
} else {
  console.log('config is initialized on client');
  // Client-side: read from window._env_
  config = window._env_ || {};
}

export default config;
