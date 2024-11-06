import type { SupportedToken } from '../constants';
import { ContractMap } from '../contracts';
import { RoycoMarketType } from '../market';
import type { EnrichedOfferDataType } from '../queries';
import type { TransactionOptionsType } from '../types';

export const getVaultCancelAPOfferTransactionOptions = ({
  offer,
}: {
  offer: EnrichedOfferDataType;
}) => {
  // Get contract address and ABI
  const address =
    ContractMap[offer.chain_id as keyof typeof ContractMap]['VaultMarketHub']
      .address;
  const abi =
    ContractMap[offer.chain_id as keyof typeof ContractMap]['VaultMarketHub']
      .abi;

  // Get transaction options
  const txOptions: TransactionOptionsType = {
    contractId: 'VaultMarketHub',
    chainId: offer.chain_id ?? 0,
    id: 'cancel_ap_offer',
    label: 'Cancel AP Offer',
    address,
    abi,
    functionName: 'cancelOffer',
    marketType: RoycoMarketType.vault.id,
    args: [
      {
        offerID: offer.offer_id,
        targetVault: offer.market_id,
        ap: offer.creator,
        fundingVault: offer.funding_vault,
        expiry: offer.expiry,
        incentivesRequested: (offer.token_ids ?? []).map((tokenId) => {
          const [chainId, contractAddress] = tokenId.split('-');
          return contractAddress;
        }),
        incentivesRatesRequested: offer.token_amounts,
      },
    ],
    txStatus: 'idle',
    txHash: null,
  };

  return txOptions;
};
