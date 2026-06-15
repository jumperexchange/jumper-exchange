import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type {
  ConfigThemeState,
  ConfigThemeStates,
  JumperThemeVariants,
  PersistedThemeState,
  ThemeProps,
  ThemeState,
  WidgetThemeVariants,
} from '@/types/theme';
import superjson from 'superjson';
import Cookies from 'universal-cookie';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export const selectAvailablePartnerThemes = (
  state: ThemeState,
): PartnerThemesData[] => {
  const selectedUids = Object.entries(state.configThemeStates)
    .filter(([_, themeState]) => themeState.isSelected)
    .map(([uid]) => uid);

  return state.partnerThemes.filter((theme) =>
    selectedUids.some((uid) => uid === theme.uid),
  );
};

const getLocalStorage = () =>
  typeof window === 'undefined' ? undefined : localStorage;

const defaultConfigThemeState: ConfigThemeState = {
  isSelected: false,
};

const getOrCreateConfigThemeState = (
  states: ConfigThemeStates,
  uid: string,
): ConfigThemeState => {
  return states[uid] ?? { ...defaultConfigThemeState };
};

const initializeConfigThemeStates = (
  configTheme: Partial<PartnerThemeConfig>,
  persistedStates: ConfigThemeStates = {},
): ConfigThemeStates => {
  if (!configTheme.uid) {
    return persistedStates;
  }

  const currentThemeUid = configTheme.uid;

  if (persistedStates[currentThemeUid]) {
    return persistedStates;
  }

  return {
    ...persistedStates,
    [currentThemeUid]: {
      // We select it by default only if there is a partner name
      // This will make sure the default fallback config will not trigger any changes in the UI
      isSelected: !!configTheme.partnerName,
    },
  };
};

// Default empty widget theme config
const emptyWidgetThemeConfig = { config: {} };

// Default empty jumper theme
const emptyJumperTheme = {};

export const createThemeStore = (props: ThemeProps) =>
  createWithEqualityFn(
    persist<ThemeState, [], [], PersistedThemeState>(
      (set, get) => ({
        ...props,
        setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => {
          set({ configTheme });
        },
        setWidgetTheme: (widgetTheme: WidgetThemeVariants) => {
          set({ widgetTheme });
        },
        setJumperTheme: (jumperTheme: JumperThemeVariants) => {
          set({ jumperTheme });
        },
        setConfigThemeState: (
          uid: string,
          state: Partial<ConfigThemeState>,
        ) => {
          const currentStates = get().configThemeStates;
          const currentState = getOrCreateConfigThemeState(currentStates, uid);
          set({
            configThemeStates: {
              ...currentStates,
              [uid]: {
                ...currentState,
                ...state,
              },
            },
          });
        },
        getConfigThemeState: (uid: string): ConfigThemeState => {
          return getOrCreateConfigThemeState(get().configThemeStates, uid);
        },
      }),
      {
        name: 'jumper-theme-store',
        version: 4,
        storage: {
          getItem: (name) => {
            const str = getLocalStorage()?.getItem(name);
            return str ? superjson.parse(str) : null;
          },
          setItem: (name, value) => {
            getLocalStorage()?.setItem(name, superjson.stringify(value));
          },
          removeItem: (name) => {
            getLocalStorage()?.removeItem(name);
          },
        },
        migrate: (
          persistedState: unknown,
          version: number,
        ): PersistedThemeState => {
          const state = persistedState as Partial<PersistedThemeState> & {
            configThemeState?: { uid?: string; isSelected: boolean };
            // v2 structure
            widgetTheme?: { config: unknown };
          };

          const newStore: PersistedThemeState = {
            configTheme: state.configTheme ?? {},
            widgetTheme: {
              light: emptyWidgetThemeConfig,
              dark: emptyWidgetThemeConfig,
              partnerLight: emptyWidgetThemeConfig,
              partnerDark: emptyWidgetThemeConfig,
            },
            jumperTheme: {
              default: emptyJumperTheme,
              partner: emptyJumperTheme,
            },
            configThemeStates: state.configThemeStates ?? {},
          };

          if (version === 0) {
            const cookies = new Cookies();
            const theme = cookies.get('theme');
            const themeMode = cookies.get('themeMode');

            if (theme) {
              cookies.remove('theme', { path: '/', sameSite: true });
            }

            if (themeMode) {
              cookies.remove('themeMode', { path: '/', sameSite: true });
            }

            console.debug('theme/themeMode cookies migrated');
          }

          if (version === 1 && state.configThemeState?.uid) {
            const uid = state.configThemeState.uid;
            newStore.configThemeStates = {
              [uid]: { isSelected: state.configThemeState.isSelected },
            };
          }

          // v2 → v3: Migrate old single widgetTheme to new structure
          if (version === 2 && state.widgetTheme?.config) {
            const oldWidgetTheme = state.widgetTheme as {
              config: Record<string, unknown>;
            };
            // Preserve old widget theme as partner themes (best effort)
            newStore.widgetTheme.partnerLight = oldWidgetTheme;
            newStore.widgetTheme.partnerDark = oldWidgetTheme;
            console.debug('widgetTheme migrated from v2 to v3');
          }

          // v3 → v4: Strip expirationDate from all configThemeStates
          if (version === 3) {
            newStore.configThemeStates = Object.fromEntries(
              Object.entries(newStore.configThemeStates).map(([uid, s]) => [
                uid,
                { isSelected: s.isSelected },
              ]),
            );
          }

          return newStore;
        },
        partialize: (state: ThemeState): PersistedThemeState => ({
          configTheme: state.configTheme,
          widgetTheme: state.widgetTheme,
          jumperTheme: state.jumperTheme,
          configThemeStates: state.configThemeStates,
        }),
        merge: (persistedState, currentState) => {
          const persisted = (persistedState || {}) as PersistedThemeState;

          const currentPartnerName = currentState.configTheme?.partnerName;
          const persistedPartnerName = persisted.configTheme?.partnerName;
          const partnerChanged =
            !currentPartnerName ||
            !persistedPartnerName ||
            currentPartnerName !== persistedPartnerName;

          const baseConfigThemeStates = partnerChanged
            ? {}
            : {
                ...(persisted.configThemeStates ?? {}),
                ...currentState.configThemeStates,
              };

          // Clean up entries for themes that no longer exist in partnerThemes,
          // but preserve entries with isSelected=true so the component can detect
          // orphaned selected themes and reset the color mode appropriately
          const validPartnerUids = new Set(
            currentState.partnerThemes?.map((theme) => theme.uid) ?? [],
          );
          const cleanedConfigThemeStates = Object.fromEntries(
            Object.entries(baseConfigThemeStates).filter(
              ([uid, state]) => validPartnerUids.has(uid) || state.isSelected,
            ),
          );

          return {
            ...persisted,
            ...currentState,
            configThemeStates: initializeConfigThemeStates(
              currentState.configTheme,
              cleanedConfigThemeStates,
            ),
          };
        },
      },
    ),
    Object.is,
  );
