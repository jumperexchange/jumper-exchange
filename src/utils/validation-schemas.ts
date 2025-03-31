import { z } from 'zod';
import { sanitizeAddress } from './image-generation/sanitizeParams';

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
export const tokenAddressSchema = z
  .string()
  .transform((val) => sanitizeAddress(val))
  .refine((val) => {
    // Check for Ethereum address format (0x...)
    if (val.startsWith('0x')) {
      return /^0x[a-fA-F0-9]{40}$/.test(val);
    }
    // Check for Solana address format (base58)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
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
    /^[a-zA-Z0-9\s-]+$/,
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
 * Converts text into a URL-friendly slug by:
 * 1. Converting to lowercase
 * 2. Replacing any sequence of whitespace characters (\s+) with a single hyphen
 * Example: "Ethereum Mainnet" → "ethereum-mainnet"
 */
export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Schema for wallet addresses (supports both EVM and Solana formats)
 */
export const walletAddressSchema = z
  .string()
  .transform((val) => sanitizeAddress(val))
  .refine((val) => {
    // Check for Ethereum address format (0x...)
    if (val.startsWith('0x')) {
      return /^0x[a-fA-F0-9]{40}$/.test(val);
    }
    // Check for Solana address format (base58)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
  }, 'Invalid wallet address format. Must be either an Ethereum address (0x...) or a Solana address (base58)');

/**
 * Schema for quest slugs (alphanumeric, hyphens, and underscores)
 */
export const questSlugSchema = z
  .string()
  .regex(
    /^[a-z0-9\-_]+$/,
    'Quest slug must contain only lowercase alphanumeric characters, hyphens, and underscores',
  )
  .min(1, 'Quest slug cannot be empty')
  .max(100, 'Quest slug is too long');

/**
 * Schema for scan segments (tx, block, wallet)
 */
export const scanSegmentSchema = z
  .enum(['tx', 'block', 'wallet'])
  .transform((val) => val.toLowerCase());

/**
 * Schema for scan address segments (valid blockchain addresses)
 */
export const scanAddressSchema = z
  .string()
  .transform((val) => sanitizeAddress(val))
  .refine((val) => {
    // Check for Ethereum address format (0x...)
    if (val.startsWith('0x')) {
      return /^0x[a-fA-F0-9]{40}$/.test(val);
    }
    // Check for Solana address format (base58)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
  }, 'Invalid blockchain address format');

/**
 * Schema for scan route params
 */
export const scanParamsSchema = z.object({
  segments: z.array(z.union([scanSegmentSchema, scanAddressSchema])).optional(),
});

/**
 * Schema for bridge segments (sourceChain-sourceToken-destinationChain-destinationToken)
 */
export const bridgeSegmentsSchema = z
  .string()
  .transform((val) => decodeURIComponent(val))
  .refine((val) => {
    const segments = val.split('-');
    return segments.length === 4;
  }, 'Bridge segments must be in format: sourceChain-sourceToken-destinationChain-destinationToken')
  .transform((val) => {
    const [sourceChain, sourceToken, destinationChain, destinationToken] =
      val.split('-');
    return {
      sourceChain: slugify(sourceChain),
      sourceToken: slugify(sourceToken),
      destinationChain: slugify(destinationChain),
      destinationToken: slugify(destinationToken),
    };
  });

/**
 * Schema for partner theme slugs
 */
export const partnerThemeSchema = z
  .string()
  .regex(
    /^[a-z0-9\-_]+$/,
    'Partner theme must contain only lowercase alphanumeric characters, hyphens, and underscores',
  )
  .min(1, 'Partner theme cannot be empty')
  .max(50, 'Partner theme is too long');
