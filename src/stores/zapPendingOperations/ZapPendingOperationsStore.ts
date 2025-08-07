import { Route } from '@lifi/sdk';
import {
  WalletMethod,
  WalletMethodArgsType,
  WalletMethodReturnType,
} from 'src/providers/ZapInitProvider/types';
import superjson from 'superjson';
import { createJSONStorage, persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const NO_ROUTE_ID_SUFFIX = 'no-route';

interface PendingOperationData<T extends WalletMethod> {
  operationName: T;
  args: WalletMethodArgsType<T>;
  timestamp: number;
  id: string;
  routeContext: Route | null;
}

interface PromiseResolver<T extends WalletMethod> {
  resolve: (value: WalletMethodReturnType<T>) => void;
  reject: (error: Error) => void;
}

interface PendingOperationsState<T extends WalletMethod> {
  pendingOperations: Record<string, PendingOperationData<T>>;
  currentRoute: Route | null; // Add current route to store

  // Actions
  addPendingOperation: <K extends WalletMethod>(
    operationName: K,
    args: WalletMethodArgsType<K>,
    resolve: PromiseResolver<K>['resolve'],
    reject: PromiseResolver<K>['reject'],
  ) => void;

  removePendingOperation: (id: string) => void;

  getPendingOperationsForFromValues: (
    fromAddress: string | undefined,
    fromChainId: number | undefined,
  ) => PendingOperationData<T>[];

  getPromiseResolversForOperation: (
    id: string,
  ) => PromiseResolver<T> | undefined;

  setCurrentRoute: (route: Route | null) => void; // Add setter
  getCurrentRoute: () => Route | null; // Add getter

  clearAll: () => void;
}

export const useZapPendingOperationsStore = createWithEqualityFn<
  PendingOperationsState<WalletMethod>
>()(
  persist(
    (set, get) => {
      // Store promise resolvers in memory (not persisted)
      const promiseResolvers = new Map<string, PromiseResolver<WalletMethod>>();

      return {
        pendingOperations: {},
        currentRoute: null, // Initialize current route

        addPendingOperation: (operationName, args, resolve, reject) => {
          const currentRoute = get().currentRoute;
          const id = `${operationName}-${currentRoute?.id ?? NO_ROUTE_ID_SUFFIX}`;
          console.warn(`Queued operation: ${operationName} with id: ${id}`);

          set((state) => ({
            pendingOperations: {
              ...state.pendingOperations,
              [id]: {
                operationName,
                args,
                timestamp: Date.now(),
                id,
                routeContext: currentRoute,
              },
            },
          }));

          promiseResolvers.set(id, {
            resolve: resolve as (
              value: WalletMethodReturnType<WalletMethod>,
            ) => void,
            reject,
          });
        },

        removePendingOperation: (id) => {
          set((state) => {
            const newPendingOperations = { ...state.pendingOperations };
            delete newPendingOperations[id];
            return { pendingOperations: newPendingOperations };
          });

          promiseResolvers.delete(id);
        },

        getPendingOperationsForFromValues: (fromAddress, fromChainId) => {
          const pendingOps = Object.values(get().pendingOperations);

          return pendingOps.filter((pendingOp) => {
            // For operations without route context (like getCapabilities), execute them
            if (pendingOp.id.endsWith(NO_ROUTE_ID_SUFFIX)) {
              return true;
            }

            // For operations with route context, check if it matches current wallet context
            const routeContext = pendingOp.routeContext;
            return (
              routeContext?.fromAddress === fromAddress &&
              routeContext?.fromChainId === fromChainId
            );
          });
        },

        getPromiseResolversForOperation: (id) => {
          return promiseResolvers.get(id);
        },

        setCurrentRoute: (route) => {
          set({ currentRoute: route });
        },

        getCurrentRoute: () => {
          return get().currentRoute;
        },

        clearAll: () => {
          set({ pendingOperations: {}, currentRoute: null });
          promiseResolvers.clear();
        },
      };
    },
    {
      name: 'zap-pending-operations-storage',
      partialize: (state) => {
        // Explicitly omit current route and promise resolvers from the persisted state.
        return {
          ...state,
          currentRoute: null,
        };
      },
      storage: createJSONStorage(() => localStorage, {
        reviver: (_key, value) => {
          return superjson.parse(value as string);
        },
        replacer: (_key, value) => {
          return superjson.stringify(value);
        },
      }),
    },
  ),
  shallow,
);
