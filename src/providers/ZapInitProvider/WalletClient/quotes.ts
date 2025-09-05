import {
  GetFusionQuoteParams,
  GetQuoteParams,
  MeeClient,
  MultichainSmartAccount,
} from '@biconomy/abstractjs';
import { createEIP7702Authorization } from './utils';
import { Token } from '@lifi/sdk';
import { Hex } from 'viem';
import { TIMEOUT_IN_MINUTES } from '../constants';
import { minutesToSeconds } from 'date-fns';

interface QuoteExecutionParams {
  meeClientParam: MeeClient;
  oNexusParam: MultichainSmartAccount;
  currentChainId: number;
  depositChainId: number;
  currentRouteFromToken: Token;
  currentRouteFromAmount: string;
  cleanUps: any[];
  instructions: any[];
  userBalance: bigint;
  requestedAmount: bigint;
  eoaWallet: EVMAddress;
}

const millisecondsToSeconds = (input: number) => input / 1000;

const executeEmbeddedWalletQuote = async (
  params: QuoteExecutionParams,
): Promise<string> => {
  const {
    meeClientParam,
    oNexusParam,
    currentChainId,
    depositChainId,
    cleanUps,
    instructions,
    currentRouteFromToken,
    eoaWallet,
  } = params;

  const currentChainNexusDeployment = oNexusParam.deploymentOn(currentChainId);
  const depositChainNexusDeployment = oNexusParam.deploymentOn(depositChainId);

  const currentChainAuthorization = await createEIP7702Authorization(
    currentChainNexusDeployment?.walletClient,
    currentChainId,
  );

  const depositChainAuthorization = await createEIP7702Authorization(
    depositChainNexusDeployment?.walletClient,
    depositChainId,
  );

  const quoteParams: GetQuoteParams = {
    authorizations: [currentChainAuthorization, depositChainAuthorization],
    delegate: true,
    cleanUps,
    feeToken: {
      address: currentRouteFromToken.address as Hex,
      chainId: currentChainId,
      gasRefundAddress: eoaWallet,
    },
    instructions,
  };

  const quote = await meeClientParam.getQuote(quoteParams);
  const quoteExecution = await meeClientParam.executeQuote({ quote });

  return quoteExecution.hash;
};

const executeRegularWalletQuote = async (
  params: QuoteExecutionParams,
): Promise<string> => {
  const {
    meeClientParam,
    currentRouteFromToken,
    requestedAmount,
    cleanUps,
    instructions,
    currentChainId,
    userBalance,
    eoaWallet,
  } = params;

  // The biconomy sdk requires the timestamp to be in seconds and throws an error if not using integer
  const now = Math.ceil(millisecondsToSeconds(Date.now()));

  const fusionQuoteParams: GetFusionQuoteParams = {
    trigger: {
      tokenAddress: currentRouteFromToken.address as Hex,
      amount: requestedAmount,
      chainId: currentChainId,
    },
    cleanUps,
    feeToken: {
      address: currentRouteFromToken.address as Hex,
      chainId: currentChainId,
      gasRefundAddress: eoaWallet,
    },
    instructions,
    lowerBoundTimestamp: now,
    upperBoundTimestamp: now + minutesToSeconds(TIMEOUT_IN_MINUTES),
  };

  const usageInBasisPoints =
    userBalance > 0n ? (requestedAmount * 10_000n) / userBalance : 0n;
  const isUsingMax = usageInBasisPoints >= 9_990n;

  if (isUsingMax) {
    fusionQuoteParams.trigger.useMaxAvailableFunds = true;
  }

  const quote = await meeClientParam.getFusionQuote(fusionQuoteParams);
  const fusionQuoteExecution = await meeClientParam.executeFusionQuote({
    fusionQuote: quote,
  });

  return fusionQuoteExecution.hash;
};

export const executeQuoteStrategy = async (
  params: QuoteExecutionParams & { isEmbeddedWallet: boolean },
): Promise<string> => {
  return params.isEmbeddedWallet
    ? executeEmbeddedWalletQuote(params)
    : executeRegularWalletQuote(params);
};
