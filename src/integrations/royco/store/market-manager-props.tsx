import { create } from 'zustand';
import type {
  RoycoMarketRewardStyleRecordType,
  TypedRoycoMarketActionType,
  TypedRoycoMarketFundingType,
  TypedRoycoMarketIncentiveType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketRewardStyle,
  TypedRoycoMarketScriptType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketVaultIncentiveAction,
} from 'src/integrations/royco/sdk/market';
import {
  RoycoMarketActionType,
  RoycoMarketFundingType,
  RoycoMarketIncentiveType,
  RoycoMarketOfferType,
  RoycoMarketRewardStyle,
  RoycoMarketScriptType,
  RoycoMarketType,
  RoycoMarketUserType,
  RoycoMarketVaultIncentiveAction,
  RoycoTransactionType,
} from 'src/integrations/royco/sdk/market';
import { ScrollTextIcon, VaultIcon } from 'lucide-react';

/**
 * @info Market View Type
 */
export type TypedMarketViewType = 'simple' | 'advanced' | 'overview';
export const MarketViewType: Record<
  TypedMarketViewType,
  { id: TypedMarketViewType }
> = {
  simple: {
    id: 'simple',
  },
  advanced: {
    id: 'advanced',
  },
  overview: {
    id: 'overview',
  },
};

/**
 * @info Market Type
 */
export const MarketType = {
  [RoycoMarketType.recipe.id]: {
    ...RoycoMarketType.recipe,
    label: 'Recipe',
    tag: '',
    description:
      'Offer incentives to perform any onchain transaction or series of transactions. Best for actions with lump sum rewards and timelocks.',
    icon: ScrollTextIcon,
  },
  [RoycoMarketType.vault.id]: {
    ...RoycoMarketType.vault,
    label: 'Vault',
    tag: '',
    description:
      'Offer incentives to deposit into an underlying ERC4626 Vault. Best for streaming rewards pro-rated to depositors and for actions easily represented by a 4646 vault.',
    icon: VaultIcon,
  },
};

/**
 * @info Market Action Type
 */
export const MarketActionType = {
  [RoycoMarketActionType.supply.id]: {
    ...RoycoMarketActionType.supply,
    label: 'Supply',
  },
  [RoycoMarketActionType.withdraw.id]: {
    ...RoycoMarketActionType.withdraw,
    label: 'Withdraw',
  },
};

/**
 * @info Market User Type
 */
export const MarketUserType = {
  [RoycoMarketUserType.ap.id]: {
    ...RoycoMarketUserType.ap,
    label: 'AP',
  },
  [RoycoMarketUserType.ip.id]: {
    ...RoycoMarketUserType.ip,
    label: 'IP',
  },
};

/**
 * @info Market Offer Type
 */
export const MarketOfferType = {
  [RoycoMarketOfferType.market.id]: {
    ...RoycoMarketOfferType.market,
    label: 'Market Offer',
  },
  [RoycoMarketOfferType.limit.id]: {
    ...RoycoMarketOfferType.limit,
    label: 'Limit Offer',
  },
};

/**
 * @info Market Incentive Type
 */
export const MarketIncentiveType = {
  [RoycoMarketIncentiveType.ap.id]: {
    ...RoycoMarketIncentiveType.ap,
    label: 'Asked',
  },
  [RoycoMarketIncentiveType.ip.id]: {
    ...RoycoMarketIncentiveType.ip,
    label: 'Offered',
  },
};

/**
 * @info Market Vault Incentive Action
 */
export const MarketVaultIncentiveAction = {
  [RoycoMarketVaultIncentiveAction.add.id]: {
    ...RoycoMarketVaultIncentiveAction.add,
    label: 'Add Incentives',
  },
  [RoycoMarketVaultIncentiveAction.increase.id]: {
    ...RoycoMarketVaultIncentiveAction.increase,
    label: 'Increase Incentives',
  },
  [RoycoMarketVaultIncentiveAction.extend.id]: {
    ...RoycoMarketVaultIncentiveAction.extend,
    label: 'Extend Incentives',
  },
  [RoycoMarketVaultIncentiveAction.refund.id]: {
    ...RoycoMarketVaultIncentiveAction.refund,
    label: 'Refund Incentives',
  },
};

/**
 * @info Market Script Type
 */
