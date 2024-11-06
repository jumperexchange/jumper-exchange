'use client';

import type {
  TypedRoycoMarketOfferType,
  TypedRoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketVaultIncentiveAction,
} from '../../market';
import {
  RoycoMarketOfferType,
  RoycoMarketType,
  RoycoMarketUserType,
} from '../../market';

import { useRecipeAPMarketOffer } from './use-recipe-ap-market-offer';
import { useRecipeIPMarketOffer } from './use-recipe-ip-market-offer';
import { useRecipeAPLimitOffer } from './use-recipe-ap-limit-offer';
import { useRecipeIPLimitOffer } from './use-recipe-ip-limit-offer';
import { useVaultAPMarketOffer } from './use-vault-ap-market-offer';
import { useVaultAPLimitOffer } from './use-vault-ap-limit-offer';
import { useVaultIPMarketOffer } from './use-vault-ip-market-offer';
import { useVaultIPAddIncentives } from './use-vault-ip-add-incentives';
import { MarketVaultIncentiveAction } from 'src/integrations/royco/store';
import { useVaultIPExtendIncentives } from './use-vault-ip-extend-incentives';
import { useVaultIPRefundIncentives } from './use-vault-ip-refund-incentives';

export const PrepareMarketActionType = {
  RecipeAPMarketOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.market.id}`,
  RecipeIPMarketOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.market.id}`,

  RecipeAPLimitOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.limit.id}`,
  RecipeIPLimitOffer: `${RoycoMarketType.recipe.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.limit.id}`,

  VaultAPMarketOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.market.id}`,
  VaultIPMarketOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.market.id}`,

  VaultAPLimitOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ap.id}-${RoycoMarketOfferType.limit.id}`,
  VaultIPLimitOffer: `${RoycoMarketType.vault.id}-${RoycoMarketUserType.ip.id}-${RoycoMarketOfferType.limit.id}`,
} as const;

const useInvalidMarketAction = () => {
  const isValid = {
    status: false,
    message: 'Invalid market action',
  };
  const isLoading = false;
  const isReady = false;
  const incentiveData: any[] = [];
  const writeContractOptions: any[] = [];
  const canBePerformedCompletely = false;
  const canBePerformedPartially = false;

  return {
    isValid,
    isLoading,
    isReady,
    incentiveData,
    writeContractOptions,
    canBePerformedCompletely,
    canBePerformedPartially,
  };
};

