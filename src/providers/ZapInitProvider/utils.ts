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

/**
 * Checks if there are any tokens with balance that can be swept for a smart account on a given EVM chain
 * @param oNexus - The multichain smart account
 * @param chainId - The EVM chain ID to check balances for
 * @returns Boolean indicating if there are tokens to sweep
 */
export const hasTokensToSweep = async (
  oNexus: MultichainSmartAccount,
  chainId: number,
): Promise<boolean> => {
  try {
    // Get all available tokens for EVM chains only
    const tokensResponse = await getTokens({
      chainTypes: [ChainType.EVM],
    });
    
    // Get the smart account address once (same across all chains)
    const accountAddress = oNexus.addressOn(chainId, true);
    
    // Check all EVM chains for tokens to sweep
    const allEVMChains = Object.keys(tokensResponse.tokens).map(Number);
    
    for (const evmChainId of allEVMChains) {
      const chainTokens = tokensResponse.tokens[evmChainId];
      if (!chainTokens || chainTokens.length === 0) {
        continue;
      }
      
      // Get token balances for the account on this chain
      const tokenBalances = await getTokenBalances(accountAddress, chainTokens);
 
      // Check if there are any tokens with non-zero balance and non-zero address
      const hasTokensWithBalance = tokenBalances.some(
        (balance) => balance.amount && balance.amount > BigInt(0) && balance.address !== '0x0000000000000000000000000000000000000000'
      );

      if (hasTokensWithBalance) {
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Error checking tokens to sweep:', error);
    return false;
  }
};

/**
 * Creates sweep transfer instructions for all token balances of a smart account on a given EVM chain
 * @param oNexus - The multichain smart account
 * @param chainId - The EVM chain ID to get balances for
 * @returns Array of sweep transfer instructions
 */
export const createSweepTransferInstructions = async (
  oNexus: MultichainSmartAccount,
  chainId: number,
): Promise<any[]> => {
  try {
    // Get all available tokens for EVM chains only
    const tokensResponse = await getTokens({
      chainTypes: [ChainType.EVM],
    });
    
    // Get the smart account address once (same across all chains)
    const accountAddress = oNexus.addressOn(chainId, true);
    
    // Check all EVM chains for tokens to sweep
    const allEVMChains = Object.keys(tokensResponse.tokens).map(Number);
    const allSweepInstructions: any[] = [];
    
    for (const evmChainId of allEVMChains) {
      const chainTokens = tokensResponse.tokens[evmChainId];
      if (!chainTokens || chainTokens.length === 0) {
        continue;
      }
      
      // Get token balances for the account on this chain
      const tokenBalances = await getTokenBalances(accountAddress, chainTokens);
      
      // Filter out tokens with zero balance and zero address
      const tokensWithBalance = tokenBalances.filter(
        (balance) => balance.amount && balance.amount > BigInt(0) && balance.address !== '0x0000000000000000000000000000000000000000'
      );

      // Create sweep transfer instructions for each token with balance on this chain
      const chainSweepInstructions = await Promise.all(
        tokensWithBalance.map(async (tokenBalance) => {
          return buildContractComposableWithdrawal(
            oNexus,
            evmChainId, // Use the actual chain ID where the token is located
            tokenBalance.address
          );
        })
      );

      allSweepInstructions.push(...chainSweepInstructions);
    }

    console.log(`Created ${allSweepInstructions.length} sweep transfer instructions across all EVM chains`);
    return allSweepInstructions;
  } catch (error) {
    console.error('Error creating sweep transfer instructions:', error);
    return [];
  }
};
