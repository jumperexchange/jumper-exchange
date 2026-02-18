import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState, useCallback, useMemo, useRef } from 'react';
import { JumperWidget } from './JumperWidget';
import { defineField, type StatusSheetContent } from './types';
import { useFormValidation, useWidgetStore, useWidgetSubmit } from './store';
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
  ExtendedToken,
  type Balance,
} from '@/types/tokens';
import { chains, tokens, balances } from './fixtures';
import { Button } from '@/components/core/buttons/Button/Button';
import { Variant } from '@/components/core/buttons/types';
import { Summary } from './components/Summary';
import { Amount, amountSchema } from './components/Amount';
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';

const meta = {
  title: 'components/composite/JumperWidget',
  component: JumperWidget,
} satisfies Meta<typeof JumperWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const widgetStyle: Story['args']['style'] = {
  container: (theme) => ({
    maxHeight: 'calc(100vh - 6rem)',
    position: 'relative',
    borderRadius: `${theme.shape.cardBorderRadiusLarge}px`,
    boxShadow: theme.shadows[3],
    maxWidth: 400,
    [theme.breakpoints.up('sm')]: { width: 400 },
  }),
  mainView: (theme) => ({
    padding: 0,
    width: 'calc(100vw - 2rem)',
    maxWidth: 400,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: 'none',
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

const BridgeSummary = () => {
  const values = useWidgetStore((s) => s.values);
  const fromChain = values.fromChain as ChainSingleSelectValue | undefined;
  const toChain = values.toChain as ChainSingleSelectValue | undefined;
  const token = values.token as TokenSingleSelectValue | undefined;
  const amount = values.amount as { amount: string } | undefined;

  const selectedToken = useMemo(
    () => tokens.find((t) => t.address === token?.selectedToken),
    [token],
  );

  const selectedFromChain = useMemo(
    () => chains.find((c) => c.id === fromChain?.selectedChain),
    [fromChain],
  );

  const selectedToChain = useMemo(
    () => chains.find((c) => c.id === toChain?.selectedChain),
    [toChain],
  );

  const fromBalance = useMemo(() => {
    if (!selectedToken) return null;
    return createTokenBalance(
      {
        ...selectedToken,
        type: 'extended',
        chainId: selectedFromChain?.id ?? selectedToken.chainId,
      },
      BigInt(amount?.amount ?? 0),
    );
  }, [selectedToken, selectedFromChain, amount]);

  const toBalance = useMemo(() => {
    if (!selectedToken) return null;
    return createTokenBalance(
      {
        ...selectedToken,
        type: 'extended',
        chainId: selectedToChain?.id ?? selectedToken.chainId,
      },
      BigInt(amount?.amount ?? 0),
    );
  }, [selectedToken, selectedToChain, amount]);

  if (!fromBalance || !toBalance) return null;

  return (
    <Summary
      label="Bridge"
      from={fromBalance}
      to={toBalance}
      fieldSx={summaryFieldSx}
    />
  );
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

  const selectedChain = useMemo(
    () => chains.find((c) => c.id === chain?.selectedChain),
    [chain],
  );

  const fromBalances = useMemo(() => {
    if (!selectedBalances?.selectedAddresses?.length) return [];
    return balances.filter((b) =>
      selectedBalances.selectedAddresses.includes(b.token.address),
    );
  }, [selectedBalances]);

  const toBalance = useMemo(() => {
    if (!selectedChain) return null;
    return createTokenBalance(
      createExtendedToken(selectedChain.nativeToken),
      0n,
    );
  }, [selectedChain]);

  if (!fromBalances.length || !toBalance || !amountThreshold?.amount)
    return null;

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

export const Default: Story = {
  render: () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<'confirmation' | 'success'>(
      'confirmation',
    );
    const nextStepRef = useRef<((id: string) => void) | null>(null);

    const fromChain = defineField({
      fieldKey: 'fromChain',
      schema: chainSingleSelectSchema,
      FieldComponent: ChainSingleSelectField,
      SidePanelComponent: ChainSingleSelectSidePanel,
      fieldProps: { availableChains: chains, label: 'From chain' },
      sidePanelProps: { availableChains: chains, header: 'Chains' },
    });

    const toChain = defineField({
      fieldKey: 'toChain',
      schema: chainSingleSelectSchema,
      FieldComponent: ChainSingleSelectField,
      SidePanelComponent: ChainSingleSelectSidePanel,
      fieldProps: { availableChains: chains, label: 'To chain' },
      sidePanelProps: { availableChains: chains, header: 'Chains' },
    });

    const tokenField = defineField({
      fieldKey: 'token',
      schema: tokenSingleSelectSchema,
      FieldComponent: TokenSingleSelectField,
      SidePanelComponent: TokenSingleSelectSidePanel,
      fieldProps: { availableTokens: tokens, label: 'Token' },
      sidePanelProps: { availableTokens: tokens, header: 'Tokens' },
    });

    const amountField = defineField({
      fieldKey: 'amount',
      schema: amountSchema,
      defaultValue: { amount: '0', maxAmount: '100000' },
      FieldComponent: Amount,
      fieldProps: { label: 'Amount', token: tokens[0] },
    });

    const handleCloseSheet = useCallback(() => setSheetOpen(false), []);

    const handleConfirmationConfirm = useCallback(() => {
      setSheetOpen(false);
      nextStepRef.current?.('summary');
      nextStepRef.current = null;
    }, []);

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

    const statusSheet = {
      isOpen: sheetOpen,
      content: {
        ...(sheetMode === 'confirmation'
          ? confirmationSheetContent
          : successSheetContent),
        onClick:
          sheetMode === 'confirmation'
            ? handleConfirmationConfirm
            : handleCloseSheet,
      },
      onClose: handleCloseSheet,
    };

    const views = [
      {
        type: 'form' as const,
        id: 'form',
        title: 'Bridge',
        fields: [fromChain, toChain, tokenField, amountField],
        actions: <SubmitButton label="Get Quote" />,
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
        actions: <SubmitButton label="Confirm" />,
        onSubmit: async () => {
          await new Promise((r) => setTimeout(r, 800));
          setSheetMode('success');
          setSheetOpen(true);
        },
      },
    ];

    return (
      <JumperWidget
        views={views}
        statusSheet={statusSheet}
        style={widgetStyle}
      />
    );
  },
  args: {
    views: [],
  },
};

export const Balances: Story = {
  render: () => {
    const { toAmountUSD } = useTokenFormatters();

    const checkBalanceAboveThreshold = (
      balance: Balance<ExtendedToken>,
      minUsd: number,
    ) => {
      return Number(toAmountUSD(balance)) - minUsd > Number.EPSILON;
    };

    const checkChainBalancesAboveThreshold = (
      chainId: number,
      minUsd: number,
    ) => {
      const chainBalances = balances.filter((b) => b.token.chainId === chainId);

      return (
        chainBalances.length &&
        chainBalances.some((b) => checkBalanceAboveThreshold(b, minUsd))
      );
    };

    const dustAmountThreshold = defineField({
      fieldKey: 'amountThreshold',
      schema: amountThresholdSchema,
      defaultValue: { amount: 5 },
      FieldComponent: AmountThresholdField,
      fieldProps: { thresholds: [5, 10, 20, 30], label: 'Dust threshold' },
    });

    const chainField = defineField({
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
          checkChainBalancesAboveThreshold(c.id, threshold.amount),
        );
        return {
          fieldProps: { availableChains: filtered },
          sidePanelProps: { availableChains: filtered },
        };
      },
    });

    const balancesField = defineField({
      fieldKey: 'balances',
      schema: balancesMultiSelectSchema,
      FieldComponent: BalancesMultiSelectField,
      SidePanelComponent: BalancesMultiSelectSidePanel,
      fieldProps: { availableBalances: balances, label: 'Convert' },
      sidePanelProps: { availableBalances: balances, header: 'Tokens' },
      deriveProps: (getValue) => {
        const threshold = getValue('amountThreshold') as
          | AmountThresholdValue
          | undefined;

        const chain = getValue('chain') as ChainSingleSelectValue | undefined;

        if (!chain?.selectedChain || !threshold?.amount)
          return {
            fieldProps: { availableBalances: [] },
            sidePanelProps: { availableBalances: [] },
          };

        const filtered = balances
          .filter((b) => b.token.chainId === chain.selectedChain)
          .filter((b) => checkBalanceAboveThreshold(b, threshold.amount));
        return {
          fieldProps: { availableBalances: filtered },
          sidePanelProps: { availableBalances: filtered },
        };
      },
    });

    const views = [
      {
        type: 'form' as const,
        id: 'form',
        title: 'Convert dust',
        fields: [dustAmountThreshold, chainField, balancesField],
        actions: <SubmitButton label="Review" />,
        onSubmit: async ({ goToView }: { goToView: (id: string) => void }) => {
          await new Promise((r) => setTimeout(r, 600));
          goToView('summary');
        },
      },
      {
        type: 'custom' as const,
        id: 'summary',
        title: 'Review Selection',
        content: <BalancesSummary />,
        actions: <SubmitButton label="Confirm" />,
        onSubmit: async ({ goToView }: { goToView: (id: string) => void }) => {
          await new Promise((r) => setTimeout(r, 600));
          goToView('form');
        },
      },
    ];

    return <JumperWidget views={views} style={widgetStyle} />;
  },
  args: {
    views: [],
  },
};
