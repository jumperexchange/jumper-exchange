import type { z } from 'zod';

export interface CanvasBackgroundHandle {
  set(patch: Record<string, unknown>): void;
  resize(): void;
  dispose(): void;
}

export type CanvasBackgroundInit = (
  canvas: HTMLCanvasElement,
  options: Record<string, unknown>,
) => CanvasBackgroundHandle;

export interface CanvasBackgroundRegistration {
  id: string;
  optionsSchema: z.ZodType;
  defaultOptions: Record<string, unknown>;
  /** Keys that require a full scene remount when changed */
  structuralOptionKeys: string[];
  loadInit: () => Promise<CanvasBackgroundInit>;
}

export interface StrapiCanvasBackgroundConfig {
  id: string;
  options?: Record<string, unknown>;
}

export interface ResolvedCanvasBackgroundConfig {
  id: string;
  options: Record<string, unknown>;
}
