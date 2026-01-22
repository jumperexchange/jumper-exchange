import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '@/app/ui/earn/EarnFilteringContext';
import { EarnFilterTab } from '@/app/ui/earn/types';
import { Select } from '@/components/core/form/Select/Select';
import { SelectVariant } from '@/components/core/form/Select/Select.types';

export const EarnFilterViewTablet = () => {
  const { t } = useTranslation();
  const { changeTab, tab } = useEarnFiltering();

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

  const handleChange = (value: string) => {
    changeTab(value as EarnFilterTab);
  };

  return (
    <Select
      options={options}
      value={tab}
      onChange={handleChange}
      label={t('earn.views.viewBy')}
      variant={SelectVariant.Single}
      data-testid="earn-filter-tab"
      menuPlacementX="right"
    />
  );
};
