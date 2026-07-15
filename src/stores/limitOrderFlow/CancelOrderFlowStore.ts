import type { LimitOrder as Order } from '@/types/jumper-backend';
import { createOrderFlowStore } from './createOrderFlowStore';

export const useCancelOrderFlowStore = createOrderFlowStore<Order>();
