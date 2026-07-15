import type { StorybookConfig } from '@storybook/nextjs-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodePolyfills } from 'vite-plugin-node-polyfills';
import {
  getStorybookPublicEnv,
  toViteEnvDefine,
} from './storybookPublicEnv.ts';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(storybookDir, '../src');

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  previewHead(head) {
    const env = getStorybookPublicEnv();
    return `${head}<script>window._env_ = { ...${JSON.stringify(env)}, ...(window._env_ ?? {}) };</script>`;
  },
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    'storybook-addon-pseudo-states',
    import.meta.resolve('./partnerThemeToolbar.ts'),
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal(config) {
    const storybookPublicEnv = getStorybookPublicEnv();

    config.define = {
      ...(config.define || {}),
      ...toViteEnvDefine(storybookPublicEnv),
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
      alias: {
        ...(typeof config.resolve?.alias === 'object' &&
        !Array.isArray(config.resolve.alias)
          ? config.resolve.alias
          : {}),
        '@': srcDir,
        src: srcDir,
      },
      dedupe: [...(config.resolve?.dedupe ?? []), 'debug'],
    };

    return config;
  },
};
export default config;
