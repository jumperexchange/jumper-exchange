import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState, useCallback, useMemo, useRef } from 'react';
import { JumperWidget } from './JumperWidget';
import { defineField, type StatusSheetContent } from './types';
import { useFormValidation, useWidgetStore, useWidgetSubmit } from './store';
import { useWidgetNavigation } from './context';
import {
  ChainSingleSelectField,
  ChainSingleSelectSidePanel,
  chainSingleSelectSchema,
  type ChainSingleSelectValue,
} from './components/Chain';
import {
  TokenSingleSelectField,
  TokenSingleSelectSidePanel,
  tokenSingleSelectSchema,
  type TokenSingleSelectValue,
} from './components/Token';
import {
  AmountThresholdField,
  amountThresholdSchema,
  type AmountThresholdValue,
} from './components/AmountThreshold';
import {
  BalancesMultiSelectField,
  BalancesMultiSelectSidePanel,
  balancesMultiSelectSchema,
  type BalancesMultiSelectValue,
} from './components/Balances';
import {
  createExtendedToken,
  createTokenBalance,
  type Balance,
} from '@/types/tokens';
import { chains, tokens, balances } from './fixtures';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { Summary } from './components/Summary';

const meta = {
  title: 'components/composite/JumperWidget',
  component: JumperWidget,
} satisfies Meta<typeof JumperWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getBalanceUsdValue = (balance: Balance): number => {
  const divisor = BigInt(10 ** balance.token.decimals);
  const whole = Number(balance.amount / divisor);
  const remainder = Number(balance.amount % divisor) / Number(divisor);
  return (whole + remainder) * Number(balance.token.priceUSD);
};

const chainHasTokensAbove = (chainId: number, minUsd: number) =>
  tokens.some((t) => t.chainId === chainId && Number(t.priceUSD) >= minUsd);

const chainHasBalancesAbove = (chainId: number, minUsd: number) =>
  balances.some(
    (b) => b.token.chainId === chainId && getBalanceUsdValue(b) >= minUsd,
  );

// ─── Shared UI ────────────────────────────────────────────────────────────────

const widgetStyle: Story['args']['style'] = {
  container: (theme) => ({
    maxHeight: 'calc(100vh - 6rem)',
    position: 'relative',
    borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
  }),
  mainView: (theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.up('sm')]: { width: 400 },
  }),
  mainViewContent: () => ({
    maxHeight: 'calc(100vh - 12rem)',
    display: 'flex',
    overflow: 'hidden',
  }),
  sideView: (theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    [theme.breakpoints.up('sm')]: { width: 256 },
  }),
};

const summaryFieldSx = {
  background: 'transparent',
  boxShadow: 'none',
  padding: 0,
} as const;

