import { Instruction, MultichainSmartAccount } from '@biconomy/abstractjs';
import { Route } from '@lifi/sdk';
import { ProjectData } from 'src/types/questDetails';
import { AbiEntry, ZapDataResponse } from './zap.jumper-backend';
import { Hex, parseUnits } from 'viem';

export interface SendCallsExtraParams {
  currentRoute: Route | null;
  zapData: ZapDataResponse;
  projectData: ProjectData;
  isEmbeddedWallet: boolean;
}

export interface ValidatedSendCallsExtraParams extends SendCallsExtraParams {
  // This structure is what you can be sure of by the end of isValidParams.
  // Later we might want to implement runtime validation using something like zod
  // to simplify our code.
  currentRoute: Route & {
    fromAddress: Hex;
  };
  zapData: ZapDataResponse & {
    market: {
      address: Hex;
      depositToken: {
        address: Hex;
        decimals: number;
      };
    };
  };
  projectData: ProjectData;
}

export interface ZapExecutionContext extends ValidatedSendCallsExtraParams {
  getAbiAddress: (fct: AbiEntry) => Hex;
  getDepositAddress: () => Hex;
  getMinConstraintValue: (decimals: number) => bigint;
}

export interface ZapDefinition {
  commands: {
    [key: string]: ZapInstruction;
  };
  steps: string[];
}

export type ZapInstruction = (
  oNexus: MultichainSmartAccount,
  context: ZapExecutionContext,
) => Promise<Instruction[] | null>;

export const makeZapExecutionContext = (
  params: ValidatedSendCallsExtraParams,
): ZapExecutionContext => {
  const market = params.zapData.market;
  if (!market) {
    throw new Error('Market not found in zap data');
  }

  const getAbiAddress = (fct: AbiEntry): Hex => {
    if (fct.contract) {
      const contracts = market.contracts;
      if (!contracts) {
        throw new Error('Contracts not found in market');
      }

      const v = contracts[fct.contract];
      if (!v) {
        throw new Error(`Contract ${fct.contract} not found in market`);
      }
      return v;
    }
    return market.address;
  };

  const getDepositAddress = (): Hex => {
    return getAbiAddress(params.zapData.abi.deposit);
  };

  const getMinConstraintValue = (decimals: number) => {
    if (
      !params.projectData.minFromAmountUSD ||
      !params.currentRoute.toToken.priceUSD ||
      isNaN(Number(params.currentRoute.toToken.priceUSD))
    ) {
      return parseUnits('0.001', decimals);
    }

    // @Note: Alternatively we could use the toAmountUSD and toAmount to calculate the token rate.
    // (Number(params.currentRoute.toAmountUSD) / Number(params.currentRoute.toAmount)) * 10**decimals
    const tokenRateUSD = Number(params.currentRoute.toToken.priceUSD);
    const minTokenAmount =
      Number(params.projectData.minFromAmountUSD) / tokenRateUSD;

    // @Note: We divide by 2 as the final amount might get some loss due to gas payments.
    const halfMinTokenAmount = minTokenAmount / 2;

    return parseUnits(halfMinTokenAmount.toString(), decimals);
  };

  return {
    ...params,
    getAbiAddress,
    getDepositAddress,
    getMinConstraintValue,
  };
};

export const isValidParams = (
  sendCallsExtraParams: SendCallsExtraParams,
): sendCallsExtraParams is ValidatedSendCallsExtraParams => {
  if (!sendCallsExtraParams.currentRoute) {
    throw new Error('Current route is not set');
  }

  const {
    zapData: integrationData,
    projectData,
    currentRoute,
  } = sendCallsExtraParams;

  if (!currentRoute.fromChainId || !currentRoute.fromAddress) {
    throw new Error('Missing chainId or address');
  }

  const depositAddress = integrationData.market?.address as Hex;
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

  return true;
};
