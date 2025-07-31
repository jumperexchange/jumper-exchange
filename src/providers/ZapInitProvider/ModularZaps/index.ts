import { Instruction, MultichainSmartAccount } from '@biconomy/abstractjs';
import { EVMAddress } from 'src/types/internal';
import { zeroAddress } from 'viem';
import { defaultZap } from './DefaultZap';
import { hyperwaveZap } from './HyperwaveZap';
import {
  SendCallsExtraParams,
  ValidatedSendCallsExtraParams,
  ZapDefinition,
  ZapExecutionContext,
} from './base';
import { AbiEntry } from './zap.jumper-backend';

// Re-exports
export type { SendCallsExtraParams } from './base';

const makeZapExecutionContext = (
  params: ValidatedSendCallsExtraParams,
): ZapExecutionContext => {
  const market = params.zapData.market;
  if (!market) {
    throw new Error('Market not found in zap data');
  }

  const getAbiAddress = (fct: AbiEntry) => {
    if (fct.contract) {
      const contracts = market.contracts;
      if (!contracts) {
        throw new Error('Contracts not found in market');
      }

      const v = contracts[fct.contract];
      if (!v) {
        throw new Error(`Contract ${fct.contract} not found in market`);
      }
      return v;
    }
    return market.address;
  };

  const getDepositAddress = () => {
    return getAbiAddress(params.zapData.abi.deposit);
  };

  return {
    ...params,
    getAbiAddress,
    getDepositAddress,
  };
};

const isValidParams = (
  sendCallsExtraParams: SendCallsExtraParams,
): sendCallsExtraParams is ValidatedSendCallsExtraParams => {
  if (!sendCallsExtraParams.currentRoute) {
    throw new Error('Current route is not set');
  }

  const {
    chainId: currentChainId,
    address: currentAddress,
    zapData: integrationData,
    projectData,
  } = sendCallsExtraParams;

  if (!currentChainId || !currentAddress) {
    throw new Error('Missing chainId or address');
  }

  const currentRouteFromToken = sendCallsExtraParams.currentRoute.fromToken;
  const depositAddress = integrationData.market?.address as EVMAddress;
  const depositToken = integrationData.market?.depositToken?.address;
  const depositTokenDecimals = integrationData.market?.depositToken.decimals;
  const depositChainId = projectData.chainId;

  if (!depositChainId) {
    throw new Error('Deposit chain id is undefined.');
  }

  if (!depositAddress || !depositToken) {
    throw new Error('Deposit address or token is undefined.');
  }

  if (!depositTokenDecimals) {
    throw new Error('Deposit token decimals is undefined.');
  }

  // @Note this works only for EVM chains
  const isNativeSourceToken = currentRouteFromToken.address === zeroAddress;
  console.warn('Using native source token:', isNativeSourceToken);

  if (isNativeSourceToken) {
    throw new Error('Native source token is not supported.');
  }

  return true;
};

const buildContractInstructionsInternal = async (
  oNexus: MultichainSmartAccount,
  sendCallsExtraParams: ValidatedSendCallsExtraParams,
  definition: ZapDefinition,
): Promise<Instruction[]> => {
  const zapData = makeZapExecutionContext(sendCallsExtraParams);

  const instructions: Instruction[] = [];
  const commands = definition.commands;

  // Execute each step using the instruction builder
  for (const step of definition.steps) {
    const command = commands[step];
    if (!command) {
      throw new Error(`Missing command for step: ${step}`);
    }

    const stepInstructions = await command(oNexus, zapData);

    if (stepInstructions) {
      instructions.push(...stepInstructions);
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
) => {
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