const SubmitButton = ({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) => {
  const { submit, isSubmitting } = useWidgetSubmit();
  return (
    <Button
      variant={Variant.Primary}
      onClick={submit}
      disabled={disabled || isSubmitting}
      loading={isSubmitting}
    >
      {label}
    </Button>
  );
};

const fields = {
  bridgeAmountThreshold: defineField({
    fieldKey: 'amountThreshold',
    schema: amountThresholdSchema.optional(),
    defaultValue: { amount: 0 },
    FieldComponent: AmountThresholdField,
    fieldProps: { thresholds: [1, 5, 10, 50], label: 'Min token price (USD)' },
  }),

  dustAmountThreshold: defineField({
    fieldKey: 'amountThreshold',
    schema: amountThresholdSchema,
    defaultValue: { amount: 5 },
    FieldComponent: AmountThresholdField,
    fieldProps: { thresholds: [5, 10, 20, 30], label: 'Dust threshold' },
  }),

  fromChain: defineField({
    fieldKey: 'fromChain',
    schema: chainSingleSelectSchema,
    FieldComponent: ChainSingleSelectField,
    SidePanelComponent: ChainSingleSelectSidePanel,
    fieldProps: { availableChains: chains, label: 'From chain' },
    sidePanelProps: { availableChains: chains, header: 'Chains' },
    deriveProps: (getValue) => {
      const threshold = getValue('amountThreshold') as
        | AmountThresholdValue
        | undefined;
      if (!threshold?.amount) return {};
      const filtered = chains.filter(
        (c) =>
          !threshold?.amount || chainHasTokensAbove(c.id, threshold.amount),
      );
      return {
        fieldProps: { availableChains: filtered },
        sidePanelProps: { availableChains: filtered },
      };
    },
    sanitizeValue: (value, { fieldProps }) =>
      fieldProps.availableChains.some((c) => c.id === value?.selectedChain)
        ? value
        : undefined,
  }),

  toChain: defineField({
    fieldKey: 'toChain',
    schema: chainSingleSelectSchema,
    FieldComponent: ChainSingleSelectField,
    SidePanelComponent: ChainSingleSelectSidePanel,
    fieldProps: { availableChains: chains, label: 'To chain' },
    sidePanelProps: { availableChains: chains, header: 'Chains' },
    deriveProps: (getValue) => {
      const threshold = getValue('amountThreshold') as
        | AmountThresholdValue
        | undefined;
      if (!threshold?.amount) return {};
      const filtered = chains.filter((c) =>
        chainHasTokensAbove(c.id, threshold.amount),
      );
      return {
        fieldProps: { availableChains: filtered },
        sidePanelProps: { availableChains: filtered },
      };
    },
    sanitizeValue: (value, { fieldProps }) =>
      fieldProps.availableChains.some((c) => c.id === value?.selectedChain)
        ? value
        : undefined,
  }),

  token: defineField({
    fieldKey: 'token',
    schema: tokenSingleSelectSchema,
    FieldComponent: TokenSingleSelectField,
    SidePanelComponent: TokenSingleSelectSidePanel,
    fieldProps: { availableTokens: tokens, label: 'Token' },
    sidePanelProps: { availableTokens: tokens, header: 'Tokens' },
    deriveProps: (getValue) => {
      const fromChain = getValue('fromChain') as
        | ChainSingleSelectValue
        | undefined;
      const threshold = getValue('amountThreshold') as
        | AmountThresholdValue
        | undefined;
      let filtered = tokens;
      if (fromChain?.selectedChain)
        filtered = filtered.filter(
          (t) => t.chainId === fromChain.selectedChain,
        );
      if (threshold?.amount)
        filtered = filtered.filter(
          (t) => Number(t.priceUSD) >= threshold.amount,
        );
      return {
        fieldProps: { availableTokens: filtered },
        sidePanelProps: { availableTokens: filtered },
      };
    },
    sanitizeValue: (value, { fieldProps }) =>
      fieldProps.availableTokens.some((t) => t.address === value?.selectedToken)
        ? value
        : undefined,
  }),

  chain: defineField({
    fieldKey: 'chain',
    schema: chainSingleSelectSchema,
    FieldComponent: ChainSingleSelectField,
    SidePanelComponent: ChainSingleSelectSidePanel,
    fieldProps: { availableChains: chains, label: 'Chain' },
    sidePanelProps: { availableChains: chains, header: 'Chains' },
    deriveProps: (getValue) => {
      const threshold = getValue('amountThreshold') as
        | AmountThresholdValue
        | undefined;
      if (!threshold?.amount) return {};
      const filtered = chains.filter((c) =>
        chainHasBalancesAbove(c.id, threshold.amount),
      );
      return {
        fieldProps: { availableChains: filtered },
        sidePanelProps: { availableChains: filtered },
      };
    },
    sanitizeValue: (value, { fieldProps }) =>
      fieldProps.availableChains.some((c) => c.id === value?.selectedChain)
        ? value
        : undefined,
  }),

  balances: defineField({
    fieldKey: 'balances',
    schema: balancesMultiSelectSchema,
    FieldComponent: BalancesMultiSelectField,
    SidePanelComponent: BalancesMultiSelectSidePanel,
    fieldProps: { availableBalances: balances, label: 'Convert' },
    sidePanelProps: { availableBalances: balances, header: 'Tokens' },
    deriveProps: (getValue) => {
      const chain = getValue('chain') as ChainSingleSelectValue | undefined;
      const threshold = getValue('amountThreshold') as
        | AmountThresholdValue
        | undefined;
      let filtered = balances;
      if (chain?.selectedChain)
        filtered = filtered.filter(
          (b) => b.token.chainId === chain.selectedChain,
        );
      if (threshold?.amount)
        filtered = filtered.filter(
          (b) => getBalanceUsdValue(b) >= threshold.amount,
        );
      return {
        fieldProps: { availableBalances: filtered },
        sidePanelProps: { availableBalances: filtered },
      };
    },
    sanitizeValue: (value, { fieldProps }) => {
      if (!value) return undefined;
      const validAddresses = new Set(
        fieldProps.availableBalances.map((b) => b.token.address),
      );
      const next = value.selectedAddresses.filter((a) => validAddresses.has(a));
      if (next.length === value.selectedAddresses.length) return value;
      return next.length > 0 ? { selectedAddresses: next } : undefined;
    },
  }),
};

const BridgeSummary = () => {
  const values = useWidgetStore((s) => s.values);
  const fromChain = values.fromChain as ChainSingleSelectValue | undefined;
  const toChain = values.toChain as ChainSingleSelectValue | undefined;
  const token = values.token as TokenSingleSelectValue | undefined;
  const amountThreshold = values.amountThreshold as
    | AmountThresholdValue
    | undefined;

  const selectedToken = useMemo(
    () => tokens.find((t) => t.address === token?.selectedToken),
    [tokens, token],
  );

  const selectedFromChain = useMemo(
    () => chains.find((c) => c.id === fromChain?.selectedChain),
    [chains, fromChain],
  );

  const selectedToChain = useMemo(
    () => chains.find((c) => c.id === toChain?.selectedChain),
    [chains, toChain],
  );

  const fromBalance = useMemo(() => {
    if (!selectedToken) {
      return null;
    }

    return createTokenBalance(
      {
        ...selectedToken,
        type: 'extended',
        chainId: selectedFromChain?.id ?? selectedToken?.chainId ?? 1,
      },
      BigInt(amountThreshold?.amount ?? 0),
    );
  }, [selectedToken, selectedFromChain, amountThreshold]);
  const toBalance = useMemo(() => {
    if (!selectedToken) {
      return null;
    }

    return createTokenBalance(
      {
        ...selectedToken,
        type: 'extended',
        chainId: selectedToChain?.id ?? selectedToken?.chainId ?? 1,
      },
      BigInt(amountThreshold?.amount ?? 0),
    );
  }, [selectedToken, selectedToChain, amountThreshold]);

  if (!fromBalance || !toBalance) {
    return null;
  }

  return (
    <Summary
      label={'Bridge'}
      from={fromBalance}
      to={toBalance}
      fieldSx={summaryFieldSx}
    />
  );
};

const BridgeFormActions = () => {
  const { isValid } = useFormValidation();
  return <SubmitButton label="Get Quote" disabled={!isValid} />;
};

export const Default: Story = {
  args: {
    style: widgetStyle,
    views: [
      {
        type: 'form',
        id: 'form',
        title: 'Bridge',
        fields: [
          fields.bridgeAmountThreshold,
          fields.fromChain,
          fields.toChain,
          fields.token,
        ],
        actions: <BridgeFormActions />,
        onSubmit: async ({ goToView }) => {
          await new Promise((r) => setTimeout(r, 1000));
          goToView('summary');
        },
      },
      {
        type: 'custom',
        id: 'summary',
        title: 'Review Bridge',
        content: <BridgeSummary />,
        actions: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SubmitButton label="Confirm Bridge" />
          </div>
        ),
        onSubmit: async ({ goToView }) => {
          await new Promise((r) => setTimeout(r, 1000));
          goToView('form');
        },
      },
    ],
  },
};

