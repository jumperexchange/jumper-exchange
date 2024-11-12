import { ethers } from 'ethers';
import { getSupportedToken } from '../constants';
import { TransactionOptionsType } from '../types';
import { createHash } from 'crypto';

export type TransactionSimulationWriteContractOptionsElementType = {
  contractId: string;
  chainId: number;
  address: string;
  functionName: string;
  args: any[];
};

export const getTransactionSimulationQueryOptions = ({
  chainId,
  writeContractOptions,
  simulationUrl,
  account,
}: {
  chainId: number;
  enabled: boolean;
  writeContractOptions: TransactionSimulationWriteContractOptionsElementType[];
  simulationUrl: string;
  account: string;
}) => ({
  queryKey: ['simulate', JSON.stringify(writeContractOptions)],
  queryFn: async () => {
    if (!writeContractOptions || !account || !chainId) {
      return [];
    }

    const response = await fetch(simulationUrl ?? '', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chainId: chainId,
        transactions: writeContractOptions.map((option) => {
          return {
            contractId: option.contractId,
            chainId: option.chainId,
            address: option.address,
            functionName: option.functionName,
            args: option.args,
          };
        }),
        account,
      }),
    });

    const res = await response.json();

    // const data = res.data as unknown;

    const data = res.data as Array<{
      asset_changes: Array<{
        raw_amount: string;
        amount: string | null;
        dollar_value: number | null;
        from?: string;
        to?: string;
        token_info: {
          standard: string;
          contract_address: string;
        };
        type: string;
      }> | null;
    }>;

    const asset_changes = data
      .map((d) => {
        if (!!d.asset_changes) {
          return d.asset_changes;
        }
      })
      .filter((d) => !!d)
      .flat();

    const tokens_out = asset_changes.filter(
      (d) =>
        !!d.from &&
        d.from.toLowerCase() === account?.toLowerCase() &&
        !!d.to &&
        d.to.toLowerCase() !== account?.toLowerCase(),
    );

    const tokens_in = asset_changes.filter(
      (d) =>
        !!d.to &&
        d.to.toLowerCase() === account?.toLowerCase() &&
        !!d.from &&
        d.from.toLowerCase() !== account?.toLowerCase(),
    );

    const tokens_in_data = tokens_in.reduce(
      (acc: { [key: string]: any }, d) => {
        const token_id = `${chainId}-${d.token_info.contract_address.toLowerCase()}`;
        const existingToken = acc[token_id];

        const token_data = getSupportedToken(token_id);
        const currentRawAmount = BigInt(d.raw_amount ?? '0');

        if (existingToken) {
          // If token already exists, add up the amounts
          const newRawAmount = (
            BigInt(existingToken.raw_amount) + BigInt(currentRawAmount)
          ).toString();

          existingToken.raw_amount = newRawAmount;
          existingToken.token_amount = ethers.formatUnits(
            newRawAmount,
            token_data.decimals,
          );
          existingToken.token_amount_usd += d.dollar_value ?? 0;
        } else {
          // If token doesn't exist, add it to the accumulator
          acc[token_id] = {
            ...token_data,
            raw_amount: currentRawAmount.toString(),
            token_amount: ethers.formatUnits(
              currentRawAmount,
              token_data.decimals,
            ),
            token_amount_usd: d.dollar_value ?? 0,
            type: 'in',
          };
        }

        return acc;
      },
      {},
    );

    const tokens_out_data = tokens_out.reduce(
      (acc: { [key: string]: any }, d) => {
        const token_id = `${chainId}-${d.token_info.contract_address.toLowerCase()}`;
        const existingToken = acc[token_id];

        const token_data = getSupportedToken(token_id);
        const currentRawAmount = BigInt(d.raw_amount ?? '0');

        if (existingToken) {
          // If token already exists, add up the amounts
          const newRawAmount = (
            BigInt(existingToken.raw_amount) + BigInt(currentRawAmount)
          ).toString();

          existingToken.raw_amount = newRawAmount;
          existingToken.token_amount = ethers.formatUnits(
            newRawAmount,
            token_data.decimals,
          );
          existingToken.token_amount_usd += d.dollar_value ?? 0;
        } else {
          // If token doesn't exist, add it to the accumulator
          acc[token_id] = {
            ...token_data,
            raw_amount: currentRawAmount.toString(),
            token_amount: ethers.formatUnits(
              currentRawAmount,
              token_data.decimals,
            ),
            token_amount_usd: d.dollar_value ?? 0,
            type: 'out',
          };
        }

        return acc;
      },
      {},
    );

    const combined_token_data = [
      ...Object.values(tokens_in_data),
      ...Object.values(tokens_out_data),
    ];

    return combined_token_data;
  },
});
