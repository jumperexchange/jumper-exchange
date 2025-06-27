import { type Route } from '@lifi/sdk';
import { create } from 'zustand';

interface RouteStore {
  completedRoute: Route | null;
  setCompletedRoute: (route: Route | null) => void;
}

export const useRouteStore = create<RouteStore>()((set) => ({
  completedRoute: null,
  setCompletedRoute: (route) => set({ completedRoute: route }),
}));
