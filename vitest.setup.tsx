import React from 'react';
import '@testing-library/jest-dom';
import { expect, vi } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';
import { render } from '@testing-library/react';

import { ThemeProvider } from '@mui/material/styles';
import { themeCustomized } from './src/theme/theme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('next/font/google', () => ({
  Inter: () => ({
    className: 'mocked-inter-class',
    style: { fontFamily: 'mocked-inter' },
    variable: '--font-inter',
  }),
  Manrope: () => ({
    className: 'mocked-manrope-class',
    style: { fontFamily: 'mocked-manrope' },
    variable: '--font-manrope',
  }),
  Urbanist: () => ({
    className: 'mocked-urbanist-class',
    style: { fontFamily: 'mocked-urbanist' },
    variable: '--font-urbanist',
  }),
  Sora: () => ({
    className: 'mocked-sora-class',
    style: { fontFamily: 'mocked-sora' },
    variable: '--font-sora',
  }),
  IBM_Plex_Sans: () => ({
    className: 'mocked-ibm-plex-sans-class',
    style: { fontFamily: 'mocked-ibm-plex-sans' },
    variable: '--font-ibm-plex-sans',
  }),
}));

vi.mock('next/font/local', () => ({
  default: () => ({
    className: 'mocked-sequel-class',
    style: { fontFamily: 'mocked-sequel' },
    variable: '--font-sequel',
  }),
}));

vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} alt={props.alt || ''} />,
}));

vi.mock('react-i18next', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-i18next')>();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string) => key,
      i18n: {
        language: 'en',
        changeLanguage: vi.fn(),
      },
    }),
  };
});

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Intl.NumberFormat behaves differently between OSes due to ICU library differences.
// This mock ensures consistent number formatting by stripping trailing zeros (e.g., $33.40K → $33.4K).
vi.mock('src/utils/formatNumbers', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('src/utils/formatNumbers')>();
  return {
    ...actual,
    formatValueWithConfig: (
      ...args: Parameters<typeof actual.formatValueWithConfig>
    ): string => {
      const result = actual.formatValueWithConfig(...args);
      return result
        .replace(/(\.\d*?)0+([A-Za-z%]*)$/, '$1$2')
        .replace(/\.([A-Za-z%]*)$/, '$1');
    },
  };
});

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
} as any;

const customRender = (ui: React.ReactElement, options = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={themeCustomized}>{ui}</ThemeProvider>
    </QueryClientProvider>,
    options,
  );
};
export { customRender as render };
expect.extend(matchers);
