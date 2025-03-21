import { z } from 'zod';

// Helper function to sanitize address
const sanitizeAddress = (address: string): string => {
  // Remove any whitespace and convert to lowercase
  const cleanAddress = address.trim().toLowerCase();

  // Check if it's a Solana address (base58 encoded, 32-44 characters)
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(cleanAddress)) {
    return cleanAddress;
  }

  // Handle Ethereum-style addresses (0x...)
  const hexAddress = cleanAddress.replace(/[^a-f0-9]/g, '');
  if (hexAddress.length === 40) {
    return '0x' + hexAddress;
  }

  // If neither format matches, return the original address
  return address;
};

// Helper function to sanitize numeric values
const sanitizeNumeric = (value: string): string => {
  return value.replace(/[^\d.]/g, '');
};

// Common schemas
const chainIdSchema = z
  .string()
  .transform((val) => sanitizeNumeric(val))
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'ChainId must be a positive number',
  });

const tokenAddressSchema = z
  .string()
  .transform((val) => sanitizeAddress(val))
  .refine(
    (val) => {
      // Check for Ethereum address format (0x...)
      if (val.startsWith('0x')) {
        return val.length === 42;
      }
      // Check for Solana address format (base58)
      return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(val);
    },
    {
      message:
        'Invalid token address format. Must be either an Ethereum address (0x...) or a Solana address (base58)',
    },
  );

const amountSchema = z
  .string()
  .transform((val) => sanitizeNumeric(val))
  .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  });

const themeSchema = z.enum(['light', 'dark']).default('light');

const highlightedSchema = z
  .union([
    z.enum(['from', 'to', 'amount', '0', '1', '2']),
    z.null(),
    z.undefined(),
  ])
  .optional();

// Widget Quotes Schema
export const widgetQuotesSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromToken: tokenAddressSchema,
  toToken: tokenAddressSchema,
  amount: amountSchema,
  amountUSD: z
    .string()
    .nullable()
    .transform((val) => val || '0')
    .transform((val) => sanitizeNumeric(val))
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'AmountUSD must be a non-negative number',
    })
    .optional(),
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .transform((val) => Boolean(val))
    .default('false'),
  theme: themeSchema,
  highlighted: highlightedSchema.optional(),
});

// Widget Selection Schema
export const widgetSelectionSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromToken: tokenAddressSchema,
  toToken: tokenAddressSchema,
  amount: amountSchema,
  theme: themeSchema,
  highlighted: highlightedSchema,
});

// Widget Execution Schema
export const widgetExecutionSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromToken: tokenAddressSchema,
  toToken: tokenAddressSchema,
  amount: amountSchema,
  amountUSD: z
    .string()
    .transform((val) => sanitizeNumeric(val))
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'AmountUSD must be a non-negative number',
    })
    .optional(),
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional(),
  theme: themeSchema,
  highlighted: highlightedSchema,
});

// Widget Amounts Schema
export const widgetAmountsSchema = z.object({
  chainName: z.string().min(1, 'Chain name is required'),
  amount: amountSchema,
  theme: themeSchema,
  highlighted: highlightedSchema,
});

// Widget Review Schema
export const widgetReviewSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromToken: tokenAddressSchema,
  toToken: tokenAddressSchema,
  amount: amountSchema,
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .default('false'),
  theme: themeSchema,
  highlighted: highlightedSchema,
});

// Widget Success Schema
export const widgetSuccessSchema = z.object({
  toChainId: chainIdSchema,
  toToken: tokenAddressSchema,
  amount: amountSchema,
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional(),
  theme: themeSchema,
});

// Widget Route Schema
export const widgetRouteSchema = z.object({
  fromChainId: chainIdSchema,
  toChainId: chainIdSchema,
  fromToken: tokenAddressSchema,
  toToken: tokenAddressSchema,
  amount: amountSchema,
  theme: themeSchema,
  highlighted: highlightedSchema,
});

// Export types
export type WidgetQuotesParams = z.infer<typeof widgetQuotesSchema>;
export type WidgetSelectionParams = z.infer<typeof widgetSelectionSchema>;
export type WidgetExecutionParams = z.infer<typeof widgetExecutionSchema>;
export type WidgetAmountsParams = z.infer<typeof widgetAmountsSchema>;
export type WidgetReviewParams = z.infer<typeof widgetReviewSchema>;
export type WidgetSuccessParams = z.infer<typeof widgetSuccessSchema>;
export type WidgetRouteParams = z.infer<typeof widgetRouteSchema>;
