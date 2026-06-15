import type { CanvasBackgroundRegistration } from '@/components/CanvasBackground/types';
import { coinFieldDefinition } from '@/components/CanvasBackground/scenes/coinField/coinFieldDefinition';

export const canvasBackgroundRegistry: Record<
  string,
  CanvasBackgroundRegistration
> = {
  [coinFieldDefinition.id]: coinFieldDefinition,
};

export const getCanvasBackgroundRegistration = (
  id: string,
): CanvasBackgroundRegistration | undefined => canvasBackgroundRegistry[id];
