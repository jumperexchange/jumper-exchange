import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  WalletMethods,
  WalletMethodArgsType,
  WalletMethodReturnType,
} from 'src/providers/ZapInitProvider/types';

interface PendingOperationData<T extends WalletMethods> {
  operationName: T;
  args: WalletMethodArgsType<T>;
  timestamp: number;
  id: string;
}

interface PromiseResolver<T extends WalletMethods> {
  resolve: (value: WalletMethodReturnType<T>) => void;
  reject: (error: Error) => void;
}

const serializeWithTypes = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(serializeWithTypes);
  }

  const result: any = {};
  const typeInfo: Record<string, string> = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'bigint') {
      result[key] = value.toString();
      typeInfo[key] = 'bigint';
    } else if (typeof value === 'object' && value !== null) {
      result[key] = serializeWithTypes(value);
    } else {
      result[key] = value;
    }
  }

  // Only add type info if we have BigInt fields
  if (Object.keys(typeInfo).length > 0) {
    result.__types = typeInfo;
  }

  return result;
};

const deserializeWithTypes = <T>(obj: any): T => {
  if (typeof obj !== 'object' || obj === null) {
    return obj as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(deserializeWithTypes) as T;
  }

  const result: Record<string, unknown> = {};
  const typeInfo = obj.__types || {};

  for (const [key, value] of Object.entries(obj)) {
    // Skip the type metadata field
    if (key === '__types') {
      continue;
    }

    const fieldType = typeInfo[key];

    if (fieldType === 'bigint' && typeof value === 'string') {
      result[key] = BigInt(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = deserializeWithTypes(value);
    } else {
      result[key] = value;
    }
  }

  return result as T;
};

interface PendingOperationsState<T extends WalletMethods> {
  pendingOperations: Record<string, PendingOperationData<T>>;
  promiseResolvers: Map<string, PromiseResolver<T>>;

  // Actions
  addPendingOperation: <K extends WalletMethods>(
    id: string,
    operationName: K,
    args: WalletMethodArgsType<K>,
    resolve: PromiseResolver<K>['resolve'],
    reject: PromiseResolver<K>['reject'],
  ) => void;

  removePendingOperation: (id: string) => void;

  getPromiseResolversForOperation: (
    id: string,
  ) => PromiseResolver<T> | undefined;

  clearAll: () => void;
}

export const useZapPendingOperationsStore = create<
  PendingOperationsState<WalletMethods>
>()(
  persist(
    (set, get) => ({
      pendingOperations: {},
      promiseResolvers: new Map(),

      addPendingOperation: (id, operationName, args, resolve, reject) => {
        set((state) => ({
          pendingOperations: {
            ...state.pendingOperations,
            [id]: {
              operationName,
              args,
              timestamp: Date.now(),
              id,
            },
          },
        }));

        // Store promise resolvers in memory (not persisted)
        get().promiseResolvers.set(id, {
          resolve: resolve as (
            value: WalletMethodReturnType<WalletMethods>,
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

      getPromiseResolversForOperation: (id) => {
        return get().promiseResolvers.get(id);
      },

      clearAll: () => {
        set({ pendingOperations: {} });
        get().promiseResolvers.clear();
      },
    }),
    {
      name: 'zap-pending-operations-storage',
      // Only persist the pendingOperations, not the promiseResolvers
      partialize: (state) => {
        const serializedPendingOperations: Record<string, any> = {};

        for (const [id, operation] of Object.entries(state.pendingOperations)) {
          serializedPendingOperations[id] = {
            ...operation,
            args: serializeWithTypes(operation.args),
          };
        }

        return { pendingOperations: serializedPendingOperations };
      },
      onRehydrateStorage: () => {
        return (state) => {
          if (state?.pendingOperations) {
            // Deserialize each pending operation's args
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
);
