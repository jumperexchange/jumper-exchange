import { shallow } from 'zustand/shallow';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  WalletMethod,
  WalletMethodArgsType,
  WalletMethodReturnType,
} from 'src/providers/ZapInitProvider/types';
import { createWithEqualityFn } from 'zustand/traditional';
import { Route } from '@lifi/sdk';

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

const serializeWithTypes = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return {
      value: obj,
      type: typeof obj,
    };
  }

  if (Array.isArray(obj)) {
    return {
      value: obj.map(serializeWithTypes),
      type: 'array',
    };
  }

  const result: any = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'bigint') {
      result[key] = {
        value: value.toString(),
        type: 'bigint',
      };
    } else if (typeof value === 'object' && value !== null) {
      result[key] = serializeWithTypes(value);
    } else {
      result[key] = {
        value: value,
        type: typeof value,
      };
    }
  }

  return result;
};

const deserializeWithTypes = <T>(obj: any): T => {
  // Check if this is a typed value object
  if (
    typeof obj === 'object' &&
    obj !== null &&
    'value' in obj &&
    'type' in obj
  ) {
    const typedValue = obj as { value: any; type: string };

    if (typedValue.type === 'bigint') {
      return BigInt(typedValue.value) as T;
    } else if (typedValue.type === 'array') {
      return typedValue.value.map(deserializeWithTypes) as T;
    } else {
      // For primitive types, just return the value
      return typedValue.value as T;
    }
  }

  // If it's not a typed object, it might be a plain object (shouldn't happen with new structure)
  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      result[key] = deserializeWithTypes(value);
    }

    return result as T;
  }

  return obj as T;
};

interface PendingOperationsState<T extends WalletMethod> {
  pendingOperations: Record<string, PendingOperationData<T>>;
  promiseResolvers: Map<string, PromiseResolver<T>>;
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
    (set, get) => ({
      pendingOperations: {},
      promiseResolvers: new Map(),
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

        // Store promise resolvers in memory (not persisted)
        get().promiseResolvers.set(id, {
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

        // Remove promise resolvers from memory
        get().promiseResolvers.delete(id);
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
        return get().promiseResolvers.get(id);
      },

      setCurrentRoute: (route) => {
        set({ currentRoute: route });
      },

      getCurrentRoute: () => {
        return get().currentRoute;
      },

      clearAll: () => {
        set({ pendingOperations: {}, currentRoute: null });
        get().promiseResolvers.clear();
      },
    }),
    {
      name: 'zap-pending-operations-storage',
      storage: createJSONStorage(() => localStorage),
      // Only persist the pendingOperations, not the promiseResolvers
      partialize: (state) => {
        const serializedPendingOperations: Record<string, any> = {};

        for (const [id, operation] of Object.entries(state.pendingOperations)) {
          serializedPendingOperations[id] = {
            ...operation,
            // Only serialize the args with { value, type } structure
            args: serializeWithTypes(operation.args),
          };
        }

        return { pendingOperations: serializedPendingOperations };
      },
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.pendingOperations) {
            // Only deserialize the args field
            for (const [id, operation] of Object.entries(
              state.pendingOperations,
            )) {
              if (operation.args) {
                operation.args = deserializeWithTypes(operation.args);
              }
            }
          }
        };
      },
    },
  ),
  shallow,
);
