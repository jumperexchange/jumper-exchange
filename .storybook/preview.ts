import type { Preview } from '@storybook/nextjs-vite';
import { withProviders } from './withProviders';

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
  },
  parameters: {
    globals: {
      theme: 'light',
    },

    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  decorators: [withProviders],
};

export default preview;
