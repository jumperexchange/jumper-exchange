'use client';

import { SectionCard } from '@/components/Cards/SectionCard/SectionCard';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import {
  type FormState,
  LiFiWidget,
  WidgetSkeleton as LifiWidgetSkeleton,
  useWidgetEvents,
  WidgetEvent,
} from '@lifi/widget';
import type { FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { PortfolioWidgetVariants } from './types';
import { useTranslation } from 'react-i18next';

interface PortfolioWidgetProps {
  widgetVariants: PortfolioWidgetVariants[];
  disabledWidgetVariants: PortfolioWidgetVariants[];
  earnOpportunities?: EarnOpportunityWithLatestAnalytics[];
  portfolioPositions?: PortfolioPosition[];
  minFromAmountUSD?: number;
  onRouteCompleted?: () => void;
}

export const PortfolioWidget: FC<PortfolioWidgetProps> = ({
  widgetVariants,
  disabledWidgetVariants,
  earnOpportunities,
  portfolioPositions,
  minFromAmountUSD,
  onRouteCompleted,
}) => {
  const { t } = useTranslation();
  const formRef = useRef<FormState>(null);
  const [selectedView, setSelectedView] = useState<
    'main' | 'market' | 'position'
  >('main');
  const [selectedEarnOpportunity, setSelectedEarnOpportunity] =
    useState<EarnOpportunityWithLatestAnalytics | null>(null);
  const [selectedPosition, setSelectedPosition] =
    useState<PortfolioPosition | null>(null);
  const [isLifiWidgetMainPage, setIsLifiWidgetMainPage] = useState(true);
  const [widgetVariant, setWidgetVariant] = useState<PortfolioWidgetVariants>(
    widgetVariants[0],
  );

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
    setIsLifiWidgetMainPage(page === '/');
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

    widgetEvents.on(
      WidgetEvent.RouteExecutionCompleted,
      onRouteExecutionCompleted,
    );
    widgetEvents.on(WidgetEvent.ContactSupport, onRouteContactSupport);

    return () => {
      widgetEvents.off(
        WidgetEvent.RouteExecutionCompleted,
        onRouteExecutionCompleted,
      );
      widgetEvents.off(WidgetEvent.ContactSupport, onRouteContactSupport);
    };
  }, [widgetEvents, onRouteCompleted, setSupportModalState]);

  const handleSelectMarket = (market: EarnOpportunityWithLatestAnalytics) => {
    setSelectedEarnOpportunity(market);
    setSelectedView('main');
  };

  const handleSelectPosition = (position: PortfolioPosition) => {
    setSelectedPosition(position);
    setSelectedView('main');
  };

  const {
    config: widgetConfig,
    depositContractProps,
    isReady,
  } = usePortfolioWidgetConfig(
    widgetVariant,
    selectedEarnOpportunity,
    selectedPosition,
    minFromAmountUSD,
  );

  return (
    <SectionCard
      sx={{
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
        ...(selectedView !== 'main' && {
          '& [id^="widget-app-expanded-container"]': {
            display: 'none',
          },
        }),
      }}
    >
      {isLifiWidgetMainPage && selectedView === 'main' && (
        <HeaderContainer>
          <Select
            options={options}
            value={widgetVariant}
            onChange={handleWidgetVariantChange}
            label={'Select'}
            variant={SelectVariant.Single}
            fullWidth
            data-testid="widget-variant-select"
          />
        </HeaderContainer>
      )}
      {isLifiWidgetMainPage &&
        widgetVariant === PortfolioWidgetVariants.Deposit &&
        selectedView === 'main' &&
        isReady && (
          <PortfolioSelectField
            item={selectedEarnOpportunity}
            label={t('widget.portfolio.labels.depositTo')}
            placeholder={t('widget.portfolio.labels.selectMarket')}
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
            sx={{ paddingTop: 1.5, paddingBottom: 0.5 }}
          />
        )}

      {isLifiWidgetMainPage &&
        widgetVariant === PortfolioWidgetVariants.Withdraw &&
        selectedView === 'main' &&
        isReady && (
          <PortfolioSelectField
            item={selectedPosition}
            label={t('widget.portfolio.labels.selectPosition')}
            placeholder={t('widget.portfolio.labels.selectPosition')}
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
            sx={{ paddingTop: 1.5, paddingBottom: 0.5 }}
          />
        )}

      {isReady ? (
        <LiFiWidget
          key={widgetVariant}
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
      ) : (
        <LifiWidgetSkeleton config={widgetConfig} />
      )}

      {widgetVariant === PortfolioWidgetVariants.Deposit &&
        selectedView === 'market' && (
          <PortfolioSelectView
            header={t('widget.portfolio.labels.selectMarket')}
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
            header={t('widget.portfolio.labels.selectPosition')}
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
