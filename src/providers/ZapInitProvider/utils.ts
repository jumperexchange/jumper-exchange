import { MultichainSmartAccount, runtimeERC20BalanceOf } from '@biconomy/abstractjs';
import { ChainId, Token, getTokenBalances, getTokens, ChainType } from '@lifi/sdk';
import { ContractComposableConfig } from './types';
import { AbiFunction, encodeFunctionData, Hex } from 'viem';

export const buildContractComposable = async (
  oNexus: MultichainSmartAccount,
  contractConfig: ContractComposableConfig,
) => {
  // let usedGasLimit = contractConfig.gasLimit;

  // try {
  //   usedGasLimit = await getGasLimitEstimate({
  //     oNexus,
  //     chainId: contractConfig.chainId,
  //     to: contractConfig.address as Hex,
  //     abiFunction: contractConfig.abi,
  //     functionName: contractConfig.functionName,
  //     args: contractConfig.abi.inputs.map((abiInput, index) => {
  //       // Due to the runtimeERC20BalanceOf function, the args are objects
  //       // We need to convert them to 0n
  //       if (
  //         abiNumericTypes.includes(abiInput.type) &&
  //         typeof contractConfig.args[index] === 'object'
  //       ) {
  //         return 0n;
  //       }
  //       return contractConfig.args[index];
  //     }),
  //   });
  //   console.warn('Using estimated gas limit', usedGasLimit);
  // } catch {}

  return oNexus.buildComposable({
    type: 'default',
    data: {
      abi: [contractConfig.abi],
      to: contractConfig.address as `0x${string}`,
      chainId: contractConfig.chainId,
      functionName: contractConfig.functionName,
      gasLimit: contractConfig.gasLimit,
      args: contractConfig.args,
    },
  });
};

export const buildContractComposableWithdrawal = async (
  oNexus: MultichainSmartAccount,
  chainId: number,
  tokenAddress: string,
) => {
  return oNexus.buildComposable({
    type: 'withdrawal',
    data: {
      amount: runtimeERC20BalanceOf({
        targetAddress: oNexus.addressOn(chainId, true),
        tokenAddress: tokenAddress as Hex,
      }),
      chainId: chainId,
      tokenAddress: tokenAddress as Hex,
    }
  });
};

export const isSameToken = (a: Token, b: Token) => {
  return a.address === b.address && a.chainId === b.chainId;
};

export const getGasLimitEstimate = async ({
  oNexus,
  to,
  chainId,
  args,
  abiFunction,
  functionName,
}: {
  oNexus: MultichainSmartAccount;
  to: Hex;
  chainId: ChainId;
  abiFunction: AbiFunction;
  functionName: string;
  args: any[];
}) => {
  const deployment = oNexus.deploymentOn(chainId, true);
  const data = encodeFunctionData({
    abi: [abiFunction],
    functionName,
    args,
  });
  const gasLimit = await deployment.publicClient.estimateGas({
    account: oNexus.addressOn(chainId, true) as Hex,
    to,
    data,
  });

  // Add 20% buffer to the gas limit
  const gasLimitWithBuffer = (gasLimit * 120n) / 100n;

  return gasLimitWithBuffer;
};

// Note: Sweep-related functions have been moved to the backend API
// The following functions are deprecated and should not be used:
// - hasTokensToSweep
// - createSweepTransferInstructions
// 
// Use the useSweepTokens hook instead, which calls the backend API endpoints.
