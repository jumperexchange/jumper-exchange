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
import Cookies from 'universal-cookie';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

interface TaggedValue<T extends string = string> {
  __type: T;
  value: string;
}

const isTaggedValue = (val: unknown): val is TaggedValue =>
  val !== null && typeof val === 'object' && '__type' in val && 'value' in val;

const serializers = {
  URL: {
    test: (val: unknown): val is URL => val instanceof URL,
    serialize: (val: URL): TaggedValue<'URL'> => ({
      __type: 'URL',
      value: val.href,
    }),
    deserialize: (val: string) => new URL(val),
  },
  Date: {
    test: (val: unknown): val is Date => val instanceof Date,
    serialize: (val: Date): TaggedValue<'Date'> => ({
      __type: 'Date',
      value: val.toISOString(),
    }),
    deserialize: (val: string) => new Date(val),
  },
} as const;

type SerializerKey = keyof typeof serializers;

const serialize = (_key: string, value: unknown): unknown => {
  for (const [, handler] of Object.entries(serializers)) {
    if (handler.test(value)) {
      return handler.serialize(value as never);
    }
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => serialize(String(index), item));
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, serialize(k, v)]),
    );
  }
  return value;
};

const deserialize = (_key: string, value: unknown): unknown => {
  if (isTaggedValue(value) && value.__type in serializers) {
    return serializers[value.__type as SerializerKey].deserialize(value.value);
  }
  if (Array.isArray(value)) {
    return value.map((item, index) => deserialize(String(index), item));
  }
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, deserialize(k, v)]),
    );
  }
  return value;
};

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
        storage: createJSONStorage(() => localStorage, {
          reviver: deserialize,
          replacer: serialize,
        }),
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
        onRehydrateStorage: () => {
          return (state) => {
            if (!state) {
              return;
            }

            state.configTheme = state.configTheme;

            const mergedStates = initializeConfigThemeStates(
              state.configTheme,
              state.configThemeStates,
            );

            if (!isEqual(mergedStates, state.configThemeStates)) {
              state.configThemeStates = mergedStates;
            }
          };
        },
      },
    ),
    Object.is,
  );
