import { useEarnFiltering } from '@/app/ui/earn/EarnFilteringContext';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { EarnFilterTab } from '@/app/ui/earn/types';
import { SelectVariant } from '@/components/core/form/Select/Select.types';
import { Select } from '@/components/core/form/Select/Select';

export const EarnFilterViewTablet = () => {
  const { t } = useTranslation();
  const { changeTab, showForYou, showYourPositions } = useEarnFiltering();

  const options = useMemo(() => {
    return [
      {
        value: EarnFilterTab.FOR_YOU,
        label: t('earn.views.forYou'),
        'data-testid': 'earn-filter-tab-foryou',
      },
      {
        value: EarnFilterTab.ALL,
        label: t(`earn.views.allMarkets`),
        'data-testid': 'earn-filter-tab-all',
      },
      {
        value: EarnFilterTab.YOUR_POSITIONS,
        label: t('earn.views.yourPositions'),
        'data-testid': 'earn-filter-tab-your-positions',
      },
    ];
  }, [t]);

  const value = useMemo(() => {
    return showForYou
      ? EarnFilterTab.FOR_YOU
      : showYourPositions
        ? EarnFilterTab.YOUR_POSITIONS
        : EarnFilterTab.ALL;
  }, [showForYou, showYourPositions]);

  const handleChange = (value: string) => {
    const _value = value as EarnFilterTab;
    changeTab(_value);
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={handleChange}
      label={t('earn.views.viewBy')}
      variant={SelectVariant.Single}
      data-testid="earn-filter-tab"
      menuPlacementX="right"
    />
  );
};
