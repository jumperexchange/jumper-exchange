import { z } from 'zod';
import {
  amountSchema,
  themeSchema as baseThemeSchema,
  chainIdSchema,
  tokenAddressSchema,
} from '../validation-schemas';
import { sanitizeNumeric } from './sanitizeParams';

// Widget-specific schemas with additional validation
const widgetChainIdSchema = chainIdSchema
  .transform((val) => Number(val))
  .refine((val) => !isNaN(val) && val > 0, {
    message: 'ChainId must be a positive number',
  });

const widgetTokenAddressSchema = tokenAddressSchema;

const widgetAmountSchema = amountSchema.refine(
  (val) => !isNaN(Number(val)) && Number(val) > 0,
  {
    message: 'Amount must be a positive number',
  },
);

const highlightedSchema = z
  .union([
    z.enum(['from', 'to', 'amount', '0', '1', '2']),
    z.null(),
    z.undefined(),
  ])
  .optional();

// Widget Quotes Schema
export const widgetQuotesSchema = z.object({
  fromChainId: widgetChainIdSchema,
  toChainId: widgetChainIdSchema,
  fromToken: widgetTokenAddressSchema,
  toToken: widgetTokenAddressSchema,
  amount: widgetAmountSchema,
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
  theme: baseThemeSchema,
  highlighted: highlightedSchema.optional(),
});

// Widget Selection Schema
export const widgetSelectionSchema = z.object({
  fromChainId: widgetChainIdSchema,
  toChainId: widgetChainIdSchema,
  fromToken: widgetTokenAddressSchema,
  toToken: widgetTokenAddressSchema,
  amount: widgetAmountSchema,
  theme: baseThemeSchema,
  highlighted: highlightedSchema,
});

// Widget Execution Schema
export const widgetExecutionSchema = z.object({
  fromChainId: widgetChainIdSchema,
  toChainId: widgetChainIdSchema,
  fromToken: widgetTokenAddressSchema,
  toToken: widgetTokenAddressSchema,
  amount: widgetAmountSchema,
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional(),
  theme: baseThemeSchema,
  highlighted: highlightedSchema,
});

// Widget Amounts Schema
export const widgetAmountsSchema = z.object({
  chainName: z.string().min(1, 'Chain name is required'),
  amount: widgetAmountSchema,
  theme: baseThemeSchema,
  highlighted: highlightedSchema,
});

// Widget Review Schema
export const widgetReviewSchema = z.object({
  fromChainId: widgetChainIdSchema,
  toChainId: widgetChainIdSchema,
  fromToken: widgetTokenAddressSchema,
  toToken: widgetTokenAddressSchema,
  amount: widgetAmountSchema,
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .default('false'),
  theme: baseThemeSchema,
  highlighted: highlightedSchema,
});

// Widget Success Schema
export const widgetSuccessSchema = z.object({
  toChainId: widgetChainIdSchema,
  toToken: widgetTokenAddressSchema,
  amount: widgetAmountSchema,
  isSwap: z
    .string()
    .transform((val) => val.toLowerCase() === 'true')
    .optional(),
  theme: baseThemeSchema,
});

// Widget Route Schema
export const widgetRouteSchema = z.object({
  fromChainId: widgetChainIdSchema,
  toChainId: widgetChainIdSchema,
  fromToken: widgetTokenAddressSchema,
  toToken: widgetTokenAddressSchema,
  amount: widgetAmountSchema,
  theme: baseThemeSchema,
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
