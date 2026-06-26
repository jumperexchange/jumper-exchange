import type { StorybookConfig } from '@storybook/nextjs-vite';
import { getPublicEnvVars } from '../src/config/env-config.ts';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    'storybook-addon-pseudo-states',
    './.storybook/partnerThemeToolbarAddon.tsx',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal(config) {
    config.define = {
      ...(config.define || {}),
      'process.env': getPublicEnvVars(),
    };

    config.plugins = [
      ...(config.plugins || []),
      nodePolyfills({
        include: ['buffer'],
        globals: { Buffer: true, global: true },
      }),
    ];

    config.resolve = {
      ...config.resolve,
      dedupe: [...(config.resolve?.dedupe ?? []), 'debug'],
    };

    return config;
  },
};
export default config;
