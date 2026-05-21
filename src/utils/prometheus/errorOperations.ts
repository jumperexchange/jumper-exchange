export const ERROR_OPERATIONS = [
  'request_render',
  'request_route',
  'request_action',
  'request_middleware',
  'api_proxy',
  'wallet_connect',
  'widget_quote',
  'client',
  'unknown',
] as const;

export type ErrorOperation = (typeof ERROR_OPERATIONS)[number];

const isErrorOperation = (value: string): value is ErrorOperation =>
  (ERROR_OPERATIONS as readonly string[]).includes(value);

export const parseErrorOperation = (
  value: string | null | undefined,
): ErrorOperation => {
  if (value && isErrorOperation(value)) {
    return value;
  }
  return 'unknown';
};

export const errorOperationFromRequestContext = (
  routeType: string,
): ErrorOperation => {
  switch (routeType) {
    case 'render':
      return 'request_render';
    case 'route':
      return 'request_route';
    case 'action':
      return 'request_action';
    case 'middleware':
      return 'request_middleware';
    default:
      return 'unknown';
  }
};
