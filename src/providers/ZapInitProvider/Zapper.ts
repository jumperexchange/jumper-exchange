import { Route } from '@lifi/sdk';
import { ProjectData } from 'src/types/questDetails';
import { Abi, createPublicClient, getContract, http } from 'viem';
import { hyperevm } from './hyperwave';
import { AbiEntry, ZapDataResponse } from './zap.interface';
import { MultichainSmartAccount } from '@biconomy/abstractjs';
import { buildContractComposable } from './utils';
import { AbiParameter, parseUnits, zeroAddress } from 'viem';
import { EVMAddress } from 'src/types/internal';
import {
  greaterThanOrEqualTo,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';

export interface SendCallsExtraParams {
  chainId: number | undefined;
  currentRoute: Route | null;
  zapData: ZapDataResponse;
  projectData: ProjectData;
  address: string | undefined;
}

export interface InstructionCommand {
  buildInstruction(
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
    zapper: ZapperStrategy,
  ): Promise<any | null>;
}

export class ApproveCommand implements InstructionCommand {
  async buildInstruction(
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
    zapper: ZapperStrategy,
  ): Promise<any | null> {
    // Build approve instruction
    const {
      address: currentAddress,
      zapData: integrationData,
      projectData,
    } = sendCallsExtraParams;

    const depositAddress = integrationData.market?.address as EVMAddress;
    const depositToken = integrationData.market?.depositToken?.address;
    const depositTokenDecimals = integrationData.market?.depositToken.decimals;
    const depositChainId = projectData.chainId;

    if (!depositToken || !depositTokenDecimals) {
      throw new Error('Deposit token or decimals are undefined');
    }

    const constraints = [
      greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
    ];

    return await buildContractComposable(oNexus, {
      address: zapper.getApproveAddress(),
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
  }
}

export class DepositCommand implements InstructionCommand {
  async buildInstruction(
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
    zapper: ZapperStrategy,
  ): Promise<any | null> {
    const {
      address: currentAddress,
      zapData: integrationData,
      projectData,
    } = sendCallsExtraParams;

    const depositToken = integrationData.market?.depositToken?.address;
    const depositTokenDecimals = integrationData.market?.depositToken.decimals;
    const depositChainId = projectData.chainId;

    if (!depositToken || !depositTokenDecimals) {
      throw new Error('Deposit token or decimals are undefined');
    }

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

    return await buildContractComposable(oNexus, {
      address: zapper.getDepositAddress(),
      chainId: depositChainId,
      abi: integrationData.abi.deposit,
      functionName: integrationData.abi.deposit.name,
      gasLimit: 1000000n,
      args: depositArgs,
    });
  }
}

export class HyperwaveDepositCommand implements InstructionCommand {
  async buildInstruction(
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
    zapper: ZapperStrategy,
  ): Promise<any | null> {
    const {
      address: currentAddress,
      zapData: integrationData,
      projectData,
    } = sendCallsExtraParams;

    const depositToken = integrationData.market?.depositToken?.address;
    const depositTokenDecimals = integrationData.market?.depositToken.decimals;
    const depositChainId = projectData.chainId;

    if (!depositToken || !depositTokenDecimals) {
      throw new Error('Deposit token or decimals are undefined');
    }

    let minimumMint: bigint | null = await zapper.computeMinimumMint();
    const depositInputs = integrationData.abi.deposit.inputs;
    const depositArgs = depositInputs.map((input: AbiParameter) => {
      if (input.type == 'uint256' && input.name === 'minimumMint') {
        if (minimumMint === null || minimumMint <= 0) {
          throw new Error('Minimum mint is not set');
        }
        return minimumMint;
      } else if (input.type === 'address') {
        return currentAddress;
      }
      throw new Error(`Unsupported deposit input type: ${input.type}`);
    });

    return await buildContractComposable(oNexus, {
      address: zapper.getDepositAddress(),
      chainId: depositChainId,
      abi: integrationData.abi.deposit,
      functionName: integrationData.abi.deposit.name,
      gasLimit: 1000000n,
      args: depositArgs,
    });
  }
}

export class TransferCommand implements InstructionCommand {
  async buildInstruction(
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
    zapper: ZapperStrategy,
  ): Promise<any | null> {
    const {
      address: currentAddress,
      zapData: integrationData,
      projectData,
    } = sendCallsExtraParams;

    const depositAddress = integrationData.market?.address as EVMAddress;
    const depositToken = integrationData.market?.depositToken?.address;
    const depositTokenDecimals = integrationData.market?.depositToken.decimals;
    const depositChainId = projectData.chainId;

    if (!depositToken || !depositTokenDecimals) {
      throw new Error('Deposit token or decimals are undefined');
    }

    const constraints = [
      greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
    ];

    const depositInputs = integrationData.abi.deposit.inputs;
    const depositHasAddressArg = depositInputs.some(
      (input: AbiParameter) => input.type === 'address',
    );

    if (!depositHasAddressArg) {
      return await buildContractComposable(oNexus, {
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
  }
}

export class InstructionBuilder {
  constructor(private commands: Record<string, InstructionCommand>) {}

  async buildInstruction(
    step: string,
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
    zapper: ZapperStrategy,
  ): Promise<any | null> {
    const command = this.commands[step];
    if (!command) {
      throw new Error(`Unknown step: ${step}`);
    }

    return await command.buildInstruction(oNexus, sendCallsExtraParams, zapper);
  }
}

export class DefaultCommandSet {
  static create(): Record<string, InstructionCommand> {
    return {
      approve: new ApproveCommand(),
      deposit: new DepositCommand(),
      transfer: new TransferCommand(),
    };
  }
}

export class HyperwaveCommandSet {
  static create(): Record<string, InstructionCommand> {
    return {
      approve: new ApproveCommand(),
      deposit: new HyperwaveDepositCommand(),
      transfer: new TransferCommand(),
    };
  }
}

export interface ZapperStrategy {
  getApproveAddress: () => `0x${string}`;
  getDepositAddress: () => `0x${string}`;
  computeMinimumMint: () => Promise<bigint | null>;
  getInstructionBuilder: () => InstructionBuilder;
  /**
   * Build project-specific contract instructions.
   * This method builds the contract-specific instructions (approve, deposit, transfer)
   * while the general flow (raw calldata) remains in ZapInitProvider.
   *
   * @param oNexus - The multichain smart account instance
   * @param sendCallsExtraParams - Additional parameters for the transaction
   * @returns Array of contract instructions to be executed
   */
  buildContractInstructions: (
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
  ) => Promise<any[]>;

  /**
   * Get the steps to execute for this project.
   * Each project can define its own sequence of steps.
   */
  getSteps: () => string[];
}

export class DefaultZapper implements ZapperStrategy {
  constructor(
    protected readonly projectData: ProjectData,
    protected readonly zapData: ZapDataResponse,
    protected readonly currentRoute: Route,
  ) {}

  protected getAbiAddress(fct: AbiEntry): `0x${string}` {
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

  getApproveAddress = (): `0x${string}` => {
    return this.getAbiAddress(this.zapData.abi.approve);
  };

  getDepositAddress = (): `0x${string}` => {
    return this.getAbiAddress(this.zapData.abi.deposit);
  };

  computeMinimumMint = async (): Promise<bigint | null> => {
    return null;
  };

  getSteps = (): string[] => {
    return ['approve', 'deposit', 'transfer'];
  };

  getInstructionBuilder = (): InstructionBuilder => {
    return new InstructionBuilder(DefaultCommandSet.create());
  };

  buildContractInstructions = async (
    oNexus: MultichainSmartAccount,
    sendCallsExtraParams: SendCallsExtraParams,
  ): Promise<any[]> => {
    // Validate parameters
    this.validateParameters(sendCallsExtraParams);

    const instructions: any[] = [];
    const instructionBuilder = this.getInstructionBuilder();

    // Execute each step using the instruction builder
    for (const step of this.getSteps()) {
      const stepInstruction = await instructionBuilder.buildInstruction(
        step,
        oNexus,
        sendCallsExtraParams,
        this,
      );

      if (stepInstruction) {
        instructions.push(stepInstruction);
      }
    }

    return instructions;
  };

  protected validateParameters(
    sendCallsExtraParams: SendCallsExtraParams,
  ): void {
    const {
      chainId: currentChainId,
      address: currentAddress,
      zapData: integrationData,
      projectData,
    } = sendCallsExtraParams;

    if (!currentChainId || !currentAddress) {
      throw new Error('Missing chainId or address');
    }

    const currentRouteFromToken = this.currentRoute.fromToken;
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
  }
}

export class HyperwaveZapper extends DefaultZapper {
  computeMinimumMint = async (): Promise<bigint | null> => {
    const market = this.zapData.market;

    if (!market) {
      // TODO: we rely should retype this to get rid of the nulls.
      throw new Error('Market not found in zap data');
    }

    const decimals = market.depositToken.decimals;
    const token = market.depositToken.address;
    const amount = BigInt(this.currentRoute.fromAmount);

    const getRateInQuoteSafe = this.zapData.abi.getRateInQuoteSafe;

    if (!getRateInQuoteSafe) {
      throw new Error('getRateInQuoteSafe not found in abi');
    }

    const client = createPublicClient({
      chain: hyperevm,
      transport: http(),
    });

    const abi: Abi = [getRateInQuoteSafe];
    const contract = getContract({
      address: this.getAbiAddress(getRateInQuoteSafe),
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

  // Override getSteps to add Hyperwave-specific steps
  // @Note We should execute the steps in the correct order
  // getSteps = (): string[] => {
  //   return ['approve', 'deposit', 'transfer', 'customExtraStep'];
  // };

  getInstructionBuilder = (): InstructionBuilder => {
    return new InstructionBuilder(HyperwaveCommandSet.create());
  };
}

/**
 * Factory function to create project-specific zapper instances.
 * Each project can have its own custom contract instruction building logic.
 *
 * The general flow (raw calldata) remains in ZapInitProvider, while
 * project-specific contract instructions are handled by the zapper classes.
 *
 * MODULAR STEP SYSTEM:
 * - Each project defines its steps via getSteps()
 * - Each step is executed via executeStep()
 * - Projects can override getSteps() to add/remove/reorder steps
 * - Projects can override executeStep() to customize step behavior
 *
 * To add a new project:
 * 1. Create a new class extending DefaultZapper
 * 2. Override getSteps() to define your step sequence
 * 3. Override executeStep() to handle custom steps
 * 4. Add a case in this switch statement
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
export const makeZapper = (sendCallsExtraParams: SendCallsExtraParams) => {
  if (!sendCallsExtraParams.currentRoute) {
    throw new Error('Current route is not set');
  }

  switch (sendCallsExtraParams.projectData.project) {
    case 'hyperwave':
      return new HyperwaveZapper(
        sendCallsExtraParams.projectData,
        sendCallsExtraParams.zapData,
        sendCallsExtraParams.currentRoute,
      );
    default:
      return new DefaultZapper(
        sendCallsExtraParams.projectData,
        sendCallsExtraParams.zapData,
        sendCallsExtraParams.currentRoute,
      );
  }
};
