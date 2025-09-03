import type { StorybookConfig } from '@storybook/nextjs-vite';
import { getEnvVars } from '../src/config/env-config';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
    'storybook-addon-pseudo-states',
  ],
  framework: {
    name: '@storybook/nextjs-vite',
    options: {},
  },
  staticDirs: ['../public'],
  viteFinal(config, { configType }) {
    console.log('viteFinal is called', getEnvVars());

    config.define = {
      ...config.define,
      'process.env': {},
    };

    return config;
  },
};
export default config;
