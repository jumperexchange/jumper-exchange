import {
  widgetAmountsSchema,
  widgetQuotesSchema,
  widgetReviewSchema,
  widgetSelectionSchema,
  widgetSuccessSchema,
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

export function parseSearchParams(url: string, route: string): RouteParams {
  const searchParams = new URL(url).searchParams;
  const rawParams = {
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

  // Validate with the specific route schema
  let routeSchema;
  switch (route) {
    case 'widget-quotes':
      routeSchema = widgetQuotesSchema;
      break;
    case 'widget-amounts':
      routeSchema = widgetAmountsSchema;
      break;
    case 'widget-review':
      routeSchema = widgetReviewSchema;
      break;
    case 'widget-selection':
      routeSchema = widgetSelectionSchema;
      break;
    case 'widget-success':
      routeSchema = widgetSuccessSchema;
      break;
    default:
      throw new Error('Invalid route');
  }

  const routeResult = routeSchema.safeParse(rawParams);
  if (!routeResult.success) {
    console.error('Validation error:', routeResult.error);
    throw new Error('Invalid parameters for this route');
  }

  return routeResult.data;
}
