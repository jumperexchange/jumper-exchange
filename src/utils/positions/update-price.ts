import type { DefiToken, WalletPositions } from '@/types/jumper-backend';
import { formatTokenPrice } from '@lifi/widget';
import { sumBy } from 'lodash';
import { isAppDefiPosition, type DefiPosition } from './type-guards';

export type GetTokenUSDPrice = (token: {
  chainId: number;
  address: string;
}) => undefined | number | Promise<number | undefined>;

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

  const amountUSD = formatTokenPrice(
    BigInt(token.amount),
    `${priceUSD}`,
    token.decimals,
  );

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
  if (isAppDefiPosition(position)) {
    return position;
  }

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
  const positions = wallet.data;
  const updatedPositions = await Promise.all(
    positions.map((position) =>
      updatePositionPrice(position, getTokenUSDPrice),
    ),
  );

  return {
    ...wallet,
    data: updatedPositions,
  };
};
