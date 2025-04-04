import type { EnrichedMarketDataType } from 'royco/queries';
import type { Quest } from '@/types/loyaltyPass';
import type { CustomTokenData } from 'royco/types';
import type { SupportedToken } from 'royco/constants';
import { getSupportedToken } from 'royco/constants';
import { sumBy } from 'lodash';

export function calculateTVLGoal(market: EnrichedMarketDataType) {
  return (
    (1 -
      (market.quantity_ip_usd ?? 0) /
        ((market.quantity_ip_usd ?? 0) + (market.locked_quantity_usd ?? 0))) *
    100
  );
}

export function getFullTitle(
  roycoData: EnrichedMarketDataType,
  strapiData?: Quest,
) {
  return `${roycoData?.input_token_data?.symbol} ${strapiData?.Title} Market`;
}

export function includesCaseInsensitive(str: string, searchString: string) {
  return new RegExp(searchString, 'i').test(str);
}

export function titleSlicer(str: string, maxLength: number = 7) {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

export function divideBy(num: number, by: number = 100) {
  return num / by;
}

export function aprCalculation(lockedQuantityUsd: number, totalTVL: number) {
  if (!lockedQuantityUsd || !totalTVL) {
    return;
  }

  const BOYCO_TOTAL = 0.02 * 2000000000;
  const TVL_MARKET_SHARE = (lockedQuantityUsd ?? 0) / (totalTVL ?? 1);
  const TOTAL_REWARDS = TVL_MARKET_SHARE * BOYCO_TOTAL;
  const LOCKUP_IN_DAYS = 70;
  const APR =
    (TOTAL_REWARDS * (365 / LOCKUP_IN_DAYS)) / (lockedQuantityUsd ?? 0);

  return APR;
}

export const BERA_TOKEN_ID = '1-0xbe9abe9abe9abe9abe9abe9abe9abe9abe9abe9a';

export const DEFAULT_BERA_TOKEN_DATA = {
  fdv: 0,
  total_supply: 0,
};

export const calculateBeraYield = ({
  enrichedMarket,
  customTokenData,
  markets,
}: {
  enrichedMarket: EnrichedMarketDataType;
  customTokenData: CustomTokenData;
  markets: EnrichedMarketDataType[];
}) => {
  let annual_change_ratio = 0;

  try {
    const beraTokenData = customTokenData.find(
      (token) => token.token_id === BERA_TOKEN_ID,
    );

    let bera_fdv = DEFAULT_BERA_TOKEN_DATA.fdv;
    let bera_total_supply = DEFAULT_BERA_TOKEN_DATA.total_supply;

    if (
      !!beraTokenData &&
      !!beraTokenData.fdv &&
      !!beraTokenData.total_supply
    ) {
      bera_fdv = Number(beraTokenData.fdv);
      bera_total_supply = Number(beraTokenData.total_supply);
    }

    let bera_price = bera_fdv / bera_total_supply;

    if (bera_total_supply === 0 || isNaN(bera_price)) {
      bera_price = 0;
    }

    const market = enrichedMarket;
    const beraInfo = {
      beraFDV: bera_fdv,
      beraSupply: bera_total_supply,
    };
    const assetType = getMarketAssetType(enrichedMarket.input_token_data);
    const buckets = getBuckets(markets);

    const bera_annual_change_ratio = getBeraApy(
      market,
      beraInfo,
      assetType,
      buckets,
    );

    if (!isNaN(bera_annual_change_ratio)) {
      annual_change_ratio = bera_annual_change_ratio;
    }
  } catch (error) {}

  return annual_change_ratio;
};

type BeraYieldContextType = {
  buckets: BeraBuckets | undefined;
  beraInfo: BeraInfoContextType;
  setBeraInfo: (beraInfo: BeraInfoContextType) => void;
};

export type BeraBuckets = {
  majorBucketWeight: number;
  thirdPartyBucketWeight: number;
};

export type BeraInfoContextType = {
  beraFDV: number;
  beraSupply: number;
};

/**
 * Calculates the Annual Percentage Yield (APY) for BERA token rewards in a given market
 *
 * @param {EnrichedMarketDataType} market - The market data containing TVL, lockup time, and token information
 * @param {BeraInfoContextType} beraInfo - Context containing BERA token information including FDV and supply
 * @param {Function} getBucketWeight - Function that returns the weight for a given asset type bucket
 * @returns {number} The calculated APY for BERA rewards, returns 0 if market TVL is not available
 *
 * @description
 * This function calculates the BERA APY based on several factors:
 * - Market TVL and multiplier
 * - BERA price derived from FDV and supply
 * - Lockup period of the market
 * - Asset type bucket weights
 * - BERA supply allocation on Boyco
 *
 * The calculation takes into account:
 * 1. Market TVL adjusted by multiplier
 * 2. Asset type bucket weight (Major vs Other)
 * 3. BERA supply distribution
 * 4. Rebase incentives based on market weight
 * 5. Annualization based on lockup period
 */
export const getBeraApy = (
  market: EnrichedMarketDataType,
  beraInfo: BeraInfoContextType,
  assetType: MULTIPLIER_ASSET_TYPE,
  buckets: BeraBuckets,
) => {
  const multiplier = +getMarketMultiplier(market);

  const marketTVL = market.total_value_locked;
  if (!marketTVL) {
    return 0;
  }

  const beraPrice = beraInfo.beraFDV / beraInfo.beraSupply;

  const lockupTime =
    Number(market.lockup_time) === 0 ? 7776000 : Number(market.lockup_time);
  const lockupPeriod = lockupTime * 1000;
  const year = 31536000000; // 365 days * 24 hours * 60 minutes * 60 seconds * 1000 milliseconds

  const marketTVLMultiplied = marketTVL * multiplier;

  const marketTypeBucketWeight =
    assetType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY
      ? buckets.majorBucketWeight
      : buckets.thirdPartyBucketWeight;

  const weightOfBucketOnBoyco =
    assetType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY ? 0.55 : 0.45;
  const beraSupplyOnBoyco = 10000000;

  const currentMarketWeight = marketTVLMultiplied / marketTypeBucketWeight;
  //   console.log("BERA APY-Market weight", currentMarketWeight);

  const beraSupplyInBucket =
    beraSupplyOnBoyco * beraPrice * weightOfBucketOnBoyco;
  //   console.log("BERA APY-Bera supply on boyco multiplied", beraSupplyInBucket);

  const rebaseIncentives = currentMarketWeight * beraSupplyInBucket;
  //   console.log("BERA APY-Rebase incentives", rebaseIncentives);

  const rebasedIncentiveOnMarketTVL = rebaseIncentives / marketTVL;
  //   console.log(
  //     "BERA APY-Rebased incentive for market TVL",
  //     rebasedIncentiveOnMarketTVL
  //   );

  const missingPeriod = year / lockupPeriod;
  //   console.log("BERA APY-Missing period", missingPeriod);

  const beraApy = rebasedIncentiveOnMarketTVL * missingPeriod;

  //   console.log("BERA APY", beraApy);

  return beraApy;
};

export const getBuckets = (markets: EnrichedMarketDataType[]) => {
  const MajorMarkets = markets.filter(
    (market) =>
      getMarketAssetType(market.input_token_data) ===
      MULTIPLIER_ASSET_TYPE.MAJOR_ONLY,
  );
  const ThirdPartyMarkets = markets.filter(
    (market) =>
      getMarketAssetType(market.input_token_data) ===
      MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY,
  );

  const majorBucketWeight = sumBy(MajorMarkets, (market) => {
    const tvl = market.locked_quantity_usd ?? 0;
    const multiplier = +getMarketMultiplier(market);
    return tvl * multiplier;
  });

  const thirdPartyBucketWeight = sumBy(ThirdPartyMarkets, (market) => {
    const tvl = market.locked_quantity_usd ?? 0;
    const multiplier = +getMarketMultiplier(market);
    return tvl * multiplier;
  });

  return {
    majorBucketWeight,
    thirdPartyBucketWeight,
  };
};

// Use market input token to get the market type and the asset type in order to get the multiplier
export const getMarketMultiplier = (
  market: EnrichedMarketDataType,
): MULTIPLIERS => {
  const inputToken = market?.input_token_data;
  const foundMArket = overrideMarketMap.find(
    (ovrItem) => ovrItem.id === market.market_id,
  );

  if (!foundMArket) {
    console.error('Market not found in overrideMarketMap');
    return 1;
  }

  return foundMArket?.multiplier;
};

//   let multiplier = 1;

//   if (assetType === MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY) {
//     if (marketType === MULTIPLIER_MARKET_TYPE.SINGLE_SIDED) {
//       multiplier = MULTIPLIERS.SINGLE_TPO;
//     } else if (marketType === MULTIPLIER_MARKET_TYPE.STABLESWAP) {
//       multiplier = MULTIPLIERS.STABLE_TPO;
//     }
//   } else if (assetType === MULTIPLIER_ASSET_TYPE.HYBRID) {
//     multiplier = MULTIPLIERS.STABLE_HYBRID;
//   } else if (assetType === MULTIPLIER_ASSET_TYPE.MAJOR_ONLY) {
//     if (marketType === MULTIPLIER_MARKET_TYPE.SINGLE_SIDED) {
//       multiplier = MULTIPLIERS.SINGLE_MAJOR;
//     } else if (marketType === MULTIPLIER_MARKET_TYPE.STABLESWAP) {
//       multiplier = MULTIPLIERS.STABLE_MAJOR;
//     } else if (marketType === MULTIPLIER_MARKET_TYPE.VOLATILE) {
//       multiplier = MULTIPLIERS.VOLATILE_MAJOR;
//     }
//   }
// };

// Calculate the asset type of the market based on the input token
export const getMarketAssetType = (
  inputToken: SupportedToken & {
    token0?: string;
    token1?: string;
  },
) => {
  if (isMajor(inputToken)) {
    return MULTIPLIER_ASSET_TYPE.MAJOR_ONLY;
  } else if (isThirdParty(inputToken)) {
    return MULTIPLIER_ASSET_TYPE.THIRD_PARTY_ONLY;
  }
  return MULTIPLIER_ASSET_TYPE.HYBRID;
};

// Calculate the market type base on the native asset of the market
// from that get the underlying dApp behind that market and then calculate the market type
export const getMarketType = (market: EnrichedMarketDataType) => {
  const marketAppId = market?.incentive_ids?.[0];

  // should never happen
  if (!marketAppId) {
    console.error('Market type not found');
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  }

  const marketApp = getMarketDapp(marketAppId);

  if (marketApp === MULTIPLIER_MARKET_DAPP.BERABORROW) {
    if (
      getMarketAssetType(market.input_token_data) ===
      MULTIPLIER_ASSET_TYPE.MAJOR_ONLY
    ) {
      return MULTIPLIER_MARKET_TYPE.VOLATILE;
    } else {
      return MULTIPLIER_MARKET_TYPE.STABLESWAP;
    }
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.DOLOMITE) {
    return MULTIPLIER_MARKET_TYPE.SINGLE_SIDED;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.KODIAK) {
    if (market.input_token_data.type === 'lp') {
      const token0 = market.input_token_data.token0;
      const token1 = market.input_token_data.token1;
      const token0Data = getSupportedToken(token0);
      const token1Data = getSupportedToken(token1);
      const WBTC = getSupportedToken('WBTC');
      const WETH = getSupportedToken('WETH');
      const HONEY = getSupportedToken('HONEY');
      if (
        (WBTC.id === token0Data.id && HONEY.id === token1Data.id) ||
        (WETH.id === token0Data.id && HONEY.id === token1Data.id) ||
        (WBTC.id === token0Data.id && WETH.id === token1Data.id)
      ) {
        return MULTIPLIER_MARKET_TYPE.VOLATILE;
      } else {
        return MULTIPLIER_MARKET_TYPE.STABLESWAP;
      }
    }
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.BURR_BEAR) {
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.CONCRETE) {
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.VEDA_ETHER_FI) {
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.GOLDILocks) {
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.D2_FINANCE) {
    return MULTIPLIER_MARKET_TYPE.SINGLE_SIDED;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.DAHLIA) {
    return MULTIPLIER_MARKET_TYPE.SINGLE_SIDED;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.SAT_LAYER) {
    return MULTIPLIER_MARKET_TYPE.SINGLE_SIDED;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.ORIGAMI) {
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  } else if (marketApp === MULTIPLIER_MARKET_DAPP.THJ) {
    return MULTIPLIER_MARKET_TYPE.STABLESWAP;
    //   } else if (marketApp === MULTIPLIER_MARKET_DAPP.INFRARED) {
    //     return MULTIPLIER_MARKET_TYPE.STABLESWAP;
  }

  // should not reac here
  console.error('Market type not found');
  return MULTIPLIER_MARKET_TYPE.STABLESWAP;
};

// A market is considered major only if the input token is a major or
// if both of the underlying tokens of the LP are major
const isMajor = (
  inputToken: SupportedToken & {
    token0?: string;
    token1?: string;
  },
) => {
  function validate(
    inputToken: SupportedToken & {
      token0?: string;
      token1?: string;
    },
  ) {
    return !!MajorTokens.find((token) => token.id === inputToken.id);
  }

  if (inputToken.type !== 'lp') {
    return validate(inputToken);
  } else {
    const token0 = inputToken.token0;
    const token1 = inputToken.token1;
    const token0Data = getSupportedToken(token0);
    const token1Data = getSupportedToken(token1);
    return validate(token0Data) && validate(token1Data);
  }
};

// A market is considered third party only if the input token is a third party or
// if both of the underlying tokens of the LP are third party
const isThirdParty = (
  inputToken: SupportedToken & {
    token0?: string;
    token1?: string;
  },
) => {
  function validate(
    inputToken: SupportedToken & {
      token0?: string;
      token1?: string;
    },
  ) {
    return !isMajor(inputToken);
  }

  if (inputToken.type !== 'lp') {
    return validate(inputToken);
  } else {
    const token0 = inputToken.token0;
    const token1 = inputToken.token1;
    const token0Data = getSupportedToken(token0);
    const token1Data = getSupportedToken(token1);
    return validate(token0Data) && validate(token1Data);
  }
};

// Return the dApp of that market based on the native asset id
const getMarketDapp = (id: string) => {
  const dApp = dAppsPointsId.find((dapp) => dapp.id === id)?.dapp;
  if (!dApp) {
    console.error('market type error - dApp not resolved correctly');
  }
  return dApp;
};

// List of all the dApps that are supported in Boyco
export enum MULTIPLIER_MARKET_DAPP {
  BERABORROW = 'Beraborrow',
  DOLOMITE = 'Dolomite',
  KODIAK = 'Kodiak',
  BURR_BEAR = 'BurrBear',
  CONCRETE = 'Concrete',
  VEDA_ETHER_FI = 'Veda x Ether.Fi',
  GOLDILocks = 'Goldilocks',
  D2_FINANCE = 'D2 Finance',
  DAHLIA = 'Dahlia',
  SAT_LAYER = 'SatLayer',
  ORIGAMI = 'Origami',
  THJ = 'THJ',
  INFRARED = 'Infrared',
}

// List of all the multipliers that are supported in Boyco
export enum MULTIPLIERS {
  SINGLE_TPO = 1,
  SINGLE_MAJOR = 1.5,
  STABLE_MAJOR = 1.35,
  STABLE_TPO = 1.369,
  STABLE_HYBRID = 2.69,
  VOLATILE_MAJOR = 4.2,
}

// List of all the asset types that are supported in Boyco
export enum MULTIPLIER_ASSET_TYPE {
  THIRD_PARTY_ONLY = 'THIRD_PARTY_ONLY',
  MAJOR_ONLY = 'MAJOR_ONLY',
  HYBRID = 'HYBRID',
}

// List of all the market types that are supported in Boyco
export enum MULTIPLIER_MARKET_TYPE {
  SINGLE_SIDED = 'SINGLE_SIDED',
  STABLESWAP = 'STABLESWAP',
  VOLATILE = 'VOLATILE',
}

// List of all the major tokens that are supported in Boyco
const MajorTokens = [
  { name: 'USDC', id: '1-0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
  { name: 'USDT', id: '1-0xdac17f958d2ee523a2206206994597c13d831ec7' },
  //   { name: "HONEY", id: "1-" },
  { name: 'WBTC', id: '1-0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
  { name: 'WETH', id: '1-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
];

const overrideMarketMap: { id: string; multiplier: MULTIPLIERS }[] = [
  {
    id: '0x62bb6fb784e059f338340a9724b35ef2ef8fde5e65613e9fcaacd097d81dc67e',
    multiplier: 2.69,
  },
  {
    id: '0x2240151f263be555a4ef61476a5c111373e0efe8cd539f179b4b5850977e9d4e',
    multiplier: 1.369,
  },
  {
    id: '0xb32d047eb63b5c2af537c2e4df6a09c40a50b75aefd83a928600241a4666b087',
    multiplier: 1.369,
  },
  {
    id: '0xfe95d44ab171140b66fb5180e9de765578d9d2bfbdbb66307abb86ba05a59e93',
    multiplier: 1.369,
  },
  {
    id: '0x28b337bd45eda5e2fc596bfe22320bef0af9da85d4c770d0fd03ddf72428c00a',
    multiplier: 1.369,
  },
  {
    id: '0x4fa4a76aa8b93ccdddba0c20c336056803b7410fb375c9c9541e9c54fbfb2f9a',
    multiplier: 1.369,
  },
  {
    id: '0xc182b0267a6ca015c2d2a144ca19e1f6b36479675754914002e0613320ed8d9a',
    multiplier: 1.369,
  },
  {
    id: '0x897eec875e51d6c8b5339d6a9984a00acb0aa86f9d4ab4eddbb4a791bb0a88e9',
    multiplier: 1.369,
  },
  {
    id: '0xd77d3e3e075394a6c94a8c83dab114bb7266b96c5234e4a98476f41339029c30',
    multiplier: 1.369,
  },
  {
    id: '0xcdd60ed30d20f9edc3fac624bb623db32103658b6da678949ef53df16139b488',
    multiplier: 4.2,
  },
  {
    id: '0xf8663b3c0f78b4efae0422b163e86e79afa1ce90778885d93d53c9d4f6d5c3d8',
    multiplier: 4.2,
  },
  {
    id: '0x568d2509ec17c27426a9d55e58673160c937aeaedc0a3fcc7c63c5b7df495ec7',
    multiplier: 4.2,
  },
  {
    id: '0x54b4b37c355868591a91baed36a3c8083f6480ccb11145106d0dad912d7dffd2',
    multiplier: 1.369,
  },
  {
    id: '0xe92ebafbee7aa7a636ff62e04aa2ab9353f60ef72dcdcfdfcf48b67a7ad8ffc7',
    multiplier: 1.369,
  },
  {
    id: '0x88ee202388086447b8dc8403c5aa2cfbcdb52e749fd16af5c6a3c7bb614b17c9',
    multiplier: 1.369,
  },
  {
    id: '0xfef8ead03d79cf7cbe6f73c8d1136f8c84f6cf6ed9bc208719e7fcee807cb336',
    multiplier: 1.369,
  },
  {
    id: '0x6b3dfac03cea102e59d2d5711088f3001782e07239dcc90f274dd9762220c49a',
    multiplier: 1.369,
  },
  {
    id: '0x84790e638ddd7a59e64b8c239e96e29c2c6c155a9882a0c834b9ced016b7c999',
    multiplier: 1.369,
  },
  {
    id: '0xb9f307d83c78d09a134aac7713821aab8e1da2404b895db66f0975135dd5006e',
    multiplier: 1.369,
  },
  {
    id: '0x1e0a98a276ba873cfa427e247c7d0e438f604a54fcb36481063e1220af021faf',
    multiplier: 1.5,
  },
  {
    id: '0xa588ad19850cf2a111c3c727033da8e557abc94de70fce2d2b2f2f78140f15e5',
    multiplier: 1,
  },
  {
    id: '0x092c0c4d8d124fc29364e8cd8417198c4bbe335e3f6c4b1f79215a3457b4831a',
    multiplier: 1,
  },
  {
    id: '0xbe5cd829fcb3cdfe8224ad72fc3379198d38da26131c5b7ab6664c8f56a9730d',
    multiplier: 1,
  },
  {
    id: '0x42a09eccabf1080c40a24522e9e8adbee5a0ad907188c9b6e50ba26ba332eac3',
    multiplier: 1,
  },
  {
    id: '0xd10bdc88272e0958baa62a4ae2bfce1d8feed639a93e03c0aa5cec7adfbdf2c3',
    multiplier: 1,
  },
  {
    id: '0xb1d5ccc4388fe639f8d949061bc2de95ecb1efb11c5ceb93bdb71caab58c8aa3',
    multiplier: 1,
  },
  {
    id: '0x2a3a73ba927ec6bbf0e2e12e21a32e274a295389ce9d6ae2b32435d12c597c2c',
    multiplier: 1,
  },
  {
    id: '0xff917303af9337534eece4b88948d609980b66ca0b41875da782aec4858cade5',
    multiplier: 1,
  },
  {
    id: '0xb27f671bc0dd8773a25136253acd72150dd59e50e44dc8439e9dc5c84c2b19f6',
    multiplier: 1,
  },
  {
    id: '0x258ac521d801d5112a484ad1b82e6fd2efc24aba29e5cd3d56db83f4a173dc90',
    multiplier: 1,
  },
  {
    id: '0x5bac1cacdd36b3d95a7f9880a264f8481ab56d3d1a53993de084c6fa5febcc15',
    multiplier: 1,
  },
  {
    id: '0x0194c329e2b9712802c37d3f17502bcefce2e128933f24f4fe847dfc7e5e8965',
    multiplier: 1,
  },
  {
    id: '0x6306bfce6bff30ec4efcea193253c43e057f1474007d0d2a5a0c2938bd6a9b81',
    multiplier: 1,
  },
  {
    id: '0xc6887dddd833a3d585c7941cd31b0f8ff3ec5903d49cd5e7ac450b46532d3e79',
    multiplier: 1,
  },
  {
    id: '0x86a5077c6a9190cde78ec75b8888c46ed0a3d1289054127a955a2af544633cf3',
    multiplier: 1,
  },
  {
    id: '0x2dd74f8f8a8d7f27b2a82a6edce57b201f9b4a3c4780934caf99363115e48be6',
    multiplier: 1,
  },
  {
    id: '0xc90525132d909f992363102ebd6298d95b1f312acdb9421fd1f7ac0c0dd78d3f',
    multiplier: 1,
  },
  {
    id: '0x415f935bbb9bf1bdc1f49f2ca763d5b2406efbf9cc949836880dd5bbd054db95',
    multiplier: 1,
  },
  {
    id: '0xfa4917a871f9cf06d3d00be6678993888b3aac41c3da21edf32c3c9cf3978d70',
    multiplier: 2.69,
  },
  {
    id: '0xd70673b98af7096f575717d70fbf2fa935dd719926b55c0e011480678cdac563',
    multiplier: 1.369,
  },
  {
    id: '0xab689b5eac7541b8cc774f0ca3705a91b21660e8221fc7bd8e93c391fb5d690d',
    multiplier: 1.369,
  },
  {
    id: '0xcdb30c06ea11f3f5408bce5eefdb392dfe0008ef81af3a486bcfed891f9cc112',
    multiplier: 2.69,
  },
  {
    id: '0x3ef317447bd10825f0a053565f8474a460cfb22cda414ea30b671e304f0691b6',
    multiplier: 1.369,
  },
  {
    id: '0x568f3bb6ba4c6afe37899fda35bc315ae8167274685ea295e03cf20d471afd8b',
    multiplier: 2.69,
  },
  {
    id: '0x289dc2a22ebb4ef7404de9293b6718d9f81f0843e1af4cf9a9c51d2e757348d6',
    multiplier: 2.69,
  },
  {
    id: '0x290aad1fabd8d2557d28a3854a2433ddc11a35f0d12936dd99102067ac515d07',
    multiplier: 2.69,
  },
  {
    id: '0x378d4d32d89450978d01cfdf1ff1907d4419aa186c48abb94e612b76d75f3fae',
    multiplier: 1.369,
  },
  {
    id: '0xa74b61544834483b093531cff533d01788a5dea12d8a83902646111025303bfb',
    multiplier: 2.69,
  },
  {
    id: '0xaa636d73f39ea0de0e04ed9270eac5d943707e7f8fb9c3480c0d80eb015ccfc8',
    multiplier: 1.369,
  },
  {
    id: '0x2fa37184f43783f5d6b23548c4a7a21bb86cd2f314bba9d5bb7d2415d61d11c8',
    multiplier: 1.369,
  },
  {
    id: '0x49104b3cadbb31470e5b949c6892a33954ee9ce35041df4a04a88eb694b645c0',
    multiplier: 2.69,
  },
  {
    id: '0x9b60d30f266858fa671bf268796aa503700310e31a8f46ebaa8f8281fbad89aa',
    multiplier: 2.69,
  },
  {
    id: '0x21c6a0baa6f41b060937be5a4f1be096b63f426c50f763b4dabd1af46803fa2f',
    multiplier: 1.369,
  },
  {
    id: '0xc5165360e2e8b195cb55e21cf259ce6a5ee996b055057d8705851d9b01fc8620',
    multiplier: 1.369,
  },
  {
    id: '0xab27dc8061f66791bb94a536546b08ba15e06344dabad2cc6267cf44f0070574',
    multiplier: 1.369,
  },
  {
    id: '0xd6e9ff1fa0c9c6bb25cafcb76c61c0d398a479ba073509e10209271f40a01712',
    multiplier: 2.69,
  },
  {
    id: '0x25f7a422282a1f26d9d96b5d1c43fa5c6f8c355b0ed7a4755ac8d04a504817f5',
    multiplier: 1.369,
  },
  {
    id: '0x460ec133419318efe4e05b4c3b6db421503fd6fcefbb20a43f50e3fc50f2ee39',
    multiplier: 1.369,
  },
  {
    id: '0x219169d9e78064768cddd0397c2202dc9e5c2bc0e1dbc13465363b0458d33c34',
    multiplier: 1.369,
  },
  {
    id: '0x71cee3cf3329e9a2803d578cdd6c823d7a16aa39adea3a7053395299bd258800',
    multiplier: 1.35,
  },
  {
    id: '0x5043bfe3f6bab5fa4c8f19fb2f6856de2d2e717a541e0d7126b308926be04e2e',
    multiplier: 2.69,
  },
  {
    id: '0x3d7cf2bd0a04fd3c66a5fa334a399b3926efe0fc0450b8da49a5da29f2c36d7f',
    multiplier: 2.69,
  },
  {
    id: '0xa31a8bb230f77a5d286985b92fe8d0c7504a1892568d70685659f781aec78209',
    multiplier: 2.69,
  },
  {
    id: '0xece925dbccbb21333dbe99679fef655ad2dc2cb185e0963711c944e302595b28',
    multiplier: 2.69,
  },
  {
    id: '0x72679855f582a6d908bf39d40cb5a299b6a98a82bf1bfd9055f1853fc5160f54',
    multiplier: 1.369,
  },
  {
    id: '0xbd3ef685577bdca03225bb2cd2158f0772cdfd694ba03b9eb4856b59a7288081',
    multiplier: 1.369,
  },
  {
    id: '0xab32e1695b84b148140cb78c044d247e307b26cb043dc5538657f3a5634dee6e',
    multiplier: 1.369,
  },
  {
    id: '0x027987432679079fbbc990691d14dabe7f7780f51df6a1a53e7bd875b1f9581a',
    multiplier: 1.5,
  },
  {
    id: '0xb7b78119806fcb9bbc499131da16b52ce52cf4a1ceabfc59e4f2f6e6ef7046c0',
    multiplier: 1.5,
  },
  {
    id: '0x0964848864e96952ee2454ce58fc93b867f9b2d9a6b44216eec8b08726813d1b',
    multiplier: 1.5,
  },
  {
    id: '0x4dd921e829db80e73c56d888eeaf46a7934a3c4a2f7f78231dd4502f8eaa2558',
    multiplier: 1.5,
  },
  {
    id: '0x7e804adb4c426b81fbe1f005f92d8dee99f98b0502c3946ac5ad436b453c6435',
    multiplier: 1.5,
  },
  {
    id: '0x20ca89af1fd136d0ef9c4e3e74e8ab1943d28e6879206a3e180fd35e29fb2d7d',
    multiplier: 1.5,
  },
  {
    id: '0x0484203315d701daff0d6dbdd55c49c3f220c3c7b917892bed1badb8fdc0182e',
    multiplier: 2.69,
  },
  {
    id: '0xff0182973d5f1e9a64392c413caaa75f364f24632a7de0fdd1a31fe30517fdd2',
    multiplier: 2.69,
  },
  {
    id: '0xb36f14fd392b9a1d6c3fabedb9a62a63d2067ca0ebeb63bbc2c93b11cc8eb3a2',
    multiplier: 2.69,
  },
  {
    id: '0xabf4b2f17bc32faf4c3295b1347f36d21ec5629128d465b5569e600bf8d46c4f',
    multiplier: 2.69,
  },
  {
    id: '0xdd3f0e11d59726f2e63fc1b180abc94034dd3e0f4018b51371b73348d82b3769',
    multiplier: 1,
  },
  {
    id: '0x2dcd8ec59fe12b4cb802f5a26445f9684635c52139560f169a7c4d67da186c18',
    multiplier: 1,
  },
  {
    id: '0x7dadff589e53d9813969d0be6de99c033d140ec1d304e57a754797736656dcd5',
    multiplier: 1,
  },
  {
    id: '0xde894ab596c084e65d0123ab6fa66f95b0571091cd8ec7efbeabe4942e7c40cd',
    multiplier: 1,
  },
  {
    id: '0x7ccce28638cbb503d17e8d9290a97f18731199655ccde282da7b464f21361b79',
    multiplier: 1,
  },
  {
    id: '0x036d9e250c6dafef1dd361199181548f9990a00452abf5231cebe7a15f9e19bd',
    multiplier: 1,
  },
  {
    id: '0xa655556eb64a0fd18b9a3c80794ab370743bc431a4b2a6116fa97dcc7f741a2b',
    multiplier: 1.35,
  },
  {
    id: '0xaa449e0679bd82798c7896c6a031f2da55299e64c0b4bddd57ad440921c04628',
    multiplier: 1.35,
  },
  {
    id: '0x9778047cb8f3740866882a97a186dff42743bebb3ad8010edbf637ab0e37751f',
    multiplier: 1.5,
  },
  {
    id: '0x9c7bd5b59ebcb9a9e6787b9b174a98a69e27fa5a4fe98270b461a1b9b1b1aa3e',
    multiplier: 1.5,
  },
  {
    id: '0x0a7565b14941c6a3dde083fb7a857e27e12c55fa34f709c37586ec585dbe7f3f',
    multiplier: 1.5,
  },
  {
    id: '0xa6905c68ad66ea9ce966aa1662e1417df08be333ab8ec04507e0f0301d3a78e9',
    multiplier: 1.5,
  },
  {
    id: '0x17ffd16948c053cc184c005477548e559566879a0e2847e87ebd1111c602535c',
    multiplier: 4.2,
  },
  {
    id: '0x6262ac035c2284f5b5249a690a6fd81c35f1ecef501da089f25741a4492cf5f3',
    multiplier: 4.2,
  },
  {
    id: '0xab37ea8895eed81c4aa76d5dba64441756904b15e78f6ffa5183b0fc1563c1c5',
    multiplier: 4.2,
  },
  {
    id: '0x72bec627884d7bdf538f174bedd551e9eccf3995adc880f40972e2bab87df3b9',
    multiplier: 1.35,
  },
  {
    id: '0xf8f745f188ddb10c16724faee95583521191c3c69e15490fa53c1136b73c17d7',
    multiplier: 1.35,
  },
  {
    id: '0x5f7935e257b94aee6caf9bbe917d4cfad75e8bc3b231806769ca0935af8371e8',
    multiplier: 2.69,
  },
  {
    id: '0xad9ee12ea8b3dccf85934c2918bd4ad38ccf7bc8b43d5fcb6f298858aa4c9ca4',
    multiplier: 2.69,
  },
  {
    id: '0x9a117f13c7d5d2b4b18e444f72e6e77c010a1fd90cf21135be75669d66ad9428',
    multiplier: 2.69,
  },
  {
    id: '0xaf2a845c9d6007128b7aec375a4fcdee2b12bbaeb78caf928d3bd08e104417d6',
    multiplier: 2.69,
  },
  {
    id: '0x1997c604de34a71974228bca4a66f601427c48960b6e59ff7ebc8e34f43f3ecf',
    multiplier: 1.369,
  },
  {
    id: '0x7ecf55915abe3c24dc5d8365a8edabc8833f4efb8e7c027429c9528aed91ecb7',
    multiplier: 2.69,
  },
];

const dAppsPointsId = [
  {
    dapp: MULTIPLIER_MARKET_DAPP.KODIAK,
    id: '1-0x31dd27d7479b09f1c96aa94681845c0eb0026ef8',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.BERABORROW,
    id: '1-0xfbca1de031ac44e83850634c098f22137e4647e5',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.DOLOMITE,
    id: '1-0x460f8d9c78b1bde7da137ce75315bd15d34a369b',
  },
  //   {
  //     dapp: "Dolomite",
  //     id: "1-d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1d1",
  //   },
  {
    dapp: MULTIPLIER_MARKET_DAPP.BURR_BEAR,
    id: '1-0xac672544ff301415547ac98558ca2988a26b9cbd',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.CONCRETE,
    id: '1-0x5f979f9f7024b41c325a7a39c89cd65e5f6a5f6d',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.GOLDILocks,
    id: '1-0x3b7795688ea8c095600bae9d6d866d04c230ba16',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.D2_FINANCE,
    id: '1-0x6a8b97bd31394075cb6dbd88dbb65808575b1a48',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.DAHLIA,
    id: '1-0xbd1e5b7fa18f2679070c8ba9ab6415ef786720cc',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.SAT_LAYER,
    id: '1-0x9c80538ffcbaee0db71caabe87ee99785ffc4f55',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.ORIGAMI,
    id: '1-0xcffe9112bfa141ae9170be4d172d40a455662564',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.THJ,
    id: '1-0x325e05f22af5a3f7e2cb9b112e8f4d9b6c14b8b4',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.INFRARED,
    id: '1-0x3b2635c5d5cc5cee62b9084636f808c67da9988f',
  },
  {
    dapp: MULTIPLIER_MARKET_DAPP.VEDA_ETHER_FI,
    id: '1-0x3badc21d6bff9248ae4c3923093e04d505a52fef',
  },
];
