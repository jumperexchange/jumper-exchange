export type TypedRoycoMarketType = 'recipe' | 'vault';
export const RoycoMarketType: Record<
  TypedRoycoMarketType,
  { id: TypedRoycoMarketType; value: 0 | 1 }
> = {
  recipe: {
    id: 'recipe',
    value: 0,
  },
  vault: {
    id: 'vault',
    value: 1,
  },
};

export type TypedRoycoMarketRewardStyle = 'upfront' | 'arrear' | 'forfeitable';
export type RoycoMarketRewardStyleRecordType = {
  id: TypedRoycoMarketRewardStyle;
  value: 0 | 1 | 2;
};
export const RoycoMarketRewardStyle: Record<
  TypedRoycoMarketRewardStyle,
  RoycoMarketRewardStyleRecordType
> = {
  upfront: {
    id: 'upfront',
    value: 0,
  },
  arrear: {
    id: 'arrear',
    value: 1,
  },
  forfeitable: {
    id: 'forfeitable',
    value: 2,
  },
};

export type TypedRoycoMarketScriptType = 'enter_actions' | 'exit_actions';
export type RoycoMarketScriptTypeRecordType = {
  id: TypedRoycoMarketScriptType;
};

export const RoycoMarketScriptType: Record<
  TypedRoycoMarketScriptType,
  RoycoMarketScriptTypeRecordType
> = {
  enter_actions: {
    id: 'enter_actions',
  },
  exit_actions: {
    id: 'exit_actions',
  },
};

export type TypedRoycoMarketIncentiveType = 'ap' | 'ip';
export const RoycoMarketIncentiveType: Record<
  TypedRoycoMarketIncentiveType,
  { id: TypedRoycoMarketIncentiveType }
> = {
  ap: {
    id: 'ap',
  },
  ip: {
    id: 'ip',
  },
};

export type TypedRoycoMarketOfferType = 'market' | 'limit';
export const RoycoMarketOfferType: Record<
  TypedRoycoMarketOfferType,
  { id: TypedRoycoMarketOfferType }
> = {
  market: {
    id: 'market',
  },
  limit: {
    id: 'limit',
  },
};

export type TypedRoycoMarketVaultIncentiveAction =
  | 'add'
  | 'increase'
  | 'extend'
  | 'refund';
export const RoycoMarketVaultIncentiveAction: Record<
  TypedRoycoMarketVaultIncentiveAction,
  { id: TypedRoycoMarketVaultIncentiveAction }
> = {
  add: {
    id: 'add',
  },
  increase: {
    id: 'increase',
  },
  extend: {
    id: 'extend',
  },
  refund: {
    id: 'refund',
  },
};

export type TypedRoycoMarketUserType = 'ap' | 'ip';
export const RoycoMarketUserType: Record<
  TypedRoycoMarketUserType,
  { id: TypedRoycoMarketUserType; value: 0 | 1 }
> = {
  ap: {
    id: 'ap',
    value: 0,
  },
  ip: {
    id: 'ip',
    value: 1,
  },
};

export type TypedRoycoMarketFundingType = 'wallet' | 'vault';
export const RoycoMarketFundingType: Record<
  TypedRoycoMarketFundingType,
  { id: TypedRoycoMarketFundingType }
> = {
  wallet: {
    id: 'wallet',
  },
  vault: {
    id: 'vault',
  },
};

export type TypedRoycoMarketActionType = 'supply' | 'withdraw';
export const RoycoMarketActionType: Record<
  TypedRoycoMarketActionType,
  { id: TypedRoycoMarketActionType }
> = {
  supply: {
    id: 'supply',
  },
  withdraw: {
    id: 'withdraw',
  },
};

export type TypedRoycoTransactionType =
  | 'approve_tokens'
  | 'fill_ip_offers'
  | 'fill_ap_offers'
  | 'create_ap_offer'
  | 'create_ip_offer';
// export const RoycoTransactionType: Record<
//   TypedRoycoTransactionType,
//   { id: TypedRoycoTransactionType }
// > = {
//   approve: {
//     id: "approve",
//   },
//   create: {
//     id: "create",
//   },
// };
export const RoycoTransactionType: Record<
  TypedRoycoTransactionType,
  { id: TypedRoycoTransactionType }
> = {
  approve_tokens: {
    id: 'approve_tokens',
  },
  fill_ip_offers: {
    id: 'fill_ip_offers',
  },
  fill_ap_offers: {
    id: 'fill_ap_offers',
  },
  create_ap_offer: {
    id: 'create_ap_offer',
  },
  create_ip_offer: {
    id: 'create_ip_offer',
  },
};
