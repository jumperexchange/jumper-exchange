import type { CanvasBackgroundRegistration } from '@/components/CanvasBackground/types';
import {
  COIN_FIELD_DEFAULTS,
  coinFieldOptionsSchema,
} from './coinFieldOptionsSchema';

export const coinFieldDefinition: CanvasBackgroundRegistration = {
  id: 'coinField',
  optionsSchema: coinFieldOptionsSchema,
  defaultOptions: structuredClone(COIN_FIELD_DEFAULTS) as Record<
    string,
    unknown
  >,
  structuralOptionKeys: ['coins', 'text'],
  loadInit: () => import('./coinField').then((module) => module.initCoinField),
};
