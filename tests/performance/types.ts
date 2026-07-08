export interface PerfRoute {
  kind: PerfRouteKind;
  name: string;
  path: string;
}

export type PerfRouteKind =
  | 'earn-detail'
  | 'earn-index'
  | 'mission-detail'
  | 'missions-index';

export interface TransitionMetrics {
  earnLcpMs: number;
  earnNavigationMs: number;
  missionsReadyMs: number;
  transitionDeltaMs: number;
}
