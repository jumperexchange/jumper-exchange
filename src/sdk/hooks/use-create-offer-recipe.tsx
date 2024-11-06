import {
  RoycoMarketUserType,
  RoycoMarketOfferType,
  RoycoMarketRewardStyle,
  RoycoMarketType,
  TypedRoycoMarketUserType,
  TypedRoycoMarketOfferType,
  TypedRoycoMarketRewardStyle,
  TypedRoycoTransactionType,
  RoycoTransactionType,
} from "../market";
import { getSupportedToken, NULL_ADDRESS, SupportedToken } from "../constants";
import { ContractMap, MulticallAbi } from "../contracts";
import {
  getSupportedChain,
  isSolidityAddressValid,
  isSolidityIntValid,
} from "../utils";
import { Address } from "abitype";
import { useTokenAllowance } from "./use-token-allowance";
import { BigNumber, ethers } from "ethers";
import { erc20Abi, multicall3Abi } from "viem";
import { useTokenQuotes } from "./use-token-quotes";
import { useEnrichedMarket } from "./use-enriched-market";
import { useMarketOffersRecipe } from "./use-market-offers-recipe";
import { useReadRecipeMarket } from "./use-read-recipe-market";
import { useReadProtocolFeeRecipe } from "./use-read-protocol-fee-recipe";
import { TransactionOptionsType } from "@/components/composables";
import { MarketTransactionType } from "@/store";

const erc20Interface = new ethers.utils.Interface(erc20Abi);

export const checkOfferValidityRecipe = ({
  chainId,
  targetMarketId,
  fundingVault,
  quantity,
  expiry,
  incentiveTokens,
  incentiveTokensAmount,
  userType,
  offerType,
}: {
  chainId: number;
  targetMarketId: string;
  fundingVault: string;
  quantity: string;
  expiry: string;
  incentiveTokens: string[];
  incentiveTokensAmount: string[];
  userType: TypedRoycoMarketUserType;
  offerType: TypedRoycoMarketOfferType;
}): boolean => {
  try {
    const chain = getSupportedChain(chainId);
    if (!chain) {
      throw new Error("Unsupported chain");
    }

    // (AP)
    if (userType === RoycoMarketUserType.ap.id) {
      // Market Offer
      if (offerType === RoycoMarketOfferType.market.id) {
        const isValid =
          isSolidityIntValid("uint256", targetMarketId) &&
          isSolidityIntValid("uint256", quantity) &&
          isSolidityAddressValid("address", fundingVault) &&
          quantity !== "0";
        return isValid;
      }
      // Limit Offer
      else {
        const isValid =
          isSolidityIntValid("uint256", targetMarketId) &&
          isSolidityIntValid("uint256", quantity) &&
          isSolidityAddressValid("address", fundingVault) &&
          incentiveTokens.every((token) =>
            isSolidityAddressValid("address", token)
          ) &&
          incentiveTokensAmount.every((amount) =>
            isSolidityIntValid("uint256", amount)
          ) &&
          isSolidityIntValid("uint256", expiry) &&
          quantity !== "0";
        return isValid;
      }
    }
    // (IP)
    else {
      // Market Offer
      if (offerType === RoycoMarketOfferType.market.id) {
        const isValid =
          isSolidityIntValid("uint256", targetMarketId) &&
          isSolidityIntValid("uint256", quantity) &&
          quantity !== "0";
        return isValid;
      }
      // Limit Offer
      else {
        const isValid =
          isSolidityIntValid("uint256", targetMarketId) &&
          isSolidityIntValid("uint256", quantity) &&
          incentiveTokens.every((token) =>
            isSolidityAddressValid("address", token)
          ) &&
          incentiveTokensAmount.every((amount) =>
            isSolidityIntValid("uint256", amount)
          ) &&
          isSolidityIntValid("uint256", expiry) &&
          quantity !== "0";
        return isValid;
      }
    }
  } catch (error) {
    return false;
  }
};

export type GetIncentivesInfoRecipeDataElement = SupportedToken & {
  raw_amount: string;
  token_amount: string;
  per_input_token: number;
  change_ratio: number;
  annual_change_ratio: number;
};