export const MarketScriptType = {
  [RoycoMarketScriptType.enter_actions.id]: {
    ...RoycoMarketScriptType.enter_actions,
    label: 'Enter Market',
  },
  [RoycoMarketScriptType.exit_actions.id]: {
    ...RoycoMarketScriptType.exit_actions,
    label: 'Exit Market',
  },
};

export const MarketTransactionType = {
  [RoycoTransactionType.approve_tokens.id]: {
    ...RoycoTransactionType.approve_tokens,
    title: 'Approve Tokens for Offer',
    label: 'Approve Tokens',
  },
  [RoycoTransactionType.fill_ip_offers.id]: {
    ...RoycoTransactionType.fill_ip_offers,
    title: 'Fill IP Offers',
    label: 'Fill Offers',
  },
  [RoycoTransactionType.fill_ap_offers.id]: {
    ...RoycoTransactionType.fill_ap_offers,
    title: 'Fill AP Offers',
    label: 'Fill Offers',
  },
  [RoycoTransactionType.create_ap_offer.id]: {
    ...RoycoTransactionType.create_ap_offer,
    title: 'Create AP Offer',
    label: 'Create Offer',
  },
  [RoycoTransactionType.create_ip_offer.id]: {
    ...RoycoTransactionType.create_ip_offer,
    title: 'Create IP Offer',
    label: 'Create Offer',
  },
};

export const MarketRewardStyle: Record<
  TypedRoycoMarketRewardStyle,
  RoycoMarketRewardStyleRecordType & {
    label: string;
    tag: string;
    description: string;
  }
> = {
  upfront: {
    ...RoycoMarketRewardStyle.upfront,
    label: 'Upfront',
    tag: '',
    description: 'Pay all incentives at the completion of action.',
  },
  arrear: {
    ...RoycoMarketRewardStyle.arrear,
    label: 'Arrear',
    tag: '',
    description:
      "Lock Action Provider's assets and pay incentives once unlocked.",
  },
  forfeitable: {
    ...RoycoMarketRewardStyle.forfeitable,
    label: 'Forfeitable',
    tag: '',
    description:
      "Lock Action Provider's assets and stream incentives, which are forfeited if withdrawn early.",
  },
};

export type TypedMarketStep = 'params' | 'preview' | 'transaction';

export const MarketSteps: Record<
  TypedMarketStep,
  {
    id: TypedMarketStep;
    label: string;
    description: string;
  }
> = {
  params: {
    id: 'params',
    label: 'TRANSACT',
    description: 'Select the market you want to trade.',
  },
  preview: {
    id: 'preview',
    label: 'PREVIEW',
    description: 'Select the action you want to perform.',
  },
  transaction: {
    id: 'transaction',
    label: 'Transaction',
    description: 'Review and confirm your transaction.',
  },
};

export type MarketStatsViewType = 'positions' | 'offers';
export const MarketStatsView: Record<
  MarketStatsViewType,
  {
    id: MarketStatsViewType;
  }
> = {
  positions: {
    id: 'positions',
  },
  offers: {
    id: 'offers',
  },
};

export type TypedMarketWithdrawType = 'input_token' | 'incentives';
export const MarketWithdrawType: Record<
  TypedMarketWithdrawType,
  {
    id: TypedMarketWithdrawType;
    label: string;
  }
> = {
  input_token: {
    id: 'input_token',
    label: 'Input Token',
  },
  incentives: {
    id: 'incentives',
    label: 'Incentives',
  },
};

export const MarketFundingType = {
  [RoycoMarketFundingType.wallet.id]: {
    ...RoycoMarketFundingType.wallet,
    label: 'Wallet',
  },
  [RoycoMarketFundingType.vault.id]: {
    ...RoycoMarketFundingType.vault,
    label: 'ERC-4626 Vault',
  },
};

/**
 * @info Market Manager State
 */
