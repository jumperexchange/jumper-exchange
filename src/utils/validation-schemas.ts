import { z } from 'zod';
import {
  sanitizeAddressOrEmpty,
  sanitizeNumeric,
} from './image-generation/sanitizeParams';
import { isValidAddress, isValidTransaction } from './regex-patterns';
import { buildBridgeSegments } from './getBridgeUrl';
import {
  JUMPER_BRIDGE_PATH_DELIMITER,
  JUMPER_BRIDGE_PATH_SOURCE_DESTINATION_FULL_DELIMITER,
} from '@/const/urls';
import { slugify } from './urls/slugify';
import { capitalize } from 'lodash';

/**
 * Helper function to check if a string contains only alphanumeric characters
 */
export const isAlphanumeric = (str: string) => /^[a-zA-Z0-9]+$/.test(str);

export const splitLast = (str: string) => {
  const i = str.lastIndexOf(JUMPER_BRIDGE_PATH_DELIMITER);
  if (i === -1) {
    return ['', str];
  }
  return [str.slice(0, i), str.slice(i + 1)];
};

export const slugToLabel = (slug: string) =>
  slug.replaceAll(JUMPER_BRIDGE_PATH_DELIMITER, ' ');

export const slugToDisplayLabel = (slug: string) =>
  slug.split(JUMPER_BRIDGE_PATH_DELIMITER).map(capitalize).join(' ');

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
 * Base schema for blockchain addresses (supports EVM, Solana, UTXO, and SUI formats)
 */
const baseAddressSchema = z
  .string()
  .transform((val) => sanitizeAddressOrEmpty(val))
  .refine((val) => {
    return isValidAddress(val);
  }, 'Invalid address format. Must be either an Ethereum address (0x...), a Solana address (base58), a UTXO address (1..., 3..., or bc1...), or a SUI address');

/**
 * Schema for token addresses
 */
export const tokenAddressSchema = baseAddressSchema;

export const tokenSymbolSchema = z
  .string()
  .regex(/^[a-zA-Z0-9]+$/, 'Token symbol must be a single alphanumeric word');

/**
 * Schema for theme options
 */
export const themeSchema = z
  .enum(['light', 'dark'])
  .optional()
  .prefault('light');

/**
 * Schema for chain names
 */
export const chainNameSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9\s-]+$/,
    'Chain name must contain only alphanumeric characters, spaces, and hyphens',
  );

export const chainSlugSchema = z
  .string()
  .regex(
    /^[a-zA-Z0-9-]+$/,
    'Chain slug must contain only alphanumeric characters and hyphens',
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
  isSwap: z.enum(['true', 'false']).prefault('false'),
  amountUSD: amountSchema.nullable(),
  chainName: chainNameSchema.nullable(),
});

export type ValidatedSearchParams = z.infer<typeof searchParamsSchema>;

/**
 * Schema for wallet addresses
 */
export const walletAddressSchema = z
  .string()
  .transform((val) => sanitizeAddressOrEmpty(val))
  .refine((val) => val.length > 0, {
    error: 'Wallet address cannot be empty',
  });

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
 * Schema for transaction hashes (supports Ethereum, Solana, UTXO, and SUI formats)
 */
export const transactionHashSchema = z
  .string()
  .transform((val) => val) // Remove toLowerCase() as Solana signatures are case-sensitive
  .refine(
    (val) => {
      return isValidTransaction(val);
    },
    {
      error:
        'Invalid transaction hash format. Must be either an Ethereum transaction hash (0x...), a UTXO transaction hash (64 hex chars), a Solana transaction signature, or a SUI transaction digest',
    },
  );

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
  segments: z
    .array(z.string())
    .optional()
    .refine(
      (segments) => {
        if (!segments || segments.length === 0) {
          return true;
        }

        const [type, value] = segments;
        if (!['tx', 'wallet'].includes(type)) {
          return false;
        }

        // If there's no value, that's valid
        if (!value) {
          return true;
        }

        if (type === 'tx') {
          return transactionHashSchema.safeParse(value).success;
        }

        // For wallet, validate as address
        return scanAddressSchema.safeParse(value).success;
      },
      {
        error: 'Invalid scan segments format',
      },
    ),
});

/**
 * Schema for bridge segments (sourceChain-sourceToken-destinationChain-destinationToken)
 */
export const bridgeSegmentsSchema = z
  .string()
  .transform((val) => decodeURIComponent(val))
  .refine(
    (val) => {
      const parts = val.split(
        JUMPER_BRIDGE_PATH_SOURCE_DESTINATION_FULL_DELIMITER,
      );
      return parts.length === 2;
    },
    {
      error: `Bridge segments must be in format: ${buildBridgeSegments(
        'sourceChain',
        'sourceToken',
        'destinationChain',
        'destinationToken',
      )}`,
    },
  )
  .transform((val) => {
    const [source, destination] = val.split(
      JUMPER_BRIDGE_PATH_SOURCE_DESTINATION_FULL_DELIMITER,
    );
    const [sourceChain, sourceToken] = splitLast(source);
    const [destinationChain, destinationToken] = splitLast(destination);

    return {
      sourceChain,
      sourceToken,
      destinationChain,
      destinationToken,
    };
  })
  .refine(
    (val) =>
      tokenSymbolSchema.safeParse(val.sourceToken).success &&
      tokenSymbolSchema.safeParse(val.destinationToken).success,
    { error: 'Token symbols must be single alphanumeric words' },
  )
  .refine(
    (val) =>
      chainSlugSchema.safeParse(val.sourceChain).success &&
      chainSlugSchema.safeParse(val.destinationChain).success,
    {
      error:
        'Chain slugs must contain only alphanumeric characters and hyphens',
    },
  );

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

/**
 * Schema for pagination parameters
 */
export const paginationSchema = z
  .string()
  .optional()
  .transform((val) => {
    if (!val) {
      return 1;
    }
    const num = parseInt(val, 10);
    return isNaN(num) || num < 1 ? 1 : num;
  });

/**
 * Schema for learn page slugs (alphanumeric, hyphens, and underscores)
 */
export const learnSlugSchema = z
  .string()
  .regex(
    /^[a-z0-9\-_]+$/,
    'Learn page slug must contain only lowercase alphanumeric characters, hyphens, and underscores',
  )
  .min(1, 'Learn page slug cannot be empty')
  .max(100, 'Learn page slug is too long');
