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

// Helper function to process any array of steps and calculate total costs
const processCosts = (steps: any[]) => {
  let totalGasAmount = 0;
  let totalGasAmountUSD = 0;
  let totalFeeAmount = 0;
  let totalFeeAmountUSD = 0;

  steps.forEach((step) => {
    const stepToProcess = step.estimate || step.execution || step;
    const costs = calculateStepCosts(stepToProcess);

    totalGasAmount += costs.gasAmount;
    totalGasAmountUSD += costs.gasAmountUSD;
    totalFeeAmount += costs.feeAmount;
    totalFeeAmountUSD += costs.feeAmountUSD;
  });

  return {
    totalGasAmount,
    totalGasAmountUSD,
    totalFeeAmount,
    totalFeeAmountUSD,
  };
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
  if (!route.steps?.length) {
    return {
      gasCostUSD: route.gasCostUSD,
    };
  }

  let costs;
  let isIncludedSteps = false;

  // Check if we have included steps and no execution/estimate
  const hasIncludedSteps = route.steps.some(
    (step) => step.includedSteps?.length > 0,
  );
  const hasExecutionOrEstimate = route.steps.find(
    (step) => 'execution' in step || 'estimate' in step,
  );

  if (hasIncludedSteps && !hasExecutionOrEstimate) {
    // Flatten included steps into a single array
    const includedSteps = route.steps
      .filter((step) => step.includedSteps?.length > 0)
      .flatMap((step) => step.includedSteps);
    costs = processCosts(includedSteps);
    isIncludedSteps = true;
  } else {
    costs = processCosts(route.steps);
  }

  const { gasToken, feeToken } = getTokenForFormatting(route, isIncludedSteps);

  const formattedGasAmount =
    gasToken &&
    formatUnits(BigInt(costs.totalGasAmount.toString()), gasToken.decimals);
  const formattedFeeAmount =
    feeToken &&
    formatUnits(BigInt(costs.totalFeeAmount.toString()), feeToken.decimals);

  return {
    gasCostUSD: costs.totalGasAmountUSD,
    gasCost: costs.totalGasAmount,
    gasCostFormatted: formattedGasAmount,
    feeCostUSD: costs.totalFeeAmountUSD,
    feeCost: costs.totalFeeAmount,
    feeCostFormatted: formattedFeeAmount,
  };
};
