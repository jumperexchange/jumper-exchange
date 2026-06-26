import type { Preview } from '@storybook/nextjs-vite';
import { sb } from 'storybook/test';
import i18nConfig from '../i18n-config';
import { NO_PARTNER_THEME_UID } from './partnerThemeConstants.ts';
import { withProviders } from './withProviders';

sb.mock(import('@lifi/wallet-management'), { spy: true });

sb.mock(import('../src/hooks/useFeatureFlags.ts'));

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Global theme for components',
      defaultValue: 'default',
      toolbar: {
        icon: 'circlehollow',
        items: [
          {
            value: 'light',
            title: 'Light',
            right: '🌞',
          },
          {
            value: 'dark',
            title: 'Dark',
            right: '🌚',
          },
        ],
        dynamicTitle: true,
      },
    },
    locale: {
      name: 'Locale',
      description: 'UI language',
      defaultValue: 'en',
      toolbar: {
        icon: 'globe',
        items: i18nConfig.locales.map((l) => ({
          value: l,
          title: l.toUpperCase(),
        })),
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    globals: {
      theme: 'light',
      partnerTheme: NO_PARTNER_THEME_UID,
      locale: 'en',
    },

    options: {
      storySort: {
        order: ['Preview', '*'],
      },
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    layout: 'fullscreen',

    a11y: {
      test: 'todo',
    },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/',
        query: {},
      },
    },
  },
  decorators: [withProviders],
};

export default preview;
