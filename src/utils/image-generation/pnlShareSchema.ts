import { z } from 'zod';

/**
 * Unsigned USD amount, e.g. `980` or `120000`. Strips currency formatting
 * (`$`, thousands separators) before validating.
 */
const usdAmountSchema = z
  .string()
  .transform((val) => val.replace(/[^\d.]/g, ''))
  .refine((val) => /^\d+(\.\d+)?$/.test(val), 'Must be a valid number')
  .transform((val) => Number(val));

/**
 * Token symbol, e.g. `USDC`, `ETH`, `USDC.e`, `1INCH`.
 */
const tokenSymbolSchema = z
  .string()
  .trim()
  .min(1, 'Token symbol is required')
  .max(16, 'Token symbol is too long')
  .regex(
    /^[a-zA-Z0-9.\-]+$/,
    'Token symbol must contain only alphanumeric characters, "." and "-"',
  );

/**
 * Optional referral code (alphanumeric, hyphens and underscores).
 */
const referralCodeSchema = z
  .string()
  .trim()
  .max(64, 'Referral code is too long')
  .regex(
    /^[a-zA-Z0-9\-_]+$/,
    'Referral code must contain only alphanumeric characters, hyphens and underscores',
  )
  .optional();

/**
 * Schema for the "extra output" social share card (JUMADV-1).
 *
 * The card surfaces how much more value a user got on a swap versus the
 * median eligible quote on the same route.
 *
 * Example:
 * ```
 * /api/share-pnl?amountWon=980&swapSize=120000&fromToken=USDC&toToken=ETH&referralCode=ABC123
 * ```
 */
export const pnlShareSchema = z.object({
  amountWon: usdAmountSchema,
  swapSize: usdAmountSchema,
  fromToken: tokenSymbolSchema,
  toToken: tokenSymbolSchema,
  referralCode: referralCodeSchema,
});

export type PnlShareParams = z.infer<typeof pnlShareSchema>;

/**
 * Parse and validate the search params for the social share card route.
 * Throws when required params are missing or invalid.
 */
export function parsePnlShareParams(url: string): PnlShareParams {
  const searchParams = new URL(url).searchParams;

  const rawParams = {
    amountWon: searchParams.get('amountWon') ?? undefined,
    swapSize: searchParams.get('swapSize') ?? undefined,
    fromToken: searchParams.get('fromToken') ?? undefined,
    toToken: searchParams.get('toToken') ?? undefined,
    referralCode: searchParams.get('referralCode') ?? undefined,
  };

  const result = pnlShareSchema.safeParse(rawParams);
  if (!result.success) {
    console.error('Validation error:', result.error);
    throw new Error('Invalid parameters for the social share card');
  }

  return result.data;
}
