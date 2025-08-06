import {
  greaterThanOrEqualTo,
  MultichainSmartAccount,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';
import { EVMAddress } from 'src/types/internal';
import {
  Abi,
  AbiParameter,
  createPublicClient,
  getContract,
  http,
  parseUnits,
} from 'viem';
import { hyperevm } from '../hyperwave';
import { buildContractComposable } from '../utils';
import { approve, transfer } from './DefaultZap';
import { ZapDefinition, ZapExecutionContext, ZapInstruction } from './base';

const computeHyperwaveMinimumMint = async (
  zapper: ZapExecutionContext,
): Promise<bigint> => {
  const market = zapper.zapData.market;

  if (!market) {
    // TODO: we rely should retype this to get rid of the nulls.
    throw new Error('Market not found in zap data');
  }

  const decimals = market.depositToken.decimals;
  const token = market.depositToken.address;
  const amount = BigInt(zapper.currentRoute.toAmount);

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
  context: ZapExecutionContext,
) => {
  const { zapData: integrationData, projectData } = context;

  const depositToken = integrationData.market.depositToken.address;
  const depositTokenDecimals = integrationData.market.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(parseUnits('0.1', depositTokenDecimals)),
  ];

  const minimumMint: bigint = await computeHyperwaveMinimumMint(context);
  const depositInputs = integrationData.abi.deposit.inputs;

  const depositArgs = depositInputs.map((input: AbiParameter) => {
    if (input.name === 'minimumMint') {
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
    address: context.getDepositAddress(),
    chainId: depositChainId,
    abi: integrationData.abi.deposit,
    functionName: integrationData.abi.deposit.name,
    gasLimit: 1000000n,
    args: depositArgs,
  });
};

export const hyperwaveZap: ZapDefinition = {
  commands: {
    approve,
    deposit: hyperwaveDeposit,
    transfer,
  },
  steps: ['approve', 'deposit', 'transfer'],
};
