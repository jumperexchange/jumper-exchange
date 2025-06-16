import type { LiFiStep, LiFiStepExtended, RouteExtended } from '@lifi/sdk';
import { TrackingEventParameter } from 'src/const/trackingKeys';

interface GetProcessInformationType {
  [TrackingEventParameter.TransactionHash]?: string;
  [TrackingEventParameter.TransactionLink]?: string;
  [TrackingEventParameter.TransactionStatus]?: string;
  [TrackingEventParameter.ErrorCode]?: string;
  [TrackingEventParameter.ErrorMessage]?: string;
}

export const getProcessInformation = (
  route: RouteExtended,
): GetProcessInformationType => {
  let processData = {};
  let errors = {};
  const txHashes: string[] = [];
  const txLinks: string[] = [];
  const txStatuses: string[] = [];

  route.steps.forEach((step: LiFiStep | LiFiStepExtended) => {
    // Check if the step is of type LiFiStepExtended by checking the presence of the 'execution' property
    const isExtendedStep = 'execution' in step;
    // Determine detailInformation: use 'execution' if it's an extended step, otherwise fall back to 'estimate'
    const detailInformation =
      isExtendedStep && step.execution ? step.execution : step.estimate;

    if ('process' in detailInformation) {
      detailInformation.process.forEach((process) => {
        // Truncate error message at the data field to keep only useful info
        let errorMessage = process.error?.message;
        if (errorMessage && errorMessage.includes('data:')) {
          errorMessage = errorMessage.substring(
            0,
            errorMessage.indexOf('data:'),
          );
        }
        errors = {
          ...(process.error?.code && {
            [TrackingEventParameter.ErrorCode]: process.error?.code,
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
