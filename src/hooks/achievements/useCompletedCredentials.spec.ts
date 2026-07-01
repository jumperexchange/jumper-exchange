import { describe, expect, it } from 'vitest';
import type { PDA } from '@/types/loyaltyPass';
import { deriveCompletedCredentials } from './useCompletedCredentials';

const pda = (options: {
  type: string;
  timestamp?: Date;
  ongoing?: boolean;
}): PDA => ({
  id: `pda-${options.type}`,
  points: 10,
  subValue: 0,
  timestamp: options.timestamp ?? new Date('2026-01-01'),
  ongoing: options.ongoing,
  reward: {
    id: 1,
    name: options.type,
    description: '',
    image: '',
    type: options.type,
  },
});

describe('deriveCompletedCredentials', () => {
  it('excludes the recurring monthly activity reward types', () => {
    const pdas = [
      pda({ type: 'swap_oor' }),
      pda({ type: 'earn_oor' }),
      pda({ type: 'bridge_oor' }),
      pda({ type: 'chain_oor' }),
      pda({ type: 'transact_oor' }),
      pda({ type: 'boost-from-hyperflow' }),
    ];

    const result = deriveCompletedCredentials(pdas);

    expect(result.map((p) => p.reward.type)).toEqual(['boost-from-hyperflow']);
  });

  it('excludes ongoing rewards', () => {
    const result = deriveCompletedCredentials([
      pda({ type: 'og-credential', ongoing: true }),
    ]);

    expect(result).toHaveLength(0);
  });

  it('sorts credentials newest first', () => {
    const result = deriveCompletedCredentials([
      pda({ type: 'old', timestamp: new Date('2025-06-01') }),
      pda({ type: 'new', timestamp: new Date('2026-03-01') }),
    ]);

    expect(result.map((p) => p.reward.type)).toEqual(['new', 'old']);
  });
});