export type MarketManagerState = {
  viewType: TypedMarketViewType;
  setViewType: (viewType: TypedMarketViewType) => void;

  actionType: TypedRoycoMarketActionType;
  setActionType: (actionType: TypedRoycoMarketActionType) => void;

  userType: TypedRoycoMarketUserType;
  setUserType: (userType: TypedRoycoMarketUserType) => void;

  intentType: TypedRoycoMarketOfferType;
  setIntentType: (intentType: TypedRoycoMarketOfferType) => void;

  incentiveType: TypedRoycoMarketIncentiveType;
  setIncentiveType: (incentiveType: TypedRoycoMarketIncentiveType) => void;

  scriptType: TypedRoycoMarketScriptType;
  setScriptType: (scriptType: TypedRoycoMarketScriptType) => void;

  marketStep: TypedMarketStep;
  setMarketStep: (marketStep: TypedMarketStep) => void;

  transactions: any[];
  setTransactions: (transactions: any[]) => void;

  balanceIncentiveType: TypedRoycoMarketIncentiveType;
  setBalanceIncentiveType: (
    balanceIncentiveType: TypedRoycoMarketIncentiveType,
  ) => void;

  statsView: MarketStatsViewType;
  setStatsView: (statsView: MarketStatsViewType) => void;

  offerTablePage: number;
  setOfferTablePage: (offerTablePage: number) => void;

  positionsRecipeTablePage: number;
  setPositionsRecipeTablePage: (positionsRecipeTablePage: number) => void;

  withdrawType: TypedMarketWithdrawType;
  setWithdrawType: (withdrawType: TypedMarketWithdrawType) => void;

  withdrawSectionPage: number;
  setWithdrawSectionPage: (withdrawSectionPage: number) => void;

  offerType: TypedRoycoMarketOfferType;
  setOfferType: (offerType: TypedRoycoMarketOfferType) => void;

  vaultIncentiveActionType: TypedRoycoMarketVaultIncentiveAction;
  setVaultIncentiveActionType: (
    vaultIncentiveActionType: TypedRoycoMarketVaultIncentiveAction,
  ) => void;

  fundingType: TypedRoycoMarketFundingType;
  setFundingType: (fundingType: TypedRoycoMarketFundingType) => void;
};

export const createMarketManagerStore = () => {
  return create<MarketManagerState>((set) => ({
    viewType: MarketViewType.simple.id,
    // viewType: MarketViewType.advanced.id,
    setViewType: (viewType: TypedMarketViewType) => set({ viewType }),

    incentiveType: MarketIncentiveType.ap.id,
    setIncentiveType: (incentiveType: TypedRoycoMarketIncentiveType) =>
      set({ incentiveType }),

    intentType: MarketOfferType.market.id,
    setIntentType: (intentType: TypedRoycoMarketOfferType) =>
      set({ intentType }),

    scriptType: MarketScriptType.enter_actions.id,
    setScriptType: (scriptType: TypedRoycoMarketScriptType) =>
      set({ scriptType }),

    marketStep: MarketSteps.params.id,
    setMarketStep: (marketStep: TypedMarketStep) => set({ marketStep }),

    transactions: [],
    setTransactions: (transactions: any[]) => set({ transactions }),

    balanceIncentiveType: MarketIncentiveType.ap.id,
    setBalanceIncentiveType: (
      balanceIncentiveType: TypedRoycoMarketIncentiveType,
    ) => set({ balanceIncentiveType }),

    statsView: MarketStatsView.positions.id,
    setStatsView: (statsView: MarketStatsViewType) => set({ statsView }),

    offerTablePage: 0,
    setOfferTablePage: (offerTablePage: number) => set({ offerTablePage }),

    positionsRecipeTablePage: 0,
    setPositionsRecipeTablePage: (positionsRecipeTablePage: number) =>
      set({ positionsRecipeTablePage }),

    withdrawType: MarketWithdrawType.input_token.id,
    setWithdrawType: (withdrawType: TypedMarketWithdrawType) =>
      set({ withdrawType }),

    withdrawSectionPage: 0,
    setWithdrawSectionPage: (withdrawSectionPage: number) =>
      set({ withdrawSectionPage }),

    actionType: MarketActionType.supply.id,
    setActionType: (actionType: TypedRoycoMarketActionType) =>
      set({ actionType }),

    userType: MarketUserType.ap.id,
    setUserType: (userType: TypedRoycoMarketUserType) => set({ userType }),

    offerType: MarketOfferType.market.id,
    setOfferType: (offerType: TypedRoycoMarketOfferType) => set({ offerType }),

    vaultIncentiveActionType: MarketVaultIncentiveAction.add.id,
    setVaultIncentiveActionType: (
      vaultIncentiveActionType: TypedRoycoMarketVaultIncentiveAction,
    ) => set({ vaultIncentiveActionType }),

    fundingType: RoycoMarketFundingType.wallet.id,
    setFundingType: (fundingType: TypedRoycoMarketFundingType) =>
      set({ fundingType }),
  }));
};

export type MarketManagerStoreApi = ReturnType<typeof createMarketManagerStore>;
