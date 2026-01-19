import type { PartnerThemeConfig } from '@/types/PartnerThemeConfig';
import type { PartnerThemesData } from '@/types/strapi';
import type {
  ConfigThemeState,
  ConfigThemeStates,
  PersistedThemeState,
  ThemeProps,
  ThemeState,
} from '@/types/theme';
import type { WidgetConfig } from '@lifi/widget';
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
      isSelected: true,
    },
  };
};

export const createThemeStore = (props: ThemeProps) =>
  createWithEqualityFn(
    persist<ThemeState, [], [], PersistedThemeState>(
      (set, get) => ({
        ...props,
        setConfigTheme: (configTheme: Partial<PartnerThemeConfig>) => {
          set({ configTheme });
        },
        setWidgetTheme: (widgetTheme: { config: Partial<WidgetConfig> }) => {
          set({ widgetTheme });
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
        version: 2,
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
          };
          const newStore: PersistedThemeState = {
            configTheme: state.configTheme ?? {},
            widgetTheme: state.widgetTheme ?? { config: {} },
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
          configThemeStates: state.configThemeStates,
        }),
        merge: (persistedState, currentState) => {
          const persisted = (persistedState || {}) as PersistedThemeState;

          const currentPartnerName = currentState.configTheme?.partnerName;
          const persistedPartnerName = persisted.configTheme?.partnerName;
          const partnerChanged =
            !!currentPartnerName &&
            !!persistedPartnerName &&
            currentPartnerName !== persistedPartnerName;

          const baseConfigThemeStates = partnerChanged
            ? {}
            : {
                ...(persisted.configThemeStates ?? {}),
                ...currentState.configThemeStates,
              };

          return {
            ...persisted,
            ...currentState,
            configThemeStates: initializeConfigThemeStates(
              currentState.configTheme,
              baseConfigThemeStates,
            ),
          };
        },
      },
    ),
    Object.is,
  );
