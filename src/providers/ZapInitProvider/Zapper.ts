import {
  greaterThanOrEqualTo,
  Instruction,
  MultichainSmartAccount,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';
import { Route } from '@lifi/sdk';
import { EVMAddress } from 'src/types/internal';
import { ProjectData } from 'src/types/questDetails';
import {
  Abi,
  AbiParameter,
  createPublicClient,
  getContract,
  http,
  parseUnits,
  zeroAddress,
} from 'viem';
import { hyperevm } from './hyperwave';
import { buildContractComposable } from './utils';
import { AbiEntry, ZapDataResponse } from './zap.interface';

export interface SendCallsExtraParams {
  chainId: number | undefined;
  currentRoute: Route | null;
  zapData: ZapDataResponse;
  projectData: ProjectData;
  address: string | undefined;
}

export interface ValidatedSendCallsExtraParams extends SendCallsExtraParams {
  chainId: number;
  currentRoute: Route;
  zapData: ZapDataResponse & {
    market: {
      address: `0x${string}`;
      depositToken: {
        address: `0x${string}`;
        decimals: number;
      };
    };
  };
  projectData: ProjectData;
  address: string;
}

export type ZapInstruction = (
  oNexus: MultichainSmartAccount,
  params: ValidatedSendCallsExtraParams,
  zapper: ZapData,
) => Promise<Instruction[] | null>;

export const approve: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  params: ValidatedSendCallsExtraParams,
  zapper: ZapData,
) => {
  const { zapData: integrationData, projectData } = params;

  const depositAddress = integrationData.market.address;
  const depositToken = integrationData.market.depositToken.address;
  const depositTokenDecimals = integrationData.market.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
  ];

  return buildContractComposable(oNexus, {
    address: depositToken,
    chainId: depositChainId,
    abi: integrationData.abi.approve,
    functionName: integrationData.abi.approve.name,
    gasLimit: 100000n,
    args: [
      depositAddress,
      runtimeERC20BalanceOf({
        targetAddress: oNexus.addressOn(depositChainId, true) as EVMAddress,
        tokenAddress: depositToken,
        constraints,
      }),
    ],
  });
};

export const deposit: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  params: ValidatedSendCallsExtraParams,
  zapper: ZapData,
) => {
  const {
    address: currentAddress,
    zapData: integrationData,
    projectData,
  } = params;

  const depositToken = integrationData.market.depositToken.address;
  const depositTokenDecimals = integrationData.market.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
  ];

  const depositInputs = integrationData.abi.deposit.inputs;
  const depositArgs = depositInputs.map((input: AbiParameter) => {
    if (input.type === 'uint256') {
      return runtimeERC20BalanceOf({
        targetAddress: oNexus.addressOn(depositChainId, true) as EVMAddress,
        tokenAddress: depositToken,
        constraints,
      });
    } else if (input.type === 'address') {
      return currentAddress;
    }
    throw new Error(`Unsupported deposit input type: ${input.type}`);
  });

  return buildContractComposable(oNexus, {
    address: zapper.getDepositAddress(),
    chainId: depositChainId,
    abi: integrationData.abi.deposit,
    functionName: integrationData.abi.deposit.name,
    gasLimit: 1000000n,
    args: depositArgs,
  });
};

const computeHyperwaveMinimumMint = async (
  zapper: ZapData,
): Promise<bigint | null> => {
  const market = zapper.zapData.market;

  if (!market) {
    // TODO: we rely should retype this to get rid of the nulls.
    throw new Error('Market not found in zap data');
  }

  const decimals = market.depositToken.decimals;
  const token = market.depositToken.address;
  const amount = BigInt(zapper.currentRoute.fromAmount);

  const getRateInQuoteSafe = zapper.zapData.abi.getRateInQuoteSafe;

  if (!getRateInQuoteSafe) {
    throw new Error('getRateInQuoteSafe not found in abi');
  }

  const client = createPublicClient({
    chain: hyperevm,
    transport: http(),
  });

  const abi: Abi = [getRateInQuoteSafe];
  const contract = getContract({
    address: zapper.getAbiAddress(getRateInQuoteSafe),
    abi,
    client,
  });

  const rate = await contract.read.getRateInQuoteSafe([token]);

  if (!rate || typeof rate !== 'bigint') {
    throw new Error('Failed to get rate');
  }

  const numerator = amount * 10n ** BigInt(decimals);
  const denominator = rate;
  return numerator / denominator;
};

