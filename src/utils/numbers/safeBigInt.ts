export const safeBigInt = (value: string | bigint): bigint => {
  try {
    return BigInt(value);
  } catch {
    return 0n;
  }
};
