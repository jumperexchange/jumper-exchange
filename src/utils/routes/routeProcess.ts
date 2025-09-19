import {
  LiFiErrorCode,
  type LiFiStep,
  type LiFiStepExtended,
  type Process,
  type RouteExtended,
} from '@lifi/sdk';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import { getDetailInformation } from './routeUtils';

interface GetProcessInformationType {
  [TrackingEventParameter.TransactionHash]?: string;
  [TrackingEventParameter.TransactionLink]?: string;
  [TrackingEventParameter.TransactionStatus]?: string;
  [TrackingEventParameter.ErrorCode]?: string;
  [TrackingEventParameter.ErrorMessage]?: string;
}

const findErrorKeyFromErrorCode = (code?: string | number) => {
  if (!code) return null;

  return (
    Object.keys(LiFiErrorCode).find(
      (key) =>
        LiFiErrorCode[key as keyof typeof LiFiErrorCode].toString() ===
        code.toString(),
    ) || null
  );
};

export const getProcessInformation = (
  route: RouteExtended,
): GetProcessInformationType => {
  let processData = {};
  let errors = {};
  const txHashes: string[] = [];
  const txLinks: string[] = [];
  const txStatuses: string[] = [];

  route.steps?.forEach((step: LiFiStep | LiFiStepExtended) => {
    const detailInformation = getDetailInformation(step);

    if ('process' in detailInformation) {
      detailInformation.process.forEach((process: Process) => {
        // Truncate error message at the data field to keep only useful info
        let errorMessage = process.error?.message;
        if (errorMessage && errorMessage.includes('data:')) {
          errorMessage = errorMessage.substring(
            0,
            errorMessage.indexOf('data:'),
          );
        }
        const errorCodeKey = findErrorKeyFromErrorCode(process.error?.code);
        errors = {
          ...(process.error?.code && {
            [TrackingEventParameter.ErrorCode]: process.error?.code,
          }),
          ...(errorCodeKey && {
            [TrackingEventParameter.ErrorCodeKey]: errorCodeKey,
          }),
          ...(errorMessage && {
            [TrackingEventParameter.ErrorMessage]: errorMessage.trim(),
          }),
        };

        // Collect transaction data in arrays
        if (process.txHash) {
          txHashes.push(process.txHash);
        }
        if (process.txLink) {
          txLinks.push(process.txLink);
        }
        if (process.status) {
          txStatuses.push(process.status);
        }
      });
    }
  });

  processData = {
    ...(txHashes.length > 0 && {
      [TrackingEventParameter.TransactionHash]: txHashes.join(','),
    }),
    ...(txLinks.length > 0 && {
      [TrackingEventParameter.TransactionLink]: txLinks.join(','),
    }),
    ...(txStatuses.length > 0 && {
      [TrackingEventParameter.TransactionStatus]: txStatuses.join(','),
    }),
    ...errors,
  };

  return processData;
};