export const hyperwaveDeposit: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  params: ValidatedSendCallsExtraParams,
  zapper: ZapData,
) => {
  const { zapData: integrationData, projectData } = params;

  const depositToken = integrationData.market.depositToken.address;
  const depositTokenDecimals = integrationData.market.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
  ];

  let minimumMint: bigint | null = await computeHyperwaveMinimumMint(zapper);
  const depositInputs = integrationData.abi.deposit.inputs;
  const depositArgs = depositInputs.map((input: AbiParameter) => {
    if (input.name === 'minimumMint') {
      if (minimumMint === null || minimumMint <= 0) {
        throw new Error('Minimum mint is not set');
      }
      return minimumMint;
    } else if (input.name === 'depositAsset') {
      return depositToken;
    } else if (input.type === 'uint256') {
      return runtimeERC20BalanceOf({
        targetAddress: oNexus.addressOn(depositChainId, true) as EVMAddress,
        tokenAddress: depositToken,
        constraints,
      });
    }
    throw new Error(`Unsupported deposit input type: ${input.type}`);
  });

  return buildContractComposable(oNexus, {
    address: zapper.getDepositAddress(),
    chainId: depositChainId,
    abi: integrationData.abi.deposit,
    functionName: integrationData.abi.deposit.name,
    gasLimit: 1000000n,
    args: depositArgs,
  });
};

export const transfer: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  params: ValidatedSendCallsExtraParams,
  zapper: ZapData,
) => {
  const {
    address: currentAddress,
    zapData: integrationData,
    projectData,
  } = params;

  const depositAddress = integrationData.market.address;
  const depositTokenDecimals = integrationData.market?.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
  ];

  const depositInputs = integrationData.abi.deposit.inputs;
  const depositHasAddressArg = depositInputs.some(
    (input: AbiParameter) => input.type === 'address',
  );

  if (!depositHasAddressArg) {
    return buildContractComposable(oNexus, {
      address: depositAddress,
      chainId: depositChainId,
      abi: integrationData.abi.transfer,
      functionName: integrationData.abi.transfer.name,
      gasLimit: 200000n,
      args: [
        currentAddress,
        runtimeERC20BalanceOf({
          targetAddress: oNexus.addressOn(depositChainId, true) as EVMAddress,
          tokenAddress: depositAddress,
          constraints,
        }),
      ],
    });
  }

  return null;
};

interface ZapDefinition {
  commands: {
    [key: string]: ZapInstruction;
  };
  steps: string[];
}

export const defaultZap: ZapDefinition = {
  commands: {
    approve,
    deposit,
    transfer,
  },
  steps: ['approve', 'deposit', 'transfer'],
};

export const hyperwaveZap: ZapDefinition = {
  commands: {
    approve,
    deposit: hyperwaveDeposit,
    transfer,
  },
  steps: ['approve', 'deposit', 'transfer'],
};

export class ZapData {
  constructor(
    public readonly projectData: ProjectData,
    public readonly zapData: ZapDataResponse,
    public readonly currentRoute: Route,
    public readonly definition: ZapDefinition,
  ) {}

  public getAbiAddress(fct: AbiEntry): `0x${string}` {
    if (!this.zapData.market) {
      throw new Error('Market not found in zap data');
    }

    if (fct.contract) {
      const contracts = this.zapData.market.contracts;
      if (!contracts) {
        throw new Error('Contracts not found in market');
      }

      const v = contracts[fct.contract];
      if (!v) {
        throw new Error(`Contract ${fct.contract} not found in market`);
      }
      return v;
    }
    return this.zapData.market.address;
  }

  getDepositAddress = (): `0x${string}` => {
    return this.getAbiAddress(this.zapData.abi.deposit);
  };
}

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
  const zapper = new ZapData(
    sendCallsExtraParams.projectData,
    sendCallsExtraParams.zapData,
    sendCallsExtraParams.currentRoute,
    definition,
  );

  const instructions: Instruction[] = [];
  const commands = definition.commands;

  // Execute each step using the instruction builder
  for (const step of definition.steps) {
    const command = commands[step];
    if (!command) {
      throw new Error(`Missing command for step: ${step}`);
    }

    const stepInstructions = await command(
      oNexus,
      sendCallsExtraParams,
      zapper,
    );

    if (stepInstructions) {
      instructions.push(...stepInstructions);
    }
  }

  return instructions;
};

/**
 * Factory function to create project-specific zapper instances.
 * Each project can have its own custom contract instruction building logic.
 *
 * The general flow (raw calldata) remains in ZapInitProvider, while
 * project-specific contract instructions are handled by the zapper classes.
 *
 * MODULAR FUNCTION SYSTEM:
 * - Each project defines its steps via getSteps()
 * - Each step is executed via a ZapInstruction function
 * - Projects can override getSteps() to add/remove/reorder steps
 * - Projects can override getCommands() to customize step behavior with different functions
 *
 * To add a new project:
 * 1. Create a new class extending DefaultZapper
 * 2. Override getSteps() to define your step sequence
 * 3. Create project-specific ZapInstruction functions if needed
 * 4. Override getCommands() to provide custom ZapInstruction functions
 *
 * Example:
 * ```typescript
 * case 'newproject':
 *   return new NewProjectZapper(
 *     sendCallsExtraParams.projectData,
 *     sendCallsExtraParams.zapData,
 *     sendCallsExtraParams.currentRoute,
 *   );
 * ```
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
