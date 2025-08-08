import { Instruction, MultichainSmartAccount } from '@biconomy/abstractjs';
import { Route } from '@lifi/sdk';
import { EVMAddress } from 'src/types/internal';
import { ProjectData } from 'src/types/questDetails';
import { AbiEntry, ZapDataResponse } from './zap.jumper-backend';

export interface SendCallsExtraParams {
  currentRoute: Route | null;
  zapData: ZapDataResponse;
  projectData: ProjectData;
}

export interface ValidatedSendCallsExtraParams extends SendCallsExtraParams {
  // This structure is what you can be sure of by the end of isValidParams.
  // Later we might want to implement runtime validation using something like zod
  // to simplify our code.
  currentRoute: Route & {
    fromAddress: EVMAddress;
  };
  zapData: ZapDataResponse & {
    market: {
      address: EVMAddress;
      depositToken: {
        address: EVMAddress;
        decimals: number;
      };
    };
  };
  projectData: ProjectData;
}

export interface ZapExecutionContext extends ValidatedSendCallsExtraParams {
  getAbiAddress: (fct: AbiEntry) => EVMAddress;
  getDepositAddress: () => EVMAddress;
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

  const getAbiAddress = (fct: AbiEntry): EVMAddress => {
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

  const getDepositAddress = (): EVMAddress => {
    return getAbiAddress(params.zapData.abi.deposit);
  };

  return {
    ...params,
    getAbiAddress,
    getDepositAddress,
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

  return true;
};
