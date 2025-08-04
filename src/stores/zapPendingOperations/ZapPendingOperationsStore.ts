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
      partialize: (state) => ({ pendingOperations: state.pendingOperations }),
    },
  ),
);
