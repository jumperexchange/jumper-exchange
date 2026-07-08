import { describe, expect, it } from 'vitest';
import { COIN_FIELD_DEFAULTS } from '@/components/CanvasBackground/scenes/coinField/coinFieldDefaults';
import { resolveCanvasBackgroundConfig } from '@/components/CanvasBackground/resolveCanvasBackgroundConfig';

describe('resolveCanvasBackgroundConfig', () => {
  it('returns null when id is missing', () => {
    expect(resolveCanvasBackgroundConfig(undefined, '#120B1E')).toBeNull();
    expect(resolveCanvasBackgroundConfig(null, '#120B1E')).toBeNull();
    expect(resolveCanvasBackgroundConfig({ id: '' }, '#120B1E')).toBeNull();
  });

  it('returns null for unknown registry ids', () => {
    expect(
      resolveCanvasBackgroundConfig({ id: 'unknownScene' }, '#120B1E'),
    ).toBeNull();
  });

  it('returns defaults for coinField with empty options', () => {
    const result = resolveCanvasBackgroundConfig({ id: 'coinField' }, null);

    expect(result).toEqual({
      id: 'coinField',
      options: COIN_FIELD_DEFAULTS,
    });
  });

  it('merges and validates partner overrides', () => {
    const result = resolveCanvasBackgroundConfig(
      {
        id: 'coinField',
        options: {
          bgGlitch: 0.3,
          text: { content: 'Keep it private' },
        },
      },
      null,
    );

    expect(result?.id).toBe('coinField');
    expect(result?.options.bgGlitch).toBe(0.3);
    expect(result?.options.text).toEqual({
      ...COIN_FIELD_DEFAULTS.text,
      content: 'Keep it private',
    });
  });

  it('maps backgroundColor to bg when bg is not provided', () => {
    const result = resolveCanvasBackgroundConfig(
      { id: 'coinField', options: { bgGlitch: 0.2 } },
      '#001122',
    );

    expect(result?.options.bg).toBe('#001122');
    expect(result?.options.bgGlitch).toBe(0.2);
  });

  it('does not override explicit bg with backgroundColor', () => {
    const result = resolveCanvasBackgroundConfig(
      {
        id: 'coinField',
        options: { bg: '#abcdef' },
      },
      '#001122',
    );

    expect(result?.options.bg).toBe('#abcdef');
  });

  it('returns null when merged options fail validation', () => {
    const result = resolveCanvasBackgroundConfig(
      {
        id: 'coinField',
        options: { bgGlitch: 'not-a-number' },
      },
      null,
    );

    expect(result).toBeNull();
  });

  it('rejects unknown option keys', () => {
    const result = resolveCanvasBackgroundConfig(
      {
        id: 'coinField',
        options: { unknownOption: true },
      },
      null,
    );

    expect(result).toBeNull();
  });
});
