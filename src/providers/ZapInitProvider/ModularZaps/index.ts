import { Instruction, MultichainSmartAccount } from '@biconomy/abstractjs';
import { defaultZap } from './DefaultZap';
import { hyperwaveZap } from './HyperwaveZap';
import {
  SendCallsExtraParams,
  ValidatedSendCallsExtraParams,
  ZapDefinition,
  isValidParams,
  makeZapExecutionContext,
} from './base';

// Re-exports
export type { SendCallsExtraParams } from './base';

const buildContractInstructionsInternal = async (
  oNexus: MultichainSmartAccount,
  sendCallsExtraParams: ValidatedSendCallsExtraParams,
  definition: ZapDefinition,
): Promise<Instruction[][]> => {
  const context = makeZapExecutionContext(sendCallsExtraParams);

  const instructions: Instruction[][] = [];
  const commands = definition.commands;

  // Execute each step using the instruction builder
  for (const step of definition.steps) {
    const command = commands[step];
    if (!command) {
      throw new Error(`Missing command for step: ${step}`);
    }

    const stepInstructions = await command(oNexus, context);

    if (stepInstructions) {
      instructions.push(stepInstructions);
    }
  }

  return instructions;
};

/**
 * Contract instruction builder to create project-specific zapper workflows.
 * Each project can have its own custom contract instruction building logic.
 *
 * The general flow (raw calldata) remains in ZapInitProvider, while
 * project-specific contract instructions are handled by the ModularZaps module.
 *
 * MODULAR FUNCTION SYSTEM:
 * - Each project defines its steps and commands as ZapDefintions
 * - Each step is a ZapInstruction function
 *
 * To add a new project:
 * 1. Create a new module in this folder, export a new ZapDefinition
 * 2. Create project-specific ZapInstruction functions if needed
 * 3. Add the project to buildContractInstructions below
 *
 * @param sendCallsExtraParams - Parameters containing project data and route information
 * @returns A zapper instance configured for the specific project
 */
export const buildContractInstructions = (
  oNexusParam: MultichainSmartAccount,
  sendCallsExtraParams: SendCallsExtraParams,
): Promise<Instruction[][]> => {
  if (!isValidParams(sendCallsExtraParams)) {
    throw new Error('Invalid parameters');
  }

  switch (sendCallsExtraParams.projectData.project) {
    case 'hyperwave':
      return buildContractInstructionsInternal(
        oNexusParam,
        sendCallsExtraParams,
        hyperwaveZap,
      );
    default:
      return buildContractInstructionsInternal(
        oNexusParam,
        sendCallsExtraParams,
        defaultZap,
      );
  }
};
