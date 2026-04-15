import type { FC, PropsWithChildren } from 'react';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { EarnAnimatedLayoutContainer } from '../components/EarnAnimatedLayoutContainer';
import {
  EarnFilterBarClearFiltersButton,
  EarnFilterBarContentContainer,
} from '../EarnFilterBar.styles';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useEarnFilterBar } from '../hooks';
import { useTranslation } from 'react-i18next';
import AutoAwesomeRoundedIcon from '@mui/icons-material/AutoAwesomeRounded';

export const EarnFilterBarContentAllDesktop: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();
  const {
    chainOptions,
    protocolOptions,
    tagOptions,
    assetOptions,
    hasFilterApplied,
    filter,
    apyMinValue,
    apyMaxValue,
    apyMin,
    apyMax,
    tvlMinValue,
    tvlMaxValue,
    tvlMin,
    tvlMax,
    rewardsAPYOptions,
    rewardsAPYValue,
    handleChainChange,
    handleProtocolChange,
    handleTagChange,
    handleAssetChange,
    handleAPYChange,
    handleTVLChange,
    handleRewardsAPYChange,
    handleClearAllFilters,
  } = useEarnFilterBar();

  return (
    <EarnFilterBarContentContainer
      sx={{ alignItems: hasFilterApplied ? 'flex-start' : 'center' }}
    >
      <EarnAnimatedLayoutContainer>
        {chainOptions.length > 1 && (
          <Select
            options={chainOptions}
            value={filter?.chains?.map(String) ?? []}
            onChange={handleChainChange}
            filterBy="chain"
            label={t('earn.filter.chain')}
            variant={SelectVariant.Multi}
            data-testid="earn-filter-chain-select"
          />
        )}
        {protocolOptions.length > 1 && (
          <Select
            options={protocolOptions}
            value={filter?.protocols || []}
            onChange={handleProtocolChange}
            filterBy="protocol"
            label={t('earn.filter.protocol')}
            variant={SelectVariant.Multi}
            data-testid="earn-filter-protocol-select"
          />
        )}

        {tagOptions.length > 1 && (
          <Select
            options={tagOptions}
            value={filter?.tags || []}
            onChange={handleTagChange}
            filterBy="tag"
            label={t('earn.filter.tag')}
            variant={SelectVariant.Multi}
            data-testid="earn-filter-tag-select"
          />
        )}

        {assetOptions.length > 1 && (
          <Select
            options={assetOptions}
            value={filter?.assets || []}
            onChange={handleAssetChange}
            filterBy="asset"
            label={t('earn.filter.asset')}
            variant={SelectVariant.Multi}
            data-testid="earn-filter-asset-select"
          />
        )}

        {!isNaN(apyMin) && !isNaN(apyMax) && apyMin !== apyMax && (
          <Select
            options={[]}
            value={[apyMinValue, apyMaxValue]}
            min={apyMin}
            max={apyMax}
            onChange={handleAPYChange}
            label={t('earn.filter.apy')}
            variant={SelectVariant.Slider}
            data-testid="earn-filter-apy-select"
          />
        )}

        {!isNaN(tvlMin) && !isNaN(tvlMax) && tvlMin !== tvlMax && (
          <Select
            options={[]}
            value={[tvlMinValue, tvlMaxValue]}
            min={tvlMin}
            max={tvlMax}
            onChange={handleTVLChange}
            label={t('earn.filter.tvl')}
            variant={SelectVariant.Slider}
            data-testid="earn-filter-tvl-select"
          />
        )}
        {rewardsAPYOptions.length > 0 && (
          <Select
            options={rewardsAPYOptions}
            value={rewardsAPYValue ? [rewardsAPYValue] : []}
            onChange={handleRewardsAPYChange}
            label={t('earn.filter.rewards.label')}
            labelIcon={
              <AutoAwesomeRoundedIcon sx={{ height: 16, width: 16 }} />
            }
            variant={SelectVariant.Multi}
            data-testid="earn-filter-rewards-select"
          />
        )}
        {hasFilterApplied && (
          <EarnFilterBarClearFiltersButton
            onClick={handleClearAllFilters}
            data-testid="earn-filter-clear-filters-button"
          >
            <DeleteOutlinedIcon sx={{ height: 22, width: 22 }} />
          </EarnFilterBarClearFiltersButton>
        )}
      </EarnAnimatedLayoutContainer>

      {children}
    </EarnFilterBarContentContainer>
  );
};
