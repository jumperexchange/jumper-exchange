import { z } from 'zod';

/**
 * Schema for path segments (alphanumeric, hyphens, and underscores)
 */
export const pathSegmentSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9\-_]+$/,
    'Path segment must contain only alphanumeric characters, hyphens, and underscores',
  );

/**
 * Schema for chain IDs (numeric)
 */
export const chainIdSchema = z
  .string()
  .regex(/^\d+$/, 'Chain ID must be numeric');

/**
 * Schema for amounts (numeric with decimals)
 */
export const amountSchema = z
  .string()
  .regex(/^\d+(\.\d+)?$/, 'Amount must be a valid number');

/**
 * Schema for token addresses (supports both EVM and Solana formats)
 */
export const tokenAddressSchema = z.string().refine((value) => {
  // Check for Ethereum address format (0x...)
  if (value.startsWith('0x')) {
    return /^0x[a-fA-F0-9]{40}$/.test(value);
  }
  // Check for Solana address format (base58)
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value);
}, 'Invalid token address format. Must be either an Ethereum address (0x...) or a Solana address (base58)');

/**
 * Schema for theme options
 */
export const themeSchema = z
  .enum(['light', 'dark'])
  .optional()
  .default('light');

/**
 * Schema for chain names
 */
export const chainNameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9\s\-]+$/,
    'Chain name must contain only alphanumeric characters, spaces, and hyphens',
  );

/**
 * Schema for search parameters
 */
export const searchParamsSchema = z.object({
  amount: amountSchema.nullable(),
  fromToken: tokenAddressSchema.nullable(),
  fromChainId: chainIdSchema.nullable(),
  toToken: tokenAddressSchema.nullable(),
  toChainId: chainIdSchema.nullable(),
  highlighted: pathSegmentSchema.nullable(),
  theme: themeSchema,
  isSwap: z.enum(['true', 'false']).default('false'),
  amountUSD: amountSchema.nullable(),
  chainName: chainNameSchema.nullable(),
});

export type ValidatedSearchParams = z.infer<typeof searchParamsSchema>;

/**
 * Helper function to sanitize chain names for URLs
 */
export function sanitizeChainName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-');
}
