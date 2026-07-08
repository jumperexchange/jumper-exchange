import { captureRequestError } from '@sentry/nextjs';
import { errorOperationFromRequestContext } from '@/utils/telemetry/errorOperations';
import { recordServerError } from '@/utils/telemetry/recordError';

export const onRequestError: typeof captureRequestError = async (
  error,
  request,
  context,
) => {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    recordServerError(errorOperationFromRequestContext(context.routeType));
  }

  return captureRequestError(error, request, context);
};
