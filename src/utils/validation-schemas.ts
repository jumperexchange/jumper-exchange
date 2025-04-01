import { z } from 'zod';
import {
  sanitizeAddress,
  sanitizeNumeric,
} from './image-generation/sanitizeParams';

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
  .transform((val) => sanitizeNumeric(val))
  .refine((val) => /^\d+$/.test(val), 'Chain ID must be numeric');

/**
 * Schema for amounts (numeric with decimals)
 */
export const amountSchema = z
  .string()
  .transform((val) => sanitizeNumeric(val))
  .refine((val) => /^\d+(\.\d+)?$/.test(val), 'Amount must be a valid number');

/**
 * Base schema for blockchain addresses (supports both EVM and Solana formats)
 */
const baseAddressSchema = z
  .string()
  .transform((val) => sanitizeAddress(val))
  .refine((val) => {
    // Check for Ethereum address format (0x...)
    if (val.startsWith('0x')) {
      return /^0x[a-fA-F0-9]{40}$/.test(val);
    }
    // Check for Solana address format (base58)
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
  }, 'Invalid address format. Must be either an Ethereum address (0x...) or a Solana address (base58)');

/**
 * Schema for token addresses
 */
export const tokenAddressSchema = baseAddressSchema;

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
 * Schema for wallet addresses
 */
export const walletAddressSchema = baseAddressSchema;

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
 * Schema for scan address segments
 */
export const scanAddressSchema = baseAddressSchema;

/**
 * Schema for scan route params
 */
export const scanParamsSchema = z.object({
  segments: z.array(z.union([scanSegmentSchema, scanAddressSchema])).optional(),
});

/**
 * Schema for bridge segments (sourceChain-sourceToken-to-destinationChain-destinationToken)
 */
export const bridgeSegmentsSchema = z
  .string()
  .transform((val) => decodeURIComponent(val))
  .refine((val) => {
    const segments = val.split('-');
    return segments.length === 5;
  }, 'Bridge segments must be in format: sourceChain-sourceToken-to-destinationChain-destinationToken')
  .transform((val) => {
    const segments = val.split('-');
    const [sourceChain, sourceToken, _, destinationChain, destinationToken] =
      segments;
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