export const usePrepareMarketAction = ({
  chain_id,
  market_id,
  market_type,
  user_type,
  offer_type,
  account,
  quantity,
  funding_vault,
  token_ids,
  token_amounts,
  token_rates,
  expiry,
  start_timestamps,
  end_timestamps,
  custom_token_data,
  vault_incentive_action,
  offer_validation_url,
  frontend_fee_recipient,
}: {
  chain_id: number;
  market_id: string;
  market_type: TypedRoycoMarketType;
  user_type: TypedRoycoMarketUserType;
  offer_type: TypedRoycoMarketOfferType;
  account: string | undefined;
  quantity: string | undefined;
  funding_vault: string | undefined;
  token_ids: string[] | undefined;
  token_amounts: string[] | undefined;
  token_rates: string[] | undefined;
  expiry: string | undefined;
  start_timestamps: string[] | undefined;
  end_timestamps: string[] | undefined;
  custom_token_data?: Array<{
    token_id: string;
    price?: string;
    fdv?: string;
    total_supply?: string;
  }>;
  vault_incentive_action?: TypedRoycoMarketVaultIncentiveAction;
  offer_validation_url: string;
  frontend_fee_recipient?: string;
}) => {
  const action_type = `${market_type}-${user_type}-${offer_type}`;

  const propsRecipeAPMarketOffer = useRecipeAPMarketOffer({
    chain_id,
    market_id,
    account,
    quantity,
    funding_vault,
    custom_token_data,
    frontend_fee_recipient,
    offer_validation_url,
    enabled: action_type === PrepareMarketActionType.RecipeAPMarketOffer,
  });

  const propsRecipeIPMarketOffer = useRecipeIPMarketOffer({
    chain_id,
    market_id,
    account,
    quantity,
    custom_token_data,
    offer_validation_url,
    enabled: action_type === PrepareMarketActionType.RecipeIPMarketOffer,
  });

  const propsRecipeAPLimitOffer = useRecipeAPLimitOffer({
    chain_id,
    market_id,
    account,
    quantity,
    token_ids,
    token_amounts,
    expiry,
    funding_vault,
    custom_token_data,
    enabled: action_type === PrepareMarketActionType.RecipeAPLimitOffer,
  });

  const propsRecipeIPLimitOffer = useRecipeIPLimitOffer({
    chain_id,
    market_id,
    account,
    quantity,
    token_ids,
    token_amounts,
    expiry,
    custom_token_data,
    enabled: action_type === PrepareMarketActionType.RecipeIPLimitOffer,
  });

  const propsVaultAPMarketOffer = useVaultAPMarketOffer({
    chain_id,
    market_id,
    account,
    quantity,
    custom_token_data,
    frontend_fee_recipient,
    enabled: action_type === PrepareMarketActionType.VaultAPMarketOffer,
  });

  const propsVaultIPMarketOffer = useVaultIPMarketOffer({
    chain_id,
    market_id,
    account,
    quantity,
    custom_token_data,
    frontend_fee_recipient,
    enabled: action_type === PrepareMarketActionType.VaultIPMarketOffer,
  });

  const propsVaultAPLimitOffer = useVaultAPLimitOffer({
    chain_id,
    market_id,
    account,
    quantity,
    token_ids,
    token_rates,
    expiry,
    funding_vault,
    custom_token_data,
    enabled: action_type === PrepareMarketActionType.VaultAPLimitOffer,
  });

  const propsVaultIPAddIncentives = useVaultIPAddIncentives({
    chain_id,
    market_id,
    account,
    token_ids,
    token_amounts,
    start_timestamps,
    end_timestamps,
    custom_token_data,
    enabled:
      action_type === PrepareMarketActionType.VaultIPLimitOffer &&
      vault_incentive_action === MarketVaultIncentiveAction.add.id,
  });

  const propsVaultIPExtendIncentives = useVaultIPExtendIncentives({
    chain_id,
    market_id,
    account,
    token_ids,
    token_amounts,
    end_timestamps,
    custom_token_data,
    enabled:
      action_type === PrepareMarketActionType.VaultIPLimitOffer &&
      (vault_incentive_action === MarketVaultIncentiveAction.increase.id ||
        vault_incentive_action === MarketVaultIncentiveAction.extend.id),
  });

  const propsVaultIPRefundIncentives = useVaultIPRefundIncentives({
    chain_id,
    market_id,
    account,
    token_ids,
    custom_token_data,
    enabled:
      action_type === PrepareMarketActionType.VaultIPLimitOffer &&
      vault_incentive_action === MarketVaultIncentiveAction.refund.id,
  });

  const propsInvalidMarketAction = useInvalidMarketAction();

  switch (action_type) {
    // Recipe AP Actions
    case PrepareMarketActionType.RecipeAPMarketOffer:
      return propsRecipeAPMarketOffer;
    case PrepareMarketActionType.RecipeAPLimitOffer:
      return propsRecipeAPLimitOffer;

    // Recipe IP Actions
    case PrepareMarketActionType.RecipeIPMarketOffer:
      return propsRecipeIPMarketOffer;
    case PrepareMarketActionType.RecipeIPLimitOffer:
      return propsRecipeIPLimitOffer;

    // Vault AP Actions
    case PrepareMarketActionType.VaultAPMarketOffer:
      return propsVaultAPMarketOffer;
    case PrepareMarketActionType.VaultAPLimitOffer:
      return propsVaultAPLimitOffer;

    // Vault IP Actions
    case PrepareMarketActionType.VaultIPMarketOffer:
      return propsVaultIPMarketOffer;
    case PrepareMarketActionType.VaultIPLimitOffer:
      if (
        !!vault_incentive_action &&
        vault_incentive_action === MarketVaultIncentiveAction.add.id
      ) {
        return propsVaultIPAddIncentives;
      }

      if (
        !!vault_incentive_action &&
        (vault_incentive_action === MarketVaultIncentiveAction.increase.id ||
          vault_incentive_action === MarketVaultIncentiveAction.extend.id)
      ) {
        return propsVaultIPExtendIncentives;
      }

      if (
        !!vault_incentive_action &&
        vault_incentive_action === MarketVaultIncentiveAction.refund.id
      ) {
        return propsVaultIPRefundIncentives;
      }
      return propsInvalidMarketAction;

    default:
      return propsInvalidMarketAction;
  }
};
