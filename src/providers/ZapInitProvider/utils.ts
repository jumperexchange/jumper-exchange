import { MultichainSmartAccount } from '@biconomy/abstractjs';
import { Token } from '@lifi/sdk';
import { ContractComposableConfig } from './types';

export const buildContractComposable = async (
  oNexus: MultichainSmartAccount,
  contractConfig: ContractComposableConfig,
) => {
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

export const isSameToken = (a: Token, b: Token) => {
  return a.address === b.address && a.chainId === b.chainId;
};
