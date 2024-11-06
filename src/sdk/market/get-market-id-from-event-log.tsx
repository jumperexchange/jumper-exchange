import { decodeEventLog } from 'viem';
import { ContractMap } from '../contracts';
import { BigNumber, ethers } from 'ethers';

export const getMarketIdFromEventLog = ({
  chain_id,
  market_type,
  logs,
}: {
  chain_id: number;
  market_type: number;
  logs:
    | Array<{
        address: string;
        topics: Array<string>;
      }>
    | undefined
    | null;
}) => {
  try {
    if (!logs) {
      throw new Error('No logs to decode');
    }

    let contractData = null;

    if (market_type === 0) {
      // recipe contract
      contractData =
        ContractMap[chain_id as keyof typeof ContractMap]?.RecipeMarketHub ??
        undefined;
    } else {
      // vault contract
      contractData =
        ContractMap[chain_id as keyof typeof ContractMap]
          ?.WrappedVaultFactory ?? undefined;
    }

    const logToDecode = logs.find(
      // @ts-ignore
      (log) => {
        return log.address.toLowerCase() === contractData.address.toLowerCase();
      },
    );

    if (!logToDecode) {
      throw new Error('No log to decode');
    }

    const decodedLog = decodeEventLog({
      address: logToDecode.address,
      // @ts-ignore
      data: logToDecode.data,
      // @ts-ignore
      topics: logToDecode.topics,
      // @ts-ignore
      abi: contractData.abi,
    });

    const marketId =
      market_type === 0
        ? ethers.utils
            // @ts-ignore
            .hexlify(decodedLog.args.marketHash)
            .toString()
            .toLowerCase()
        : // @ts-ignore
          decodedLog.args.incentivizedVaultAddress.toString().toLowerCase();

    return {
      status: true,
      message: 'Success',
      market_id: marketId,
    };
  } catch (error: any) {
    console.log('id decode error', error);
    return {
      status: false,
      message: error.message ?? 'Unknown error',
      market_id: null,
    };
  }
};
