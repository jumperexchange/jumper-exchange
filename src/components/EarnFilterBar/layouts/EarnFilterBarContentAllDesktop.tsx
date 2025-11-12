import { FC, PropsWithChildren } from 'react';
import { Select } from '../../core/form/Select/Select';
import { SelectVariant } from '../../core/form/Select/Select.types';
import { EarnAnimatedLayoutContainer } from '../components/EarnAnimatedLayoutContainer';
import {
  EarnFilterBarClearFiltersButton,
  EarnFilterBarContentContainer,
} from '../EarnFilterBar.styles';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useEarnFilterBar } from '../hooks';
import { useTranslation } from 'react-i18next';

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
    handleChainChange,
    handleProtocolChange,
    handleTagChange,
    handleAssetChange,
    handleAPYChange,
    handleClearAllFilters,
  } = useEarnFilterBar();

  return (
    <EarnFilterBarContentContainer>
      <EarnAnimatedLayoutContainer>
        {chainOptions.length > 0 && (
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
        {protocolOptions.length > 0 && (
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

        {tagOptions.length > 0 && (
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

        {assetOptions.length > 0 && (
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

        {hasFilterApplied && (
          <EarnFilterBarClearFiltersButton
            onClick={handleClearAllFilters}
            data-testid="earn-filter-clear-filters-button"
          >
            <DeleteOutlineIcon sx={{ height: 22, width: 22 }} />
          </EarnFilterBarClearFiltersButton>
        )}
      </EarnAnimatedLayoutContainer>

      {children}
    </EarnFilterBarContentContainer>
  );
};
