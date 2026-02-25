import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState, useCallback, useMemo } from 'react';
import { JumperWidget } from './JumperWidget';
import { type StatusSheetContent } from './types';
import {
  useWidgetStore,
  useWidgetSubmit,
  useFormValidation,
  createTypedHooks,
} from './store';
import { type NumericSelectValue } from './components/NumericSelect';
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
import { useTokenFormatters } from '@/hooks/tokens/useTokenFormatters';
import {
  defineAmountField,
  defineBalancesMultiSelectField,
  defineChainSingleSelectField,
  defineNumericSelectField,
  defineTokenSingleSelectField,
} from './utils';
import { ChainSingleSelectValue } from './components/Chain';
import { TFunction } from 'i18next';

const meta = {
  title: 'components/composite/JumperWidget',
  component: JumperWidget,
} satisfies Meta<typeof JumperWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

const t = ((key: string) => key) as unknown as TFunction;

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

const SubmitButton = ({ label }: { label: string }) => {
  const { submit, isSubmitting } = useWidgetSubmit();
  const { isValid, isTouched } = useFormValidation();
  return (
    <Button
      variant={Variant.Primary}
      onClick={submit}
      disabled={isSubmitting || (isTouched && !isValid)}
      loading={isSubmitting}
    >
      {label}
    </Button>
  );
};

const fromChainField = defineChainSingleSelectField({
  fieldKey: 'fromChain',
  fieldProps: { availableChains: chains, label: 'From chain' },
  sidePanelProps: { availableChains: chains, header: 'Chains' },
  t,
});

const toChainField = defineChainSingleSelectField({
  fieldKey: 'toChain',
  fieldProps: { availableChains: chains, label: 'To chain' },
  sidePanelProps: { availableChains: chains, header: 'Chains' },
  t,
});

const tokenField = defineTokenSingleSelectField({
  fieldKey: 'token',
  fieldProps: { availableTokens: tokens, label: 'Token' },
  sidePanelProps: { availableTokens: tokens, header: 'Tokens' },
  t,
  deriveProps: (getValue) => {
    const fromChain = getValue('fromChain') as
      | ChainSingleSelectValue
      | undefined;
    if (!fromChain?.selectedChain) return {};
    const filtered = tokens.filter(
      (t) => t.chainId === fromChain.selectedChain,
    );
    return {
      fieldProps: { availableTokens: filtered },
      sidePanelProps: { availableTokens: filtered },
    };
  },
  sanitizeOn: [
    {
      watchKey: 'fromChain',
      sanitize: ({ currentValue, getValue }) => {
        if (!currentValue?.selectedToken) return currentValue;
        const fromChain = getValue('fromChain') as
          | ChainSingleSelectValue
          | undefined;
        if (!fromChain?.selectedChain) return undefined;
        const isStillValid = tokens.some(
          (t) =>
            t.address === currentValue.selectedToken &&
            t.chainId === fromChain.selectedChain,
        );
        return isStillValid ? currentValue : undefined;
      },
    },
  ],
});

const amountField = defineAmountField({
  fieldKey: 'amount',
  defaultValue: { amount: '0', maxAmount: '100000' },
  fieldProps: { label: 'Amount', token: tokens[0] },
  t,
});

const bridgeFields = {
  fromChain: fromChainField,
  toChain: toChainField,
  token: tokenField,
  amount: amountField,
} as const;
const { useValues: useBridgeValues } = createTypedHooks(bridgeFields);

