// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import superjson from 'superjson';
import {
  createThemeStore,
  selectAvailablePartnerThemes,
} from './createThemeStore';
import type {
  PersistedThemeState,
  ThemeProps,
  ThemeState,
} from '@/types/theme';
import type { PartnerThemesData } from '@/types/strapi';

// --- localStorage mock ---

let mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => {
    mockStorage[key] = value;
  },
  removeItem: (key: string) => {
    delete mockStorage[key];
  },
  clear: () => {
    mockStorage = {};
  },
  length: 0,
  key: () => null,
};

// --- Fixtures ---

const emptyWidgetTheme: ThemeProps['widgetTheme'] = {
  light: { config: {} },
  dark: { config: {} },
  partnerLight: { config: {} },
  partnerDark: { config: {} },
};

const emptyJumperTheme: ThemeProps['jumperTheme'] = {
  default: {},
  partner: {},
};

const makePartnerTheme = (uid: string): PartnerThemesData =>
  ({ uid }) as unknown as PartnerThemesData;

const makeProps = (overrides: Partial<ThemeProps> = {}): ThemeProps => ({
  configTheme: {},
  partnerThemes: [],
  widgetTheme: emptyWidgetTheme,
  jumperTheme: emptyJumperTheme,
  configThemeStates: {},
  ...overrides,
});

const setPersistedState = (state: PersistedThemeState, version = 4) => {
  mockStorage['jumper-theme-store'] = superjson.stringify({ state, version });
};

// zustand persist wraps storage.getItem in Promise.resolve, so hydration is always async
const waitForHydration = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 0));

// --- Tests ---

