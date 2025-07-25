import { Route } from '@lifi/sdk';
import { EVMAddress } from 'src/types/internal';
import { ProjectData } from 'src/types/questDetails';
import { Abi, createPublicClient, getContract, http } from 'viem';
import { hyperevm } from './hyperwave';
import { AbiEntry, ZapDataResponse } from './zap.interface';

export interface SendCallsExtraParams {
  chainId: number | undefined;
  currentRoute: Route | null;
  zapData: ZapDataResponse;
  projectData: ProjectData;
  address: string | undefined;
}

export interface ZapperStrategy {
  getApproveAddress: () => `0x${string}`;
  getDepositAddress: () => `0x${string}`;
  computeMinimumMint: () => Promise<number | null>;
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
      const v = this.zapData.market.contract?.[fct.contract];
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

  computeMinimumMint = async (): Promise<number | null> => {
    return null;
  };
}

export class HyperwaveZapper extends DefaultZapper {
  computeMinimumMint = async (): Promise<number | null> => {
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

    // Contrived big number division (10000001 / 10 = 10000000 / 10 + 1 / 10)
    // TODO: how do we deal with these usually? Decimal.js?
    const numerator = amount * 10n ** BigInt(decimals);
    const denominator = rate;

    const quotient = numerator / denominator;
    const remainder = numerator % denominator;
    return Number(quotient) + Number(remainder) / Number(denominator);
  };
}

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
