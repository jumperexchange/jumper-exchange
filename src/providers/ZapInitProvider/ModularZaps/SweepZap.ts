// Note: Sweep functionality has been moved to use the backend API
// This file is kept for backward compatibility but the actual sweep logic
// is now handled by the useSweepTokens hook which calls the backend API

import { ZapDefinition, ZapExecutionContext, ZapInstruction } from './base';

// Placeholder implementation - sweep is now handled via API
export const sweepTransfer: ZapInstruction = async (
  oNexus: any,
  context: ZapExecutionContext,
) => {
  // This is a placeholder - actual sweep logic is now in the backend
  console.warn('SweepZap is deprecated. Use the useSweepTokens hook with API instead.');
  return [];
};

export const sweepZap: ZapDefinition = {
  commands: {
    transfer: sweepTransfer,
  },
  steps: ['transfer'],
};
