import {
  LiFiErrorCode,
  type LiFiStep,
  type LiFiStepExtended,
  type Process,
  type RouteExtended,
} from '@lifi/sdk';
import { TrackingEventParameter } from 'src/const/trackingKeys';
import { getDetailInformation } from './routeUtils';
import { findKey } from 'lodash';

interface GetProcessInformationType {
  [TrackingEventParameter.TransactionHash]?: string;
  [TrackingEventParameter.TransactionLink]?: string;
  [TrackingEventParameter.TransactionStatus]?: string;
  [TrackingEventParameter.ErrorCode]?: string;
  [TrackingEventParameter.ErrorCodeKey]?: string;
  [TrackingEventParameter.ErrorMessage]?: string;
}

const findErrorKeyFromErrorCode = (code?: string) => {
  if (!code) return null;

  return findKey(LiFiErrorCode, (value) => value.toString() === code) ?? null;
};

export const getProcessInformation = (
  route: RouteExtended,
): GetProcessInformationType => {
  let processData: GetProcessInformationType = {};
  let errors: Pick<
    GetProcessInformationType,
    | TrackingEventParameter.ErrorCode
    | TrackingEventParameter.ErrorCodeKey
    | TrackingEventParameter.ErrorMessage
  > = {};
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
        const errorCode = process.error?.code?.toString();
        const errorCodeKey = findErrorKeyFromErrorCode(errorCode);

        if (errorCode) {
          errors[TrackingEventParameter.ErrorCode] = errorCode;
        }
        if (errorCodeKey) {
          errors[TrackingEventParameter.ErrorCodeKey] = errorCodeKey;
        }
        if (errorMessage) {
          errors[TrackingEventParameter.ErrorMessage] = errorMessage.trim();
        }

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

  if (errors[TrackingEventParameter.ErrorCode]) {
    processData[TrackingEventParameter.ErrorCode] =
      errors[TrackingEventParameter.ErrorCode];
  }
  if (errors[TrackingEventParameter.ErrorCodeKey]) {
    processData[TrackingEventParameter.ErrorCodeKey] =
      errors[TrackingEventParameter.ErrorCodeKey];
  }
  if (errors[TrackingEventParameter.ErrorMessage]) {
    processData[TrackingEventParameter.ErrorMessage] =
      errors[TrackingEventParameter.ErrorMessage];
  }
  if (txHashes.length > 0) {
    processData[TrackingEventParameter.TransactionHash] = txHashes.join(',');
  }
  if (txLinks.length > 0) {
    processData[TrackingEventParameter.TransactionLink] = txLinks.join(',');
  }
  if (txStatuses.length > 0) {
    processData[TrackingEventParameter.TransactionStatus] =
      txStatuses.join(',');
  }

  return processData;
};
