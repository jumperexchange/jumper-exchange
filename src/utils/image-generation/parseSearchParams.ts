import type { z } from 'zod';
import {
  type WidgetAmountsParams,
  type WidgetQuotesParams,
  type WidgetReviewParams,
  type WidgetSelectionParams,
  type WidgetSuccessParams,
} from './widgetSchemas';

type RouteParams =
  | WidgetQuotesParams
  | WidgetAmountsParams
  | WidgetReviewParams
  | WidgetSelectionParams
  | WidgetSuccessParams;

type RawParams = {
  amount?: string | null;
  fromToken?: string | null;
  fromChainId?: string | null;
  toToken?: string | null;
  toChainId?: string | null;
  highlighted?: string | null;
  theme?: string | null;
  isSwap?: string | null;
  amountUSD?: string | null;
  chainName?: string | null;
};

export function parseSearchParams<T extends RouteParams>(
  url: string,
  schema: z.ZodType<T, any, RawParams>,
): T {
  const searchParams = new URL(url).searchParams;
  const rawParams: RawParams = {
    amount: searchParams.get('amount'),
    fromToken: searchParams.get('fromToken'),
    fromChainId: searchParams.get('fromChainId'),
    toToken: searchParams.get('toToken'),
    toChainId: searchParams.get('toChainId'),
    highlighted: searchParams.get('highlighted'),
    theme: searchParams.get('theme') || 'light',
    isSwap: searchParams.get('isSwap') || 'false',
    amountUSD: searchParams.get('amountUSD'),
    chainName: searchParams.get('chainName'),
  };

  const routeResult = schema.safeParse(rawParams);
  if (!routeResult.success) {
    console.error('Validation error:', routeResult.error);
    throw new Error('Invalid parameters for this route');
  }

  return routeResult.data;
}