export type GetIncentivesInfoRecipeResponseType = {
  status: "success" | "error";
  data: GetIncentivesInfoRecipeDataElement[];
};

export const getIncentivesInfoRecipe = ({
  inputTokenId,
  inputTokenRawAmount,
  incentiveIds,
  incentiveRawAmounts,
  rewardStyleValue,
  lockupTime,
}: {
  inputTokenId: string;
  inputTokenRawAmount: string;
  incentiveIds: string[];
  incentiveRawAmounts: string[];
  rewardStyleValue: number;
  lockupTime: string;
}): GetIncentivesInfoRecipeResponseType => {
  try {
    // Stores info for all the incentives
    let incentivesInfo: Array<GetIncentivesInfoRecipeDataElement> = [];

    // Calculate input token details
    const inputTokenData: SupportedToken = getSupportedToken(inputTokenId);
    const inputTokenTokenAmount: string = BigNumber.from(inputTokenRawAmount)
      .div(BigNumber.from(10).pow(inputTokenData.decimals))
      .toString();

    // Calculate time for which incentives are locked
    let incentiveLockupTime: string = "0"; // Assuming upfront reward style
    if (rewardStyleValue !== RoycoMarketRewardStyle.upfront.value) {
      incentiveLockupTime = lockupTime; // Update if not upfront reward style
    }

    for (let i = 0; i < incentiveIds.length; i++) {
      const incentiveId: string = incentiveIds[i];
      const incentiveData: SupportedToken = getSupportedToken(incentiveId);
      const incentiveRawAmount: string = incentiveRawAmounts[i];

      // Calculate incentive token amount
      const incentiveTokenAmount: string = BigNumber.from(incentiveRawAmount)
        .div(BigNumber.from(10).pow(incentiveData.decimals))
        .toString();

      // Find if incentive already exists in incentivesInfo
      const incentiveIndex = incentivesInfo.findIndex(
        (incentive) => incentive.id === incentiveId
      );

      // If not, add it
      if (incentiveIndex === -1) {
        incentivesInfo.push({
          ...incentiveData,
          raw_amount: incentiveRawAmount,
          token_amount: incentiveTokenAmount,
          per_input_token: 0, // Will be updated in next loop
          change_ratio: 0, // Will be updated in next loop
          annual_change_ratio: 0, // Will be updated in next loop
        });
      }
      // If it does, update it
      else {
        incentivesInfo[incentiveIndex].raw_amount = BigNumber.from(
          incentivesInfo[incentiveIndex].raw_amount
        )
          .add(BigNumber.from(incentiveRawAmount))
          .toString();
        incentivesInfo[incentiveIndex].token_amount = BigNumber.from(
          incentivesInfo[incentiveIndex].token_amount
        ).toString();
      }
    }

    for (let i = 0; i < incentivesInfo.length; i++) {
      const currentIncentiveInfo = incentivesInfo[i];

      // Calculate incentives per input token
      const perInputToken =
        parseFloat(currentIncentiveInfo.token_amount) /
        parseFloat(inputTokenTokenAmount);

      // Update incentivesInfo with calculated values
      incentivesInfo[i].per_input_token = perInputToken;
    }

    return {
      status: "success",
      data: incentivesInfo,
    };
  } catch (error) {
    return {
      status: "error",
      data: [],
    };
  }
};

export type GetIncentivesInfoWithFeesRecipeDataElement = SupportedToken & {
  raw_amount: string;
  token_amount: string;
  protocol_fee_raw_amount: string;
  protocol_fee_token_amount: string;
  frontend_fee_raw_amount: string;
  frontend_fee_token_amount: string;
};

export type GetIncentivesInfoWithFeesRecipeResponseType = {
  status: "success" | "error";
  data: GetIncentivesInfoWithFeesRecipeDataElement[];
};