const BridgeSummary = () => {
  const { fromChain, toChain, token, amount } = useBridgeValues();

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

export const Default: Story = {
  render: () => {
    const [sheetOpen, setSheetOpen] = useState(false);
    const [sheetMode, setSheetMode] = useState<'confirmation' | 'success'>(
      'confirmation',
    );

    const handleCloseSheet = useCallback(() => setSheetOpen(false), []);

    const confirmationSheetContent: StatusSheetContent = useMemo(
      () => ({
        title: 'Confirm bridge',
        description: 'Please confirm you want to proceed with this bridge.',
        callToAction: 'Confirm',
        callToActionType: 'submit',
        status: 'info',
        onClick: handleCloseSheet,
      }),
      [handleCloseSheet],
    );

    const successSheetContent: StatusSheetContent = useMemo(
      () => ({
        title: 'Transaction complete',
        description: 'Your request was submitted successfully.',
        callToAction: 'Done',
        callToActionType: 'button',
        status: 'success',
        onClick: handleCloseSheet,
      }),
      [handleCloseSheet],
    );

    const statusSheet = useMemo(
      () => ({
        isOpen: sheetOpen,
        content:
          sheetMode === 'confirmation'
            ? confirmationSheetContent
            : successSheetContent,
        onClose: handleCloseSheet,
      }),
      [
        sheetOpen,
        sheetMode,
        confirmationSheetContent,
        successSheetContent,
        handleCloseSheet,
      ],
    );

    const views = useMemo(
      () => [
        {
          type: 'form' as const,
          id: 'form',
          title: 'Bridge',
          fields: [fromChainField, toChainField, tokenField, amountField],
          actions: <SubmitButton label="Get Quote" />,
          onSubmit: async ({
            goToView,
          }: {
            goToView: (id: string) => void;
          }) => {
            await new Promise((r) => setTimeout(r, 400));
            // Navigate first — sheet opens on top of the destination view.
            goToView('summary');
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
      ],
      [],
    );

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

const dustAmountThreshold = defineNumericSelectField({
  fieldKey: 'amountThreshold',
  defaultValue: { value: 5 },
  fieldProps: { values: [5, 10, 20, 30], label: 'Dust threshold' },
  t,
});

const { useValues: useDustValues } = createTypedHooks({
  amountThreshold: dustAmountThreshold,
});

const BalancesSummary = () => {
  const { amountThreshold } = useDustValues();
  const chain = useWidgetStore(
    (s) =>
      s.values.chain as
        | import('./components/Chain').ChainSingleSelectValue
        | undefined,
  );
  const selectedBalances = useWidgetStore(
    (s) =>
      s.values.balances as
        | import('./components/Balances').BalancesMultiSelectValue
        | undefined,
  );

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

  if (!fromBalances.length || !toBalance || !amountThreshold?.value)
    return null;

  return (
    <Summary
      label="Convert"
      from={fromBalances}
      amountUSD={amountThreshold.value}
      to={toBalance}
      fieldSx={summaryFieldSx}
    />
  );
};

export const Balances: Story = {
  render: () => {
    const { toAmountUSD } = useTokenFormatters();

    const checkBalanceAboveThreshold = useCallback(
      (balance: Balance<ExtendedToken>, minUsd: number) =>
        Number(toAmountUSD(balance)) - minUsd > Number.EPSILON,
      [toAmountUSD],
    );

    const checkChainBalancesAboveThreshold = useCallback(
      (chainId: number, minUsd: number) => {
        const chainBalances = balances.filter(
          (b) => b.token.chainId === chainId,
        );
        return (
          chainBalances.length > 0 &&
          chainBalances.some((b) => checkBalanceAboveThreshold(b, minUsd))
        );
      },
      [checkBalanceAboveThreshold],
    );

    const chainField = useMemo(
      () =>
        defineChainSingleSelectField({
          fieldKey: 'chain',
          fieldProps: { availableChains: chains, label: 'Chain' },
          sidePanelProps: { availableChains: chains, header: 'Chains' },
          t,
          deriveProps: (getValue) => {
            const threshold = getValue('amountThreshold') as
              | NumericSelectValue
              | undefined;
            if (!threshold?.value) return {};
            const filtered = chains.filter((c) =>
              checkChainBalancesAboveThreshold(c.id, threshold.value),
            );
            return {
              fieldProps: { availableChains: filtered },
              sidePanelProps: { availableChains: filtered },
            };
          },
        }),
      [checkChainBalancesAboveThreshold],
    );

    const balancesField = useMemo(
      () =>
        defineBalancesMultiSelectField({
          fieldKey: 'balances',
          schemaOptions: { min: 1, max: 10 },
          fieldProps: { availableBalances: balances, label: 'Convert' },
          sidePanelProps: { availableBalances: balances, header: 'Tokens' },
          t,
          deriveProps: (getValue) => {
            const threshold = getValue('amountThreshold') as
              | NumericSelectValue
              | undefined;
            const chain = getValue('chain') as
              | ChainSingleSelectValue
              | undefined;
            if (!chain?.selectedChain || !threshold?.value) {
              return {
                fieldProps: { availableBalances: [] },
                sidePanelProps: { availableBalances: [] },
              };
            }
            const filtered = balances
              .filter((b) => b.token.chainId === chain.selectedChain)
              .filter((b) => checkBalanceAboveThreshold(b, threshold.value));
            return {
              fieldProps: { availableBalances: filtered },
              sidePanelProps: { availableBalances: filtered },
            };
          },
          sanitizeOn: [
            {
              watchKey: 'chain',
              sanitize: ({ currentValue, getValue }) => {
                if (!currentValue?.selectedAddresses?.length)
                  return currentValue;
                const chain = getValue('chain') as
                  | ChainSingleSelectValue
                  | undefined;
                const threshold = getValue('amountThreshold') as
                  | NumericSelectValue
                  | undefined;
                if (!chain?.selectedChain) return undefined;
                const validAddresses = balances
                  .filter((b) => b.token.chainId === chain.selectedChain)
                  .filter((b) =>
                    threshold?.value
                      ? checkBalanceAboveThreshold(b, threshold.value)
                      : true,
                  )
                  .map((b) => b.token.address);
                const stillValid = currentValue.selectedAddresses.filter((a) =>
                  validAddresses.includes(a),
                );
                return stillValid.length > 0
                  ? { selectedAddresses: stillValid }
                  : undefined;
              },
            },
            {
              watchKey: 'amountThreshold',
              sanitize: ({ currentValue, getValue }) => {
                if (!currentValue?.selectedAddresses?.length)
                  return currentValue;
                const chain = getValue('chain') as
                  | ChainSingleSelectValue
                  | undefined;
                const threshold = getValue('amountThreshold') as
                  | NumericSelectValue
                  | undefined;
                if (!threshold?.value) return currentValue;
                const validAddresses = balances
                  .filter((b) =>
                    chain?.selectedChain
                      ? b.token.chainId === chain.selectedChain
                      : true,
                  )
                  .filter((b) => checkBalanceAboveThreshold(b, threshold.value))
                  .map((b) => b.token.address);
                const stillValid = currentValue.selectedAddresses.filter((a) =>
                  validAddresses.includes(a),
                );
                return stillValid.length > 0
                  ? { selectedAddresses: stillValid }
                  : undefined;
              },
            },
          ],
        }),
      [checkBalanceAboveThreshold],
    );

    const views = useMemo(
      () => [
        {
          type: 'form' as const,
          id: 'form',
          title: 'Convert dust',
          fields: [dustAmountThreshold, chainField, balancesField],
          actions: <SubmitButton label="Review" />,
          onSubmit: async ({
            goToView,
          }: {
            goToView: (id: string) => void;
          }) => {
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
          onSubmit: async ({
            goToView,
          }: {
            goToView: (id: string) => void;
          }) => {
            await new Promise((r) => setTimeout(r, 600));
            goToView('form');
          },
        },
      ],
      [chainField, balancesField],
    );

    return <JumperWidget views={views} style={widgetStyle} />;
  },
  args: {
    views: [],
  },
};
