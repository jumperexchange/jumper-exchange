import { formatConfig } from '@/utils/formatTheme';
import { applySelectedPartnerColorMode } from '@/providers/ThemeProvider/partnerThemeMode';
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
import { isAfter } from 'date-fns';
import superjson from 'superjson';
import Cookies from 'universal-cookie';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export const selectAvailablePartnerThemes = (
  state: ThemeState,
): PartnerThemesData[] => {
  const availableUids = new Set(Object.keys(state.configThemeStates));

  return state.partnerThemes.filter((theme) => availableUids.has(theme.uid));
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

const isMenuSelectablePartnerTheme = (config?: Partial<PartnerThemeConfig>) =>
  !!(config?.selectableInMenu && config?.partnerName);

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
      isSelected: isMenuSelectablePartnerTheme(configTheme),
    },
  };
};

const buildInitialConfigThemeStates = (
  configTheme: Partial<PartnerThemeConfig>,
  partnerThemes: PartnerThemesData[] = [],
  persistedStates: ConfigThemeStates = {},
): ConfigThemeStates => {
  const defaultMenuPartnerConfig = formatConfig(
    partnerThemes.find((theme) => theme.uid === 'default'),
  );

  const useDefaultMenuPartner =
    !!configTheme?.uid && configTheme.selectableInMenu === false;

  const selectionConfig = useDefaultMenuPartner
    ? defaultMenuPartnerConfig
    : configTheme;

  let configThemeStates = initializeConfigThemeStates(
    selectionConfig,
    persistedStates,
  );

  if (useDefaultMenuPartner && configTheme.uid) {
    configThemeStates = {
      ...configThemeStates,
      [configTheme.uid]: { isSelected: false },
    };
  }

  return configThemeStates;
};

export { buildInitialConfigThemeStates };

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

          // v3 → v4: Strip expirationDate from all configThemeStates.
          // v3 entries that pre-date isSelected only stored expirationDate, so
          // s.isSelected can be undefined. Fall back to the expirationDate: if
          // it is still in the future the selection is still valid; if it has
          // already passed, treat the theme as unselected.
          if (version === 3) {
            newStore.configThemeStates = Object.fromEntries(
              Object.entries(
                newStore.configThemeStates as Record<
                  string,
                  { isSelected?: boolean; expirationDate?: Date | string }
                >,
              ).map(([uid, s]) => {
                let isSelected: boolean;
                if (s.isSelected !== undefined) {
                  isSelected = s.isSelected;
                } else if (s.expirationDate) {
                  isSelected = isAfter(s.expirationDate, new Date());
                } else {
                  isSelected = true;
                }
                return [uid, { isSelected }];
              }),
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
            configThemeStates: buildInitialConfigThemeStates(
              currentState.configTheme,
              currentState.partnerThemes,
              cleanedConfigThemeStates,
            ),
          };
        },
        onRehydrateStorage: () => (state) => {
          if (!state) {
            return;
          }

          applySelectedPartnerColorMode(
            state.configThemeStates,
            state.partnerThemes,
          );
        },
      },
    ),
    Object.is,
  );