export const getIncentivesInfoWithFees = ({
  incentiveIds,
  incentiveRawAmounts,
  protocolFee,
  frontendFee,
}: {
  incentiveIds: string[];
  incentiveRawAmounts: string[];
  protocolFee: string;
  frontendFee: string;
}): GetIncentivesInfoWithFeesRecipeResponseType => {
  try {
    // Stores info for all the incentives with fees
    let incentivesInfoWithFees: Array<GetIncentivesInfoWithFeesRecipeDataElement> =
      [];

    for (let i = 0; i < incentiveIds.length; i++) {
      const incentiveId: string = incentiveIds[i];
      const incentiveData: SupportedToken = getSupportedToken(incentiveId);
      const incentiveRawAmount: string = incentiveRawAmounts[i];

      const protocolFeeRawAmount: string = BigNumber.from(incentiveRawAmount)
        .mul(BigNumber.from(protocolFee))
        .div(BigNumber.from("10").pow(18))
        .toString();
      const frontendFeeRawAmount: string = BigNumber.from(incentiveRawAmount)
        .mul(BigNumber.from(frontendFee))
        .div(BigNumber.from("10").pow(18))
        .toString();

      const incentiveRawAmountAfterFees =
        BigNumber.from(incentiveRawAmount).toString();

      const protocolFeeTokenAmount: string = BigNumber.from(
        protocolFeeRawAmount
      )
        .div(BigNumber.from(10).pow(incentiveData.decimals))
        .toString();
      const frontendFeeTokenAmount: string = BigNumber.from(
        frontendFeeRawAmount
      )
        .div(BigNumber.from(10).pow(incentiveData.decimals))
        .toString();
      const incentiveTokenAmount: string = BigNumber.from(incentiveRawAmount)
        .div(BigNumber.from(10).pow(incentiveData.decimals))
        .toString();
      const incentiveTokenAmountAfterFees: string = BigNumber.from(
        incentiveRawAmountAfterFees
      )
        .div(BigNumber.from(10).pow(incentiveData.decimals))
        .toString();

      const incentiveIndex = incentivesInfoWithFees.findIndex(
        (incentive) => incentive.id === incentiveId
      );

      if (incentiveIndex === -1) {
        incentivesInfoWithFees.push({
          ...incentiveData,
          raw_amount: incentiveRawAmountAfterFees,
          token_amount: incentiveTokenAmountAfterFees,
          protocol_fee_raw_amount: protocolFeeRawAmount,
          protocol_fee_token_amount: protocolFeeTokenAmount,
          frontend_fee_raw_amount: frontendFeeRawAmount,
          frontend_fee_token_amount: frontendFeeTokenAmount,
        });
      } else {
        incentivesInfoWithFees[incentiveIndex].raw_amount = BigNumber.from(
          incentivesInfoWithFees[incentiveIndex].raw_amount
        )
          .add(BigNumber.from(incentiveRawAmount))
          .toString();
        incentivesInfoWithFees[incentiveIndex].token_amount = BigNumber.from(
          incentivesInfoWithFees[incentiveIndex].token_amount
        ).toString();
        incentivesInfoWithFees[incentiveIndex].protocol_fee_raw_amount =
          BigNumber.from(
            incentivesInfoWithFees[incentiveIndex].protocol_fee_raw_amount
          )
            .add(BigNumber.from(protocolFeeRawAmount))
            .toString();
        incentivesInfoWithFees[incentiveIndex].protocol_fee_token_amount =
          BigNumber.from(
            incentivesInfoWithFees[incentiveIndex].protocol_fee_token_amount
          ).toString();
        incentivesInfoWithFees[incentiveIndex].frontend_fee_raw_amount =
          BigNumber.from(
            incentivesInfoWithFees[incentiveIndex].frontend_fee_raw_amount
          )
            .add(BigNumber.from(frontendFeeRawAmount))
            .toString();
        incentivesInfoWithFees[incentiveIndex].frontend_fee_token_amount =
          BigNumber.from(
            incentivesInfoWithFees[incentiveIndex].frontend_fee_token_amount
          ).toString();
      }
    }

    return {
      status: "success",
      data: incentivesInfoWithFees,
    };
  } catch (error) {
    return {
      status: "error",
      data: [],
    };
  }
};