const BalancesSummary = () => {
  const values = useWidgetStore((s) => s.values);
  const chain = values.chain as ChainSingleSelectValue | undefined;
  const selectedBalances = values.balances as
    | BalancesMultiSelectValue
    | undefined;

  const amountThreshold = values.amountThreshold as
    | AmountThresholdValue
    | undefined;

  const chainName = chains.find((c) => c.id === chain?.selectedChain)?.name;

  const selectedChain = useMemo(
    () => chains.find((c) => c.id === chain?.selectedChain),
    [chains, chain],
  );

  const fromBalances = useMemo(() => {
    if (
      !selectedBalances?.selectedAddresses ||
      !selectedBalances?.selectedAddresses.length
    ) {
      return [];
    }
    return balances.filter((balance) =>
      selectedBalances.selectedAddresses.includes(balance.token.address),
    );
  }, [selectedBalances]);

  const toBalance = useMemo(() => {
    if (!selectedChain) {
      return null;
    }
    return createTokenBalance(
      createExtendedToken(selectedChain.nativeToken),
      0n,
    );
  }, []);

  if (!fromBalances.length || !toBalance || !amountThreshold?.amount) {
    return null;
  }
  return (
    <Summary
      label="Convert"
      from={fromBalances}
      amountUSD={amountThreshold.amount}
      to={toBalance}
      fieldSx={summaryFieldSx}
    />
  );
};

