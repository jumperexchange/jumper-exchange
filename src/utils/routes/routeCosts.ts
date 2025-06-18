import { Estimate, Execution, Route, RouteExtended } from '@lifi/sdk';
import { formatUnits } from 'viem';
import { getDetailInformation } from './routeUtils';

// Helper function to calculate costs from a single step or included step
const calculateStepCosts = (step: Estimate | Execution) => {
  let gasAmount = 0;
  let gasAmountUSD = 0;
  let feeAmount = 0;
  let feeAmountUSD = 0;

  // Process gas costs
  if (Array.isArray(step.gasCosts) && step.gasCosts.length > 0) {
    gasAmount = step.gasCosts.reduce(
      (sum, gasCost) => sum + parseFloat(gasCost.amount || '0'),
      0,
    );
    gasAmountUSD = step.gasCosts.reduce(
      (sum, gasCost) => sum + parseFloat(gasCost.amountUSD || '0'),
      0,
    );
  }

  // Process fee costs
  if (Array.isArray(step.feeCosts) && step.feeCosts.length > 0) {
    feeAmount = step.feeCosts.reduce(
      (sum, feeCost) => sum + parseFloat(feeCost.amount || '0'),
      0,
    );
    feeAmountUSD = step.feeCosts.reduce(
      (sum, feeCost) => sum + parseFloat(feeCost.amountUSD || '0'),
      0,
    );
  }

  return { gasAmount, gasAmountUSD, feeAmount, feeAmountUSD };
};

// Helper function to get token for formatting
const getTokenForFormatting = (
  route: Route | RouteExtended,
  isIncludedSteps: boolean,
) => {
  if (isIncludedSteps) {
    const gasToken = route.steps.find((step) =>
      step.includedSteps?.find(
        (included) => included.estimate.gasCosts?.[0]?.token,
      ),
    )?.includedSteps?.[0]?.estimate.gasCosts?.[0]?.token;

    const feeToken = route.steps.find((step) =>
      step.includedSteps?.find(
        (included) => included.estimate.feeCosts?.[0]?.token,
      ),
    )?.includedSteps?.[0]?.estimate.feeCosts?.[0]?.token;

    return { gasToken, feeToken };
  } else {
    const gasToken = route.steps?.find((step) => {
      const detailInformation = getDetailInformation(step);
      return detailInformation.gasCosts?.[0]?.token;
    })?.estimate.gasCosts?.[0]?.token;

    const feeToken = route.steps?.find((step) => {
      const detailInformation = getDetailInformation(step);
      return detailInformation.feeCosts?.[0]?.token;
    })?.estimate.feeCosts?.[0]?.token;

    return { gasToken, feeToken };
  }
};

export const getGasAndFeeCosts = (route: Route | RouteExtended) => {
  // First: Check if execution is in route.steps for most precise data
  if (route.steps?.find((step) => 'execution' in step)) {
    // Use regular costs logic for execution steps
    let totalGasAmount = 0;
    let totalGasAmountUSD = 0;
    let totalFeeAmount = 0;
    let totalFeeAmountUSD = 0;

    route.steps?.forEach((step) => {
      const detailInformation = getDetailInformation(step);
      const costs = calculateStepCosts(detailInformation);
      totalGasAmount += costs.gasAmount;
      totalGasAmountUSD += costs.gasAmountUSD;
      totalFeeAmount += costs.feeAmount;
      totalFeeAmountUSD += costs.feeAmountUSD;
    });

    const { gasToken, feeToken } = getTokenForFormatting(route, false);

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
  }
  // Second: Check if it has includedSteps
  else if (
    route.steps?.some(
      (step) => step.includedSteps && step.includedSteps.length > 0,
    )
  ) {
    // Use included costs logic
    let totalGasAmount = 0;
    let totalGasAmountUSD = 0;
    let totalFeeAmount = 0;
    let totalFeeAmountUSD = 0;

    route.steps.forEach((step) => {
      if (step.includedSteps && step.includedSteps.length > 0) {
        step.includedSteps.forEach((includedStep) => {
          const costs = calculateStepCosts(includedStep.estimate);
          totalGasAmount += costs.gasAmount;
          totalGasAmountUSD += costs.gasAmountUSD;
          totalFeeAmount += costs.feeAmount;
          totalFeeAmountUSD += costs.feeAmountUSD;
        });
      }
    });

    const { gasToken, feeToken } = getTokenForFormatting(route, true);

    const formattedGasAmount =
      gasToken &&
      formatUnits(BigInt(totalGasAmount.toString()), gasToken.decimals);
    const formattedFeeAmount =
      feeToken &&
      formatUnits(BigInt(totalFeeAmount.toString()), feeToken.decimals);

    return {
      gasCostUSD: totalGasAmountUSD,
      gasCost: totalGasAmount,
      gasCostFormatted: formattedGasAmount,
      feeCostUSD: totalFeeAmountUSD,
      feeCost: totalFeeAmount,
      feeCostFormatted: formattedFeeAmount,
    };
  }
  // Third: Check if estimate in route.steps
  else if (route.steps?.find((step) => 'estimate' in step)) {
    // Use regular costs logic for estimate steps
    let totalGasAmount = 0;
    let totalGasAmountUSD = 0;
    let totalFeeAmount = 0;
    let totalFeeAmountUSD = 0;

    route.steps?.forEach((step) => {
      const detailInformation = getDetailInformation(step);
      const costs = calculateStepCosts(detailInformation);
      totalGasAmount += costs.gasAmount;
      totalGasAmountUSD += costs.gasAmountUSD;
      totalFeeAmount += costs.feeAmount;
      totalFeeAmountUSD += costs.feeAmountUSD;
    });

    const { gasToken, feeToken } = getTokenForFormatting(route, false);

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
  }
  // Last: Default fallback
  else {
    return {
      gasCostUSD: route.gasCostUSD,
    };
  }
};