export const getApprovalTxOptions = ({
  tokensData,
  approvalAddress,
}: {
  tokensData: Array<SupportedToken>;
  approvalAddress: string;
}) => {
  try {
    let approvalTxOptions: TransactionOptionsType[] = [];

    for (let i = 0; i < tokensData.length; i++) {
      const tokenData = tokensData[i];

      let ref = `approve:${tokenData.contract_address}`;

      let approveOptions = {
        ref: ref,
        id: MarketTransactionType.approve_tokens.id,
        title: `Approve ${tokenData.symbol.toUpperCase()}`,
        label: `Approve`,
        address: tokenData.contract_address,
        abi: erc20Abi,
        functionName: "approve",
        args: [approvalAddress, ethers.constants.MaxUint256.toString()],
        status: "idle",
        txHash: null,
      };

      const refIndex = approvalTxOptions.findIndex((opt) => opt.ref === ref);

      if (refIndex === -1) {
        approvalTxOptions.push(approveOptions);
      }
    }

    return approvalTxOptions;
  } catch (error) {
    return [];
  }
};

export const getOfferTxOptions = ({
  id,
  offerContract,
}: {
  id: TypedRoycoTransactionType;
  offerContract: {
    address: string;
    abi: any;
  };
}) => {
  try {
    let offerTxOptions: any[] = [];
  } catch (error) {
    return [];
  }
};

