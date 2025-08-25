import { Route } from '@lifi/sdk';
import {
  WalletMethod,
  WalletMethodArgsType,
  WalletMethodReturnType,
} from 'src/providers/ZapInitProvider/types';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export const NO_ROUTE_ID_SUFFIX = 'no-route';

interface PendingOperationData<T extends WalletMethod> {
  operationName: T;
  args: WalletMethodArgsType<T>;
  timestamp: number;
  isProcessing?: boolean;
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

  setProcessingPendingOperation: (id: string) => void;

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
>((set, get) => {
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
            isProcessing: false,
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

    setProcessingPendingOperation: (id) => {
      set((state) => ({
        pendingOperations: {
          ...state.pendingOperations,
          [id]: {
            ...state.pendingOperations[id],
            isProcessing: true,
          },
        },
      }));
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
        // Skip operations that are already being processed
        if (pendingOp.isProcessing) {
          return false;
        }

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
}, shallow);
