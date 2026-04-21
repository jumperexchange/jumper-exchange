'use client';

import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import {
  type FormFieldChanged,
  type FormState,
  LiFiWidget,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import debounce from 'lodash/debounce';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { WidgetEventsConfig } from '../../WidgetEventsManager';
import {
  setupWidgetEvents,
  teardownWidgetEvents,
} from '../../WidgetEventsManager';
import { capitalizeString } from '@/utils/capitalizeString';
import type { EarnOpportunityWithLatestAnalytics } from '@/types/jumper-backend';
import { HeaderContainer } from '@/components/composite/JumperWidget/JumperWidget.style';
import type { PortfolioPosition } from '@/providers/PortfolioProvider/types';
import { EntityStackWithBadge } from '@/components/composite/EntityStackWithBadge/EntityStackWithBadge';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { PortfolioSelectField } from './PortfolioSelectField';
import { PortfolioSelectView } from './PortfolioSelectView';
import { useMenuStore } from '@/stores/menu';
import { ZapDepositSettings } from '../base/ZapWidget/ZapDepositSettings';
import { usePortfolioWidgetConfig } from '../widgetConfig/usePortfolioWidgetConfig';
import { useLoopoorMaxLeverage } from '@/hooks/loopoor/useLoopoorMaxLeverage';
import {
  LOOPOOR_LEVERAGE_FACTOR_SESSION_STORAGE_KEY,
  LOOPOOR_MARKET_ID_SESSION_STORAGE_KEY,
} from 'src/const/loopoor';
import { useTokenAmountInput } from '@/hooks/tokens/useTokenAmountInput';
import { PortfolioBorrowBreakdown } from './PortfolioBorrowBreakdown';
import { PortfolioLeverageField } from './PortfolioLeverageField';
import { PortfolioWidgetVariants } from './types';
import type { SxProps, Theme } from '@mui/material/styles';
import { mergeSx } from '@/utils/theme/mergeSx';
import Typography from '@mui/material/Typography';

interface PortfolioWidgetProps {
  widgetVariants: PortfolioWidgetVariants[];
  disabledWidgetVariants: PortfolioWidgetVariants[];
  earnOpportunities?: EarnOpportunityWithLatestAnalytics[];
  portfolioPositions?: PortfolioPosition[];
  minFromAmountUSD?: number;
  marketId?: string;
  onRouteCompleted?: () => void;
  sx?: SxProps<Theme>;
}

export const PortfolioWidget: FC<PortfolioWidgetProps> = ({
  widgetVariants,
  disabledWidgetVariants,
  earnOpportunities,
  portfolioPositions,
  minFromAmountUSD,
  marketId,
  onRouteCompleted,
  sx,
}) => {
  const formRef = useRef<FormState>(null);
  const [selectedView, setSelectedView] = useState<
    'main' | 'market' | 'position'
  >('main');
  const [selectedEarnOpportunity, setSelectedEarnOpportunity] =
    useState<EarnOpportunityWithLatestAnalytics | null>(
      earnOpportunities?.[0] ?? null,
    );
  const [selectedPosition, setSelectedPosition] =
    useState<PortfolioPosition | null>(portfolioPositions?.[0] ?? null);
  const [isLifiWidgetMainPage, setIsLifiWidgetMainPage] = useState(true);
  const [widgetVariant, setWidgetVariant] = useState<PortfolioWidgetVariants>(
    widgetVariants[0],
  );
  const [leverageFactor, setLeverageFactor] = useState(1);
  const [debouncedLeverageFactor, setDebouncedLeverageFactor] = useState(1);
  const debouncedSetLeverageFactor = useRef(
    debounce((value: number) => setDebouncedLeverageFactor(value), 300),
  ).current;
  useEffect(
    () => () => debouncedSetLeverageFactor.cancel(),
    [debouncedSetLeverageFactor],
  );
  const handleLeverageChange = useCallback(
    (value: number) => {
      setLeverageFactor(value);
      debouncedSetLeverageFactor(value);
    },
    [debouncedSetLeverageFactor],
  );
  const [debouncedFromAmount, setDebouncedFromAmount] = useState<
    string | undefined
  >(undefined);
  const debouncedSetFromAmount = useRef(
    debounce((value: string | undefined) => setDebouncedFromAmount(value), 300),
  ).current;
  useEffect(
    () => () => debouncedSetFromAmount.cancel(),
    [debouncedSetFromAmount],
  );
  const [borrowBreakdownContainer, setBorrowBreakdownContainer] =
    useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (widgetVariant !== PortfolioWidgetVariants.Borrow) {
      return;
    }
    if (marketId) {
      sessionStorage.setItem(LOOPOOR_MARKET_ID_SESSION_STORAGE_KEY, marketId);
    }
    sessionStorage.setItem(
      LOOPOOR_LEVERAGE_FACTOR_SESSION_STORAGE_KEY,
      String(debouncedLeverageFactor),
    );
    return () => {
      sessionStorage.removeItem(LOOPOOR_MARKET_ID_SESSION_STORAGE_KEY);
      sessionStorage.removeItem(LOOPOOR_LEVERAGE_FACTOR_SESSION_STORAGE_KEY);
    };
  }, [widgetVariant, marketId, debouncedLeverageFactor]);

  useEffect(() => {
    if (widgetVariant !== PortfolioWidgetVariants.Borrow) {
      return;
    }

    let container: HTMLDivElement | null = null;

    // Re-derive pageContainer fresh every call so navigation to/from main page
    // always resolves to the current DOM element rather than a stale reference.
    const reposition = () => {
      if (!isLifiWidgetMainPage) {
        container?.remove();
        return;
      }

      const scrollableContainer = document.querySelector(
        '[id^="widget-scrollable-container"]',
      );
      const pageContainer =
        scrollableContainer?.firstElementChild?.lastElementChild;
      const primaryButton = pageContainer?.querySelector(
        'button.MuiButton-containedPrimary',
      );

      if (!primaryButton || !pageContainer) {
        return;
      }

      let anchor: Element = primaryButton;
      while (anchor.parentElement && anchor.parentElement !== pageContainer) {
        anchor = anchor.parentElement;
      }
      // Insert above the MainWarningMessages Collapse wrapper (always present in
      // DOM as the sibling just before the button box), so the breakdown appears
      // above any alert that may animate in.
      const insertionAnchor = anchor.previousElementSibling ?? anchor;

      if (!container) {
        container = document.createElement('div');
        setBorrowBreakdownContainer(container);
      }
      if (container.nextElementSibling !== insertionAnchor) {
        pageContainer.insertBefore(container, insertionAnchor);
      }
    };

    // Observe the stable outer widget shell — it persists across page
    // navigations inside the widget, so we never lose track of the button.
    const widgetRoot = document.querySelector(
      '[id^="widget-app-expanded-container"]',
    );
    // Fall back to document.body on initial render when the widget root hasn't
    // mounted yet; the body observer catches the widget appearing in the DOM.
    const observer = new MutationObserver(reposition);
    observer.observe(widgetRoot ?? document.body, {
      childList: true,
      subtree: true,
    });
    reposition();

    return () => {
      observer.disconnect();
      container?.remove();
      setBorrowBreakdownContainer(null);
    };
  }, [widgetVariant, isLifiWidgetMainPage]);

  const chainId = selectedEarnOpportunity?.asset.chain.chainId;
  const { data: maxLeverageData } = useLoopoorMaxLeverage({
    chainId,
    marketId,
  });
  const maxLeverageFactor = maxLeverageData?.maxLeverageFactor;

  const { toRawAmount } = useTokenAmountInput();
  const amountWei = useMemo(() => {
    if (!debouncedFromAmount || !selectedEarnOpportunity) {
      return undefined;
    }
    const raw = toRawAmount(
      debouncedFromAmount,
      selectedEarnOpportunity.asset.decimals,
    );
    return raw > 0n ? raw.toString() : undefined;
  }, [debouncedFromAmount, selectedEarnOpportunity, toRawAmount]);

  const handleWidgetVariantChange = (value: string) => {
    setWidgetVariant(value as PortfolioWidgetVariants);
  };

  const options = useMemo(() => {
    return Object.values(widgetVariants).map((variant) => ({
      value: variant,
      label: capitalizeString(variant),
      disabled: disabledWidgetVariants.includes(variant),
    }));
  }, [widgetVariants, disabledWidgetVariants]);

  const widgetEvents = useWidgetEvents();

  const pageEntered = useCallback((page: string) => {
    const isMain = page === '/';
    setIsLifiWidgetMainPage(isMain);
  }, []);

  useEffect(() => {
    const config: WidgetEventsConfig = {
      pageEntered,
    };

    setupWidgetEvents(config, widgetEvents);

    return () => {
      teardownWidgetEvents(config, widgetEvents);
    };
  }, [pageEntered, widgetEvents]);

  const [setSupportModalState] = useMenuStore((state) => [
    state.setSupportModalState,
  ]);

  useEffect(() => {
    const onRouteExecutionCompleted = () => onRouteCompleted?.();
    const onRouteContactSupport = () => setSupportModalState(true);

    const onFormFieldChanged = (fieldChange: FormFieldChanged) => {
      if (fieldChange?.fieldName === 'fromAmount') {
        debouncedSetFromAmount(fieldChange.newValue || undefined);
      }
    };

    const config: WidgetEventsConfig = {
      routeExecutionCompleted: onRouteExecutionCompleted,
      contactSupport: onRouteContactSupport,
      formFieldChanged: onFormFieldChanged,
    };

    setupWidgetEvents(config, widgetEvents);

    return () => {
      teardownWidgetEvents(config, widgetEvents);
    };
  }, [
    widgetEvents,
    onRouteCompleted,
    setSupportModalState,
    debouncedSetFromAmount,
  ]);

  const handleSelectMarket = (market: EarnOpportunityWithLatestAnalytics) => {
    setSelectedEarnOpportunity(market);
    setSelectedView('main');
  };

  const handleSelectPosition = (position: PortfolioPosition) => {
    setSelectedPosition(position);
    setSelectedView('main');
  };

  const { config: widgetConfig, depositContractProps } =
    usePortfolioWidgetConfig(
      widgetVariant,
      selectedEarnOpportunity,
      selectedPosition,
      minFromAmountUSD,
    );

  return (
    <SectionCard
      sx={mergeSx(
        {
          padding: 0,
          overflow: 'hidden',
          '& .MuiContainer-root': {
            maxWidth: '100%',
          },
          ...(isLifiWidgetMainPage && {
            '& [id^="widget-header"], & .MuiAppBar-root': {
              display: 'none',
            },
          }),
          ...(isLifiWidgetMainPage &&
            widgetVariant !== 'deposit' &&
            widgetVariant !== 'withdraw' &&
            widgetVariant !== 'borrow' && {
              '& [id^="widget-app-expanded-container"]': {
                mt: 2,
              },
            }),
          ...(selectedView !== 'main' && {
            '& [id^="widget-app-expanded-container"]': {
              display: 'none',
            },
          }),
        },
        sx,
      )}
    >
      {isLifiWidgetMainPage && selectedView === 'main' && (
        <HeaderContainer>
          {options.length > 1 ? (
            <Select
              options={options}
              value={widgetVariant}
              onChange={handleWidgetVariantChange}
              label={'Select'}
              variant={SelectVariant.Single}
              fullWidth
              data-testid="widget-variant-select"
            />
          ) : (
            <Typography variant="titleSmall">
              {capitalizeString(widgetVariant)}
            </Typography>
          )}
        </HeaderContainer>
      )}
      {isLifiWidgetMainPage &&
        widgetVariant === PortfolioWidgetVariants.Deposit &&
        selectedView === 'main' && (
          <PortfolioSelectField
            item={selectedEarnOpportunity}
            label="Deposit to"
            placeholder="Select market"
            renderStartAdornment={(i) => (
              <EntityStackWithBadge
                addressOverride={i.lpToken?.address}
                entities={[i.protocol!]}
                size={AvatarSize.XL}
                badgeEntities={[i.asset.chain]}
                content={{
                  title: i.name || i.protocol?.product || i.protocol?.name,
                }}
              />
            )}
            onClick={() => setSelectedView('market')}
          />
        )}

      {isLifiWidgetMainPage &&
        widgetVariant === PortfolioWidgetVariants.Withdraw &&
        selectedView === 'main' && (
          <PortfolioSelectField
            item={selectedPosition}
            label="Select position"
            placeholder="Select position"
            renderStartAdornment={(i) => (
              <EntityStackWithBadge
                addressOverride={i.lpToken?.token.address}
                entities={[i.protocol!]}
                size={AvatarSize.XL}
                badgeEntities={
                  i.lpToken?.token.chain ? [i.lpToken.token.chain] : []
                }
                content={{
                  title: i.name || i.protocol?.product || i.protocol?.name,
                }}
              />
            )}
            // TODO: add renderEndAdornment with TitleWithHint showing token amount/amountUSD
            // once the target token for position balance display is determined
            onClick={() => setSelectedView('position')}
          />
        )}

      {isLifiWidgetMainPage &&
        selectedView === 'main' &&
        widgetVariant === PortfolioWidgetVariants.Borrow && (
          <PortfolioLeverageField
            value={leverageFactor}
            max={maxLeverageFactor}
            onChange={handleLeverageChange}
          />
        )}

      <LiFiWidget
        formRef={formRef}
        config={widgetConfig}
        integrator={widgetConfig.integrator}
        {...(depositContractProps && {
          contractComponent: (
            <ZapDepositSettings
              toChainId={depositContractProps.toChainId}
              toTokenAddress={depositContractProps.toTokenAddress}
              contractCalls={[]}
            />
          ),
        })}
      />

      {borrowBreakdownContainer &&
        createPortal(
          <PortfolioBorrowBreakdown
            leverageFactor={debouncedLeverageFactor}
            earnOpportunity={selectedEarnOpportunity}
            marketId={marketId}
            amountWei={amountWei}
          />,
          borrowBreakdownContainer,
        )}

      {widgetVariant === PortfolioWidgetVariants.Deposit &&
        selectedView === 'market' && (
          <PortfolioSelectView
            header="Select market"
            inputId="market"
            onBack={() => setSelectedView('main')}
            onSelect={handleSelectMarket}
            list={earnOpportunities}
            getItemKey={(i) => i.slug}
            filterItem={(i, s) =>
              i.name.includes(s) ||
              !!i.protocol?.product?.includes(s) ||
              !!i.protocol?.name.includes(s)
            }
            renderItem={(i) => (
              <EntityStackWithBadge
                addressOverride={i.lpToken?.address}
                entities={[i.protocol!]}
                size={AvatarSize.XL}
                badgeEntities={[i.asset.chain]}
                content={{
                  title: i.name || i.protocol?.product || i.protocol?.name,
                }}
              />
            )}
          />
        )}

      {widgetVariant === PortfolioWidgetVariants.Withdraw &&
        selectedView === 'position' && (
          <PortfolioSelectView
            header="Select position"
            inputId="position"
            onBack={() => setSelectedView('main')}
            onSelect={handleSelectPosition}
            list={portfolioPositions}
            getItemKey={(i) => i.lpToken?.token.address ?? i.name}
            filterItem={(i, s) =>
              i.name.includes(s) ||
              !!i.protocol?.product?.includes(s) ||
              !!i.protocol?.name.includes(s)
            }
            renderItem={(i) => (
              <EntityStackWithBadge
                addressOverride={i.lpToken?.token.address}
                entities={[i.protocol!]}
                size={AvatarSize.XL}
                badgeEntities={
                  i.lpToken?.token.chain ? [i.lpToken.token.chain] : []
                }
                content={{
                  title: i.name || i.protocol?.product || i.protocol?.name,
                }}
              />
            )}
          />
        )}
    </SectionCard>
  );
};
