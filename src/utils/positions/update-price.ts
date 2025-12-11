import type {
  DefiPosition,
  DefiToken,
  WalletPositions,
} from '@/types/jumper-backend';
import { sumBy } from 'lodash';

export type GetTokenUSDPrice = (token: {
  chainId: number;
  address: string;
}) => undefined | number | Promise<number | undefined>;

// TODO: this function is probably somewhere in the codebase already
const amountToUSD = (
  amount: bigint,
  decimals: number | string | bigint,
  usdPricePerOne: number,
): number => {
  const base = 10n ** BigInt(decimals);
  const whole = amount / base;
  const remainder = amount % base;

  const wholeUSD = Number(whole) * usdPricePerOne;
  const remainderUSD = (Number(remainder) / Number(base)) * usdPricePerOne;

  return wholeUSD + remainderUSD;
};

const updateTokenPrice = async (
  token: DefiToken,
  getTokenUSDPrice: GetTokenUSDPrice,
): Promise<DefiToken> => {
  const priceUSD = await getTokenUSDPrice({
    chainId: token.chain.chainId,
    address: token.address,
  });

  if (!priceUSD) {
    return token;
  }

  const amountUSD = amountToUSD(BigInt(token.amount), token.decimals, priceUSD);

  return {
    ...token,
    amountUSD,
    priceUSD,
  };
};

const updateTokensPrice = async (
  tokens: DefiToken[],
  getTokenUSDPrice: GetTokenUSDPrice,
): Promise<DefiToken[]> => {
  return Promise.all(
    tokens.map(async (token) => updateTokenPrice(token, getTokenUSDPrice)),
  );
};

export const updatePositionPrice = async (
  position: DefiPosition,
  getTokenUSDPrice: GetTokenUSDPrice,
): Promise<DefiPosition> => {
  const [
    supplyTokens,
    borrowTokens,
    assetTokens,
    collateralTokens,
    rewardTokens,
  ] = await Promise.all([
    updateTokensPrice(position.supplyTokens, getTokenUSDPrice),
    updateTokensPrice(position.borrowTokens, getTokenUSDPrice),
    updateTokensPrice(position.assetTokens, getTokenUSDPrice),
    updateTokensPrice(position.collateralTokens, getTokenUSDPrice),
    updateTokensPrice(position.rewardTokens, getTokenUSDPrice),
  ]);

  const assetUsd =
    sumBy(supplyTokens, 'amountUSD') +
    sumBy(assetTokens, 'amountUSD') +
    sumBy(rewardTokens, 'amountUSD') +
    sumBy(collateralTokens, 'amountUSD');
  const debtUsd = sumBy(borrowTokens, 'amountUSD');
  const netUsd = assetUsd - debtUsd;

  return {
    ...position,
    supplyTokens,
    borrowTokens,
    assetTokens,
    collateralTokens,
    rewardTokens,
    assetUsd,
    debtUsd,
    netUsd,
  };
};

export const updateWalletPositionsPrice = async (
  wallet: WalletPositions,
  getTokenUSDPrice: GetTokenUSDPrice,
): Promise<WalletPositions> => {
  return {
    ...wallet,
    positions: await Promise.all(
      wallet.positions.map((position) =>
        updatePositionPrice(position, getTokenUSDPrice),
      ),
    ),
  };
};