describe('createThemeStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    mockStorage = {};
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('selectAvailablePartnerThemes', () => {
    it('returns themes that have a configThemeStates entry regardless of isSelected', () => {
      const state = {
        partnerThemes: [
          makePartnerTheme('a'),
          makePartnerTheme('b'),
          makePartnerTheme('c'),
        ],
        configThemeStates: {
          a: { isSelected: true },
          b: { isSelected: false },
        },
      } as unknown as ThemeState;

      const result = selectAvailablePartnerThemes(state);
      expect(result.map((t) => t.uid)).toEqual(['a', 'b']);
    });

    it('keeps partner themes visible after deselecting (isSelected: false)', () => {
      const partnerTheme = makePartnerTheme('a');
      const state = {
        partnerThemes: [partnerTheme],
        configThemeStates: { a: { isSelected: false } },
      } as unknown as ThemeState;

      expect(selectAvailablePartnerThemes(state)).toEqual([partnerTheme]);
    });

    it('returns empty array when configThemeStates is empty', () => {
      const state = {
        partnerThemes: [makePartnerTheme('a')],
        configThemeStates: {},
      } as unknown as ThemeState;

      expect(selectAvailablePartnerThemes(state)).toEqual([]);
    });
  });

  describe('merge — partner changed', () => {
    it('resets states and gives CD isSelected: true when switching from AB to CD', async () => {
      setPersistedState({
        configTheme: { partnerName: 'AB', uid: 'ab' },
        configThemeStates: { ab: { isSelected: true } },
        widgetTheme: emptyWidgetTheme,
        jumperTheme: emptyJumperTheme,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: {
            uid: 'cd',
            partnerName: 'CD',
            selectableInMenu: true,
          },
          partnerThemes: [makePartnerTheme('cd')],
        }),
      );
      await waitForHydration();

      const states = store.getState().configThemeStates;
      expect(states['ab']).toBeUndefined();
      expect(states['cd']).toEqual({ isSelected: true });
    });

    it('sets isSelected: false when new configTheme has no partnerName', async () => {
      setPersistedState({
        configTheme: { partnerName: 'OLD', uid: 'old' },
        configThemeStates: { old: { isSelected: true } },
        widgetTheme: emptyWidgetTheme,
        jumperTheme: emptyJumperTheme,
      });

      const store = createThemeStore(
        makeProps({ configTheme: { uid: 'new' } }), // no partnerName
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['new']).toEqual({
        isSelected: false,
      });
    });

    it('does not create a state entry when configTheme has no uid', async () => {
      setPersistedState({
        configTheme: { partnerName: 'OLD', uid: 'old' },
        configThemeStates: { old: { isSelected: true } },
        widgetTheme: emptyWidgetTheme,
        jumperTheme: emptyJumperTheme,
      });

      const store = createThemeStore(makeProps({ configTheme: {} }));
      await waitForHydration();

      expect(store.getState().configThemeStates).toEqual({});
    });
  });

  describe('merge — same partner', () => {
    it('preserves existing isSelected: false without forcing a re-init', async () => {
      setPersistedState({
        configTheme: { partnerName: 'AB', uid: 'ab' },
        configThemeStates: { ab: { isSelected: false } },
        widgetTheme: emptyWidgetTheme,
        jumperTheme: emptyJumperTheme,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')],
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['ab']).toEqual({
        isSelected: false,
      });
    });

    it('removes orphaned states not present in partnerThemes', async () => {
      setPersistedState({
        configTheme: { partnerName: 'AB', uid: 'ab' },
        configThemeStates: {
          ab: { isSelected: true },
          orphan: { isSelected: false },
        },
        widgetTheme: emptyWidgetTheme,
        jumperTheme: emptyJumperTheme,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')], // 'orphan' not included
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['orphan']).toBeUndefined();
    });

    it('preserves orphaned isSelected: true so components can detect and reset it', async () => {
      setPersistedState({
        configTheme: { partnerName: 'AB', uid: 'ab' },
        configThemeStates: {
          ab: { isSelected: true },
          orphan: { isSelected: true },
        },
        widgetTheme: emptyWidgetTheme,
        jumperTheme: emptyJumperTheme,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')],
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['orphan']).toEqual({
        isSelected: true,
      });
    });
  });

  describe('migration v3 → v4', () => {
    it('preserves isSelected: true from v3 entries that had both fields', async () => {
      mockStorage['jumper-theme-store'] = superjson.stringify({
        state: {
          configTheme: { uid: 'ab', partnerName: 'AB' },
          configThemeStates: {
            ab: { expirationDate: new Date('2099-01-01'), isSelected: true },
          },
          widgetTheme: emptyWidgetTheme,
          jumperTheme: emptyJumperTheme,
        },
        version: 3,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')],
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['ab']).toEqual({
        isSelected: true,
      });
    });

    it('defaults isSelected to true for v3 entries with a future expirationDate and no isSelected', async () => {
      mockStorage['jumper-theme-store'] = superjson.stringify({
        state: {
          configTheme: { uid: 'ab', partnerName: 'AB' },
          configThemeStates: { ab: { expirationDate: new Date('2099-01-01') } },
          widgetTheme: emptyWidgetTheme,
          jumperTheme: emptyJumperTheme,
        },
        version: 3,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')],
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['ab']).toEqual({
        isSelected: true,
      });
    });

    it('defaults isSelected to false for v3 entries with an expired expirationDate and no isSelected', async () => {
      mockStorage['jumper-theme-store'] = superjson.stringify({
        state: {
          configTheme: { uid: 'ab', partnerName: 'AB' },
          configThemeStates: { ab: { expirationDate: new Date('2000-01-01') } },
          widgetTheme: emptyWidgetTheme,
          jumperTheme: emptyJumperTheme,
        },
        version: 3,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')],
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['ab']).toEqual({
        isSelected: false,
      });
    });

    it('preserves explicit isSelected: false from v3 entries', async () => {
      mockStorage['jumper-theme-store'] = superjson.stringify({
        state: {
          configTheme: { uid: 'ab', partnerName: 'AB' },
          configThemeStates: {
            ab: { expirationDate: new Date('2099-01-01'), isSelected: false },
          },
          widgetTheme: emptyWidgetTheme,
          jumperTheme: emptyJumperTheme,
        },
        version: 3,
      });

      const store = createThemeStore(
        makeProps({
          configTheme: { uid: 'ab', partnerName: 'AB' },
          partnerThemes: [makePartnerTheme('ab')],
        }),
      );
      await waitForHydration();

      expect(store.getState().configThemeStates['ab']).toEqual({
        isSelected: false,
      });
    });
  });

  describe('store actions', () => {
    it('setConfigThemeState updates isSelected for an existing uid', async () => {
      const store = createThemeStore(
        makeProps({ configThemeStates: { ab: { isSelected: true } } }),
      );
      await waitForHydration();

      store.getState().setConfigThemeState('ab', { isSelected: false });
      expect(store.getState().configThemeStates['ab']).toEqual({
        isSelected: false,
      });
    });

    it('setConfigThemeState creates a default entry merged with the patch for a new uid', async () => {
      const store = createThemeStore(makeProps());
      await waitForHydration();

      store.getState().setConfigThemeState('new', { isSelected: true });
      expect(store.getState().configThemeStates['new']).toEqual({
        isSelected: true,
      });
    });

    it('getConfigThemeState returns { isSelected: false } for an unknown uid', async () => {
      const store = createThemeStore(makeProps());
      await waitForHydration();

      expect(store.getState().getConfigThemeState('unknown')).toEqual({
        isSelected: false,
      });
    });

    it('getConfigThemeState returns the existing state for a known uid', async () => {
      const store = createThemeStore(makeProps());
      await waitForHydration();

      store.getState().setConfigThemeState('ab', { isSelected: true });

      expect(store.getState().getConfigThemeState('ab')).toEqual({
        isSelected: true,
      });
    });
  });
});