const BalancesFormActions = () => {
  const { isValid } = useFormValidation();
  return <SubmitButton label="Review" disabled={!isValid} />;
};

export const Balances: Story = {
  args: {
    style: widgetStyle,
    views: [
      {
        type: 'form',
        id: 'form',
        title: 'Convert dust',
        fields: [fields.dustAmountThreshold, fields.chain, fields.balances],
        actions: <BalancesFormActions />,
        onSubmit: async ({ goToView }) => {
          await new Promise((r) => setTimeout(r, 1000));
          goToView('summary');
        },
      },
      {
        type: 'custom',
        id: 'summary',
        title: 'Review Selection',
        content: <BalancesSummary />,
        actions: (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SubmitButton label="Confirm" />
          </div>
        ),
        onSubmit: async ({ goToView }) => {
          await new Promise((r) => setTimeout(r, 1000));
          goToView('form');
        },
      },
    ],
  },
};

// ─── With status bottom sheet ─────────────────────────────────────────────────

const confirmationSheetContent: StatusSheetContent = {
  title: 'Confirm bridge',
  description: 'Please confirm you want to proceed with this bridge.',
  callToAction: 'Confirm',
  callToActionType: 'button',
  status: 'info',
  onClick: undefined,
};

const successSheetContent: StatusSheetContent = {
  title: 'Transaction complete',
  description: 'Your request was submitted successfully.',
  callToAction: 'Done',
  callToActionType: 'button',
  status: 'success',
  onClick: undefined,
};

function JumperWidgetWithStatusSheetStory() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetMode, setSheetMode] = useState<'confirmation' | 'success'>(
    'confirmation',
  );
  const nextStepRef = useRef<((id: string) => void) | null>(null);

  const handleCloseSheet = useCallback(() => setSheetOpen(false), []);

  const handleConfirmationConfirm = useCallback(() => {
    setSheetOpen(false);
    nextStepRef.current?.('summary');
    nextStepRef.current = null;
  }, []);

  const statusSheet = useMemo(() => {
    const isConfirmation = sheetMode === 'confirmation';
    return {
      isOpen: sheetOpen,
      content: {
        ...(isConfirmation ? confirmationSheetContent : successSheetContent),
        onClick: isConfirmation ? handleConfirmationConfirm : handleCloseSheet,
      },
      onClose: handleCloseSheet,
    };
  }, [sheetOpen, sheetMode, handleCloseSheet, handleConfirmationConfirm]);

  const views = useMemo(
    () => [
      {
        type: 'form' as const,
        id: 'form',
        title: 'Bridge',
        fields: [
          fields.bridgeAmountThreshold,
          fields.fromChain,
          fields.toChain,
          fields.token,
        ],
        actions: <BridgeFormActions />,
        onSubmit: async ({ goToView }: { goToView: (id: string) => void }) => {
          await new Promise((r) => setTimeout(r, 400));
          nextStepRef.current = goToView;
          setSheetMode('confirmation');
          setSheetOpen(true);
        },
      },
      {
        type: 'custom' as const,
        id: 'summary',
        title: 'Review Bridge',
        content: <BridgeSummary />,
        actions: (
          <>
            <SubmitButton label="Confirm" />
          </>
        ),
        onSubmit: async () => {
          await new Promise((r) => setTimeout(r, 800));
          setSheetMode('success');
          setSheetOpen(true);
        },
      },
    ],
    [],
  );

  return (
    <JumperWidget views={views} statusSheet={statusSheet} style={widgetStyle} />
  );
}

export const WithStatusSheet: Story = {
  args: { views: [] },
  render: () => <JumperWidgetWithStatusSheetStory />,
};