export const useCreateOfferRecipe = ({
  chainId = 0,
  targetMarketId,
  fundingVault = NULL_ADDRESS,
  quantity,
  expiry = "0",
  incentiveTokens = [],
  incentiveTokensAmount = [],
  userType,
  offerType,
  account,
  enabled = true,
}: {
  chainId: number;
  targetMarketId: string;
  fundingVault?: string;
  quantity: string;
  expiry?: string;
  incentiveTokens?: string[];
  incentiveTokensAmount?: string[];
  userType: TypedRoycoMarketUserType;
  offerType: TypedRoycoMarketOfferType;
  account?: string;
  enabled?: boolean;
}) => {
  const propsEnrichedMarket = useEnrichedMarket({
    chain_id: chainId,
    market_type: RoycoMarketType.recipe.value,
    market_id: targetMarketId,
  });
  const propsReadProtocolFeeRecipe = useReadProtocolFeeRecipe({
    chain_id: chainId,
  });

  const chain = getSupportedChain(chainId);
  const offerContract =
    ContractMap[chainId as keyof typeof ContractMap].RecipeMarketHub ??
    undefined;
  const offerInterface = new ethers.utils.Interface(offerContract.abi);

  let isReady = false;
  let fulfillableQuantity = BigNumber.from(0).toString();
  let writeContractOptions: any[] = [];

  // Store all the options for the contract calls
  let approveContractOptions: TransactionOptionsType[] = [];
  let offerContractOptions: TransactionOptionsType[] = [];

  // Store all the data for incentives
  let incentivesInfo: Array<GetIncentivesInfoRecipeDataElement> = [];
  let enrichedIncentivesInfo: Array<
    GetIncentivesInfoRecipeDataElement & {
      token_amount_usd: number;
    }
  > = [];

  let tokensInvolved: Array<
    SupportedToken & { raw_amount: string; token_amount: string }
  > = [];

  const isValid = checkOfferValidityRecipe({
    chainId,
    targetMarketId,
    fundingVault,
    quantity,
    expiry,
    incentiveTokens,
    incentiveTokensAmount,
    userType,
    offerType,
  });

  // Fetch Market Offers to Fill
  const propsMarketOffersRecipe = useMarketOffersRecipe({
    chain_id: chainId,
    market_id: targetMarketId,
    offer_side: userType === RoycoMarketUserType.ap.id ? 1 : 0,
    quantity: Number(quantity),
    enabled:
      isValid === true && offerType === RoycoMarketOfferType.market.id
        ? true
        : false,
  });

  // Market Offer
  if (
    enabled &&
    !!chain &&
    offerType === RoycoMarketOfferType.market.id &&
    !!propsEnrichedMarket.data &&
    !!propsMarketOffersRecipe.data
  ) {
    // Check how much market offer can be filled
    const totalFulfullableQuantity = propsMarketOffersRecipe.data.reduce(
      (acc, offer) =>
        BigNumber.from(acc).add(
          BigNumber.from(
            offer.fill_quantity.toLocaleString("fullwide", {
              useGrouping: false,
            })
          )
        ),
      BigNumber.from(0)
    );
    fulfillableQuantity = totalFulfullableQuantity.toString();

    // incentives calculation starts
    const incentiveIds = propsMarketOffersRecipe.data.flatMap(
      (offer) => offer.token_ids
    );
    const incentiveRawAmounts = propsMarketOffersRecipe.data.flatMap((offer) =>
      offer.token_amounts.map((amount) =>
        BigNumber.from(
          amount.toLocaleString("fullwide", { useGrouping: false })
        )
          .mul(
            offer.fill_quantity.toLocaleString("fullwide", {
              useGrouping: false,
            })
          )
          .div(
            offer.quantity.toLocaleString("fullwide", {
              useGrouping: false,
            })
          )
          .toString()
      )
    );

    incentivesInfo = getIncentivesInfoRecipe({
      inputTokenId: propsEnrichedMarket.data.input_token_data.id,
      inputTokenRawAmount: quantity,
      incentiveIds: incentiveIds,
      incentiveRawAmounts: incentiveRawAmounts,
      rewardStyleValue: propsEnrichedMarket.data.reward_style ?? 0,
      lockupTime: propsEnrichedMarket.data.lockup_time?.toString() ?? "0",
    }).data;

    const incentivesInfoWithFees = getIncentivesInfoWithFees({
      incentiveIds,
      incentiveRawAmounts,
      protocolFee: propsReadProtocolFeeRecipe.data as string,
      frontendFee: BigNumber.from(
        propsEnrichedMarket.data.frontend_fee?.toString()
      ).toString(),
    }).data;
    // incentives calculation ends

    if (userType === RoycoMarketUserType.ap.id) {
      // Supply (AP)

      // Set Tokens Involved
      tokensInvolved = [
        {
          ...getSupportedToken(propsEnrichedMarket.data.input_token_data.id),
          raw_amount: quantity,
          token_amount: BigNumber.from(quantity)
            .div(
              BigNumber.from(10).pow(
                propsEnrichedMarket.data.input_token_data.decimals
              )
            )
            .toString(),
        },
      ];

      // preparting contract data
      const offerIds = propsMarketOffersRecipe.data.map(
        (offer) => offer.offer_id
      );
      const fillAmounts = propsMarketOffersRecipe.data.map((offer) =>
        BigNumber.from(
          offer.fill_quantity.toLocaleString("fullwide", {
            useGrouping: false,
          })
        ).toString()
      );
      const frontendFeeRecipient = "0x77777Cc68b333a2256B436D675E8D257699Aa667";

      const ref = `${RoycoTransactionType.fill_ap_offers.id}`;

      const offerTxOptions = {
        ref: ref,
        id: RoycoTransactionType.fill_ip_offers.id,
        title: `Fill IP Offers`,
        label: `Fill Offers`,
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "fillIPOffers",
        args: [offerIds, fillAmounts, fundingVault, frontendFeeRecipient],
        status: "idle",
        txHash: null,
      };

      offerContractOptions = [offerTxOptions];
    } else {
      // Withdraw (IP)
      tokensInvolved = incentivesInfoWithFees;

      // preparting contract data
      const offers = propsMarketOffersRecipe.data.map((offer) => {
        return {
          offerID: offer.offer_id,
          targetMarketID: targetMarketId,
          ap: offer.creator,
          fundingVault: fundingVault,
          quantity: offer.quantity,
          expiry: offer.expiry,
          incentivesRequested: offer.token_ids.map((token) => {
            const [chainId, tokenAddress] = token.split("-");
            return tokenAddress;
          }),
          incentiveAmountsRequested: offer.token_amounts.map((amount) =>
            BigNumber.from(
              amount.toLocaleString("fullwide", { useGrouping: false })
            ).toString()
          ),
        };
      });
      const fillAmounts = propsMarketOffersRecipe.data.map((offer) =>
        BigNumber.from(
          offer.fill_quantity.toLocaleString("fullwide", {
            useGrouping: false,
          })
        ).toString()
      );
      const frontendFeeRecipient = "0x77777Cc68b333a2256B436D675E8D257699Aa667";

      const ref = `${RoycoTransactionType.fill_ap_offers.id}`;

      const offerTxOptions = {
        ref: ref,
        id: RoycoTransactionType.fill_ap_offers.id,
        title: `Fill AP Offers`,
        label: `Fill Offers`,
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "fillAPOffers",
        args: [offers, fillAmounts, frontendFeeRecipient],
        status: "idle",
        txHash: null,
      };

      offerContractOptions = [offerTxOptions];
    }
  }

  // Limit Offer
  if (
    enabled &&
    offerType === RoycoMarketOfferType.limit.id &&
    !propsEnrichedMarket.isLoading &&
    !!propsEnrichedMarket.data &&
    !propsReadProtocolFeeRecipe.isLoading &&
    !!propsReadProtocolFeeRecipe.data
  ) {
    // incentives calculation starts
    let incentiveIds = incentiveTokens.map((tokenAddress) => {
      return `${chainId}-${tokenAddress}`;
    });
    let incentiveRawAmounts = incentiveTokensAmount;

    incentivesInfo = getIncentivesInfoRecipe({
      inputTokenId: propsEnrichedMarket.data.input_token_data.id,
      inputTokenRawAmount: quantity,
      incentiveIds: incentiveIds,
      incentiveRawAmounts: incentiveRawAmounts,
      rewardStyleValue: propsEnrichedMarket.data.reward_style ?? 0,
      lockupTime: propsEnrichedMarket.data.lockup_time?.toString() ?? "0",
    }).data;

    const incentivesInfoWithFees = getIncentivesInfoWithFees({
      incentiveIds,
      incentiveRawAmounts,
      protocolFee: propsReadProtocolFeeRecipe.data as string,
      frontendFee: BigNumber.from(
        propsEnrichedMarket.data.frontend_fee?.toString()
      ).toString(),
    }).data;
    // incentives calculation ends

    // Limit Offer can always be fulfilled completely
    fulfillableQuantity = quantity;

    if (userType === RoycoMarketUserType.ap.id) {
      // Supply (AP)
      tokensInvolved = [
        {
          ...getSupportedToken(propsEnrichedMarket.data.input_token_data.id),
          contract_address:
            propsEnrichedMarket.data.input_token_data.contract_address,
          raw_amount: quantity,
          token_amount: BigNumber.from(quantity)
            .div(
              BigNumber.from(10).pow(
                propsEnrichedMarket.data.input_token_data.decimals
              )
            )
            .toString(),
        },
      ];

      const offerOptions = {
        ref: `${RoycoTransactionType.create_ap_offer.id}`,
        id: RoycoTransactionType.create_ap_offer.id,
        title: `Create AP Offer`,
        label: `Create`,
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "createAPOffer",
        args: [
          targetMarketId,
          fundingVault,
          quantity,
          expiry,
          incentiveTokens,
          incentiveTokensAmount,
        ],
        status: "idle",
        txHash: null,
      };

      offerContractOptions = [offerOptions];
    } else {
      // Withdraw (IP)
      tokensInvolved = incentivesInfoWithFees;

      const offerOptions = {
        ref: `${RoycoTransactionType.create_ip_offer.id}`,
        id: RoycoTransactionType.create_ip_offer.id,
        title: `Create IP Offer`,
        label: `Create`,
        address: offerContract.address,
        abi: offerContract.abi,
        functionName: "createIPOffer",
        args: [
          targetMarketId,
          quantity,
          expiry,
          incentiveTokens,
          incentiveTokensAmount,
        ],
        status: "idle",
        txHash: null,
        tokensOut: tokensInvolved,
      };

      offerContractOptions = [offerOptions];
    }
  }

  const propsTokenQuotes = useTokenQuotes({
    token_ids: [
      propsEnrichedMarket.data?.input_token_data?.id ?? "",
      ...incentivesInfo.map((incentive) => incentive.id),
    ],
  });

  const propsTokenAllowance = useTokenAllowance({
    chain_id: chainId,
    account: account ? (account as Address) : NULL_ADDRESS,
    spender: offerContract?.address ?? NULL_ADDRESS,
    tokens:
      tokensInvolved?.map((token) => token.contract_address as Address) ?? [],
  });

  // Approve Tokens and Refine Data
  if (
    !!chain &&
    isValid === true &&
    tokensInvolved.length !== 0 &&
    !propsTokenAllowance.isLoading &&
    !!propsTokenAllowance.data &&
    !propsTokenQuotes.isLoading &&
    !!propsTokenQuotes.data &&
    !!propsEnrichedMarket.data
  ) {
    const quoteData = propsTokenQuotes.data;
    const allowanceData = propsTokenAllowance.data;

    approveContractOptions = getApprovalTxOptions({
      tokensData: tokensInvolved,
      approvalAddress: offerContract.address,
    });

    for (let i = 0; i < tokensInvolved.length; i++) {
      const allowanceRequired = BigNumber.from(tokensInvolved[i].raw_amount);
      const allowanceGiven = BigNumber.from(allowanceData[i]?.result ?? "0");

      if (allowanceGiven.gte(allowanceRequired)) {
        approveContractOptions[i].status = "success";
      }
    }

    writeContractOptions = [...approveContractOptions, ...offerContractOptions];

    // update enriched incentives info with token amount usd
    enrichedIncentivesInfo = incentivesInfo.map((incentive) => {
      const inputTokenId = propsEnrichedMarket.data
        ? propsEnrichedMarket.data.input_token_data.id
        : "";

      // console.log("inputTokenId", inputTokenId);
      // console.log("quoteData", quoteData);

      let tokenData = quoteData.find(
        (quote) => quote.token_id === incentive.id
      );

      let inputTokenData = quoteData.find(
        (quote) => quote.token_id === inputTokenId
      );

      if (!inputTokenData) {
        inputTokenData = {
          ...getSupportedToken(inputTokenId),
          token_id: inputTokenId,
          price: 0,
          total_supply: 0,
          fdv: 1,
        };
      }

      if (!tokenData) {
        tokenData = {
          ...getSupportedToken(incentive.id),
          token_id: incentive.id,
          price: 0,
          total_supply: 0,
          fdv: 1,
        };
      }

      const token_amount_usd =
        parseFloat(incentive.token_amount) * tokenData.price;

      const change_ratio =
        inputTokenData.price !== 0
          ? (incentive.per_input_token * tokenData.price) / inputTokenData.price
          : 0;

      let annual_change_ratio = 0;

      let lockupTime =
        propsEnrichedMarket.data && propsEnrichedMarket.data.lockup_time
          ? propsEnrichedMarket.data.lockup_time
          : 0;

      const rewardStyle =
        propsEnrichedMarket.data && propsEnrichedMarket.data.reward_style
          ? propsEnrichedMarket.data.reward_style
          : 0;

      if (rewardStyle === 0 || lockupTime === 0) {
        lockupTime = 31536000;
      }

      annual_change_ratio = (change_ratio * lockupTime) / 31536000;

      return {
        ...incentive,
        token_amount_usd,
        change_ratio,
        annual_change_ratio,
      };
    });
  } else {
    writeContractOptions = [];
  }

  if (isValid === true && writeContractOptions.length !== 0) {
    isReady = true;
  } else {
    isReady = false;
  }

  const isLoading =
    propsEnrichedMarket.isLoading ||
    propsReadProtocolFeeRecipe.isLoading ||
    propsMarketOffersRecipe.isLoading ||
    propsTokenAllowance.isLoading;

  return {
    isLoading,
    isValid,
    isReady,
    writeContractOptions,
    fulfillableQuantity,
    incentivesInfo,
    enrichedIncentivesInfo,
  };
};
