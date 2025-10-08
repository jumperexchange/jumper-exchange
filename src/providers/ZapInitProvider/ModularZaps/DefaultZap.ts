import {
  greaterThanOrEqualTo,
  MultichainSmartAccount,
  runtimeERC20BalanceOf,
} from '@biconomy/abstractjs';
import { AbiParameter, Hex } from 'viem';
import { buildContractComposable } from '../utils';
import { ZapExecutionContext, ZapDefinition, ZapInstruction } from './base';

export const approve: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  context: ZapExecutionContext,
) => {
  const { zapData: integrationData, projectData } = context;

  const depositAddress = integrationData.market.address;
  const depositToken = integrationData.market.depositToken.address;
  const depositTokenDecimals = integrationData.market.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(context.getMinConstraintValue(depositTokenDecimals)),
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
        targetAddress: oNexus.addressOn(depositChainId, true) as Hex,
        tokenAddress: depositToken,
        constraints,
      }),
    ],
  });
};

export const deposit: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  context: ZapExecutionContext,
) => {
  const { zapData: integrationData, projectData, currentRoute } = context;

  const currentAddress = currentRoute.fromAddress;
  const depositToken = integrationData.market.depositToken.address;
  const depositTokenDecimals = integrationData.market.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(context.getMinConstraintValue(depositTokenDecimals)),
  ];

  const depositInputs = integrationData.abi.deposit.inputs;
  const depositArgs = depositInputs.map((input: AbiParameter) => {
    if (input.type === 'uint256') {
      return runtimeERC20BalanceOf({
        targetAddress: oNexus.addressOn(depositChainId, true) as Hex,
        tokenAddress: depositToken,
        constraints,
      });
    } else if (input.type === 'address') {
      return currentAddress;
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

export const transfer: ZapInstruction = async (
  oNexus: MultichainSmartAccount,
  context: ZapExecutionContext,
) => {
  const { zapData: integrationData, projectData, currentRoute } = context;

  const currentAddress = currentRoute.fromAddress;
  const depositAddress = integrationData.market.address;
  const depositTokenDecimals = integrationData.market?.depositToken.decimals;
  const depositChainId = projectData.chainId;

  const constraints = [
    greaterThanOrEqualTo(context.getMinConstraintValue(depositTokenDecimals)),
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
          targetAddress: oNexus.addressOn(depositChainId, true) as Hex,
          tokenAddress: depositAddress,
          constraints,
        }),
      ],
    });
  }

  return null;
};

export const defaultZap: ZapDefinition = {
  commands: {
    approve,
    deposit,
    transfer,
  },
  steps: ['approve', 'deposit', 'transfer'],
};
