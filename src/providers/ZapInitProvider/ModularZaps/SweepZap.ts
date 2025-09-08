import {
  MultichainSmartAccount,
} from '@biconomy/abstractjs';
import { createSweepTransferInstructions } from '../utils';
import { ZapDefinition, ZapExecutionContext, ZapInstruction } from './base';

export const sweepTransfer: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  context: ZapExecutionContext,
) => {
  const { currentRoute } = context;
  const chainId = currentRoute.fromChainId;

  // Create sweep transfer instructions for all token balances on the current wallet's EVM chain
  const sweepInstructions = await createSweepTransferInstructions(oNexus, chainId);
  
  return sweepInstructions;
};

export const sweepZap: ZapDefinition = {
  commands: {
    transfer: sweepTransfer,
  },
  steps: ['transfer'],
};
