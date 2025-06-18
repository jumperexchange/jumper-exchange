import { Route, RouteExtended } from '@lifi/sdk';
import { formatUnits } from 'viem';
import { getDetailInformation } from './routeUtils';

export const getGasAndFeeCosts = (route: Route | RouteExtended) => {
  // Check if there are any included steps
  const hasIncludedSteps = route.steps?.some(
    (step) => step.includedSteps && step.includedSteps.length > 0,
  );

  if (hasIncludedSteps) {
    // Use included costs logic
    let totalGasAmount = 0;
    let totalGasAmountUSD = 0;
    let totalFeeAmount = 0;
    let totalFeeAmountUSD = 0;

    route.steps.forEach((step) => {
      if (step.includedSteps && step.includedSteps.length > 0) {
        step.includedSteps.forEach((includedStep) => {
          // Process gas costs
          if (includedStep.estimate.gasCosts) {
            const gasAmount = includedStep.estimate.gasCosts.reduce(
              (sum, gasCost) => sum + parseFloat(gasCost.amount || '0'),
              0,
            );
            const gasAmountUSD = includedStep.estimate.gasCosts.reduce(
              (sum, gasCost) => sum + parseFloat(gasCost.amountUSD || '0'),
              0,
            );
            totalGasAmount += gasAmount;
            totalGasAmountUSD += gasAmountUSD;
          }

          // Process fee costs
          if (includedStep.estimate.feeCosts) {
            const feeAmount = includedStep.estimate.feeCosts.reduce(
              (sum, feeCost) => sum + parseFloat(feeCost.amount || '0'),
              0,
            );
            const feeAmountUSD = includedStep.estimate.feeCosts.reduce(
              (sum, feeCost) => sum + parseFloat(feeCost.amountUSD || '0'),
              0,
            );
            totalFeeAmount += feeAmount;
            totalFeeAmountUSD += feeAmountUSD;
          }
        });
      }
    });

    // Get decimals from the first token in gas/fee costs for formatting
    const includedGasToken = route.steps.find((step) =>
      step.includedSteps?.find(
        (included) => included.estimate.gasCosts?.[0]?.token,
      ),
    )?.includedSteps?.[0]?.estimate.gasCosts?.[0]?.token;

    const includedFeeToken = route.steps.find((step) =>
      step.includedSteps?.find(
        (included) => included.estimate.feeCosts?.[0]?.token,
      ),
    )?.includedSteps?.[0]?.estimate.feeCosts?.[0]?.token;

    const formattedIncludedGasAmount =
      includedGasToken &&
      formatUnits(BigInt(totalGasAmount.toString()), includedGasToken.decimals);
    const formattedIncludedFeeAmount =
      includedFeeToken &&
      formatUnits(BigInt(totalFeeAmount.toString()), includedFeeToken.decimals);

    return {
      gasCostUSD: totalGasAmountUSD,
      gasCost: totalGasAmount,
      gasCostFormatted: formattedIncludedGasAmount,
      feeCostUSD: totalFeeAmountUSD,
      feeCost: totalFeeAmount,
      feeCostFormatted: formattedIncludedFeeAmount,
    };
  } else if (
    route.steps.find((step) => 'execution' in step || 'estimate' in step)
  ) {
    // Use regular costs logic
    let totalGasAmount = 0;
    let totalGasAmountUSD = 0;
    let totalFeeAmount = 0;
    let totalFeeAmountUSD = 0;

    route.steps?.forEach((step) => {
      const detailInformation = getDetailInformation(step);

      // Process gas costs
      const gasCosts = detailInformation.gasCosts;
      if (gasCosts) {
        const gasAmount = gasCosts.reduce((sum, gasCost) => {
          return sum + parseFloat(gasCost.amount || '0');
        }, 0);
        const gasAmountUSD = gasCosts.reduce((sum, gasCost) => {
          return sum + parseFloat(gasCost.amountUSD || '0');
        }, 0);
        totalGasAmount += gasAmount;
        totalGasAmountUSD += gasAmountUSD;
      }

      // Process fee costs
      const feeCosts = detailInformation.feeCosts;
      if (feeCosts) {
        const feeAmount = feeCosts.reduce((sum, feeCost) => {
          return sum + parseFloat(feeCost.amount || '0');
        }, 0);
        const feeAmountUSD = feeCosts.reduce((sum, feeCost) => {
          return sum + parseFloat(feeCost.amountUSD || '0');
        }, 0);
        totalFeeAmount += feeAmount;
        totalFeeAmountUSD += feeAmountUSD;
      }
    });

    // Get decimals from the first token in gas/fee costs for formatting
    const gasToken = route.steps?.find((step) => {
      const detailInformation = getDetailInformation(step);
      return detailInformation.gasCosts?.[0]?.token;
    })?.estimate.gasCosts?.[0]?.token;

    const feeToken = route.steps?.find((step) => {
      const detailInformation = getDetailInformation(step);
      return detailInformation.feeCosts?.[0]?.token;
    })?.estimate.feeCosts?.[0]?.token;

    const formattedGasAmount =
      gasToken && formatUnits(BigInt(totalGasAmount), gasToken.decimals);
    const formattedFeeAmount =
      feeToken && formatUnits(BigInt(totalFeeAmount), feeToken.decimals);

    return {
      gasCostUSD: totalGasAmountUSD,
      gasCost: totalGasAmount,
      gasCostFormatted: formattedGasAmount,
      feeCostUSD: totalFeeAmountUSD,
      feeCost: totalFeeAmount,
      feeCostFormatted: formattedFeeAmount,
    };
  } else {
    return {
      gasCostUSD: route.gasCostUSD,
    };
  }
};
