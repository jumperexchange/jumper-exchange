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
import { addDays, isBefore } from 'date-fns';
import { isEqual } from 'lodash';
import superjson from 'superjson';
import Cookies from 'universal-cookie';
import { persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

export const selectAvailablePartnerThemes = (
  state: ThemeState,
): PartnerThemesData[] => {
  const availableUids = Object.entries(state.configThemeStates)
    .filter(
      ([_, themeState]) =>
        themeState.expirationDate &&
        isBefore(new Date(), themeState.expirationDate),
    )
    .map(([uid]) => uid);

  return state.partnerThemes.filter((theme) =>
    availableUids.some((uid) => uid === theme.uid),
  );
};

const CONFIG_THEME_EXPIRATION_DAYS = 7;

const getLocalStorage = () =>
  typeof window === 'undefined' ? undefined : localStorage;

const defaultConfigThemeState: ConfigThemeState = {
  expirationDate: undefined,
  isSelected: false,
};

const calculateExpirationDate = (publishedAt?: string): Date => {
  const baseDate = publishedAt ? new Date(publishedAt) : new Date();
  return addDays(baseDate, CONFIG_THEME_EXPIRATION_DAYS);
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
  const expirationDate = calculateExpirationDate(configTheme.publishedAt);

  const existingState = persistedStates[currentThemeUid];
  const existingExpirationDate = existingState?.expirationDate
    ? new Date(existingState.expirationDate)
    : undefined;

  if (
    existingState &&
    (!configTheme.publishedAt ||
      isEqual(existingExpirationDate, expirationDate))
  ) {
    return persistedStates;
  }

  return {
    ...persistedStates,
    [currentThemeUid]: {
      expirationDate,
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
        version: 3,
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
            configThemeState?: ConfigThemeState & { uid?: string };
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
            const migratedState = state.configThemeState;
            const uid = state.configThemeState.uid;
            if (typeof migratedState.expirationDate === 'string') {
              migratedState.expirationDate = new Date(
                migratedState.expirationDate,
              );
            }
            newStore.configThemeStates = {
              [uid]: {
                expirationDate: migratedState.expirationDate,
                isSelected: migratedState.isSelected,
              },
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

          Object.values(newStore.configThemeStates).forEach((themeState) => {
            if (typeof themeState.expirationDate === 'string') {
              themeState.expirationDate = new Date(themeState.expirationDate);
            }
          });

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
