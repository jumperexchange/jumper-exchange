import { z } from 'zod';
import { COIN_FIELD_DEFAULTS } from './coinFieldDefaults';

const coinRotSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const coinSchema = z.object({
  token: z.string(),
  x: z.number(),
  y: z.number(),
  scale: z.number(),
  rot: coinRotSchema,
  phase: z.number(),
});

const cellSchema = z.object({
  w: z.number(),
  h: z.number(),
});

const bloomSchema = z.object({
  strength: z.number(),
  radius: z.number(),
  threshold: z.number(),
});

const textPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

const textSchema = z.object({
  content: z.string(),
  font: z.string(),
  color: z.string(),
  width: z.number(),
  position: textPositionSchema,
});

export const coinFieldOptionsSchema = z
  .object({
    bg: z.string(),
    coins: z.array(coinSchema),
    spin: z.number(),
    move: z.number(),
    hoverAmp: z.number(),
    reactTilt: z.number(),
    reactPush: z.number(),
    reactRadius: z.number(),
    dots: z.boolean(),
    ditherOpacity: z.number(),
    bgOpacity: z.number(),
    bgFlow: z.number(),
    bgGlitch: z.number(),
    cell: cellSchema,
    font: z.number(),
    maskRadius: z.number(),
    textMaskMul: z.number(),
    maskNoise: z.number(),
    ringCore: z.number(),
    ringHalo: z.number(),
    bloom: bloomSchema,
    fpsCap: z.number(),
    maxDpr: z.number(),
    pauseWhenHidden: z.boolean(),
    pauseWhenOffscreen: z.boolean(),
    fadeMs: z.number(),
    text: textSchema.nullable(),
  })
  .strict();

export { COIN_FIELD_DEFAULTS };
