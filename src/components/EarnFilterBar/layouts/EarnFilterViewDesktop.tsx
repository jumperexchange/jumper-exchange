import { useEarnFiltering } from '@/app/ui/earn/EarnFilteringContext';
import { EarnFilterTab } from '@/app/ui/earn/types';
import type { HorizontalTabItem } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '@/components/HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '@/components/HorizontalTabs/HorizontalTabs.style';
import { useTranslation } from 'react-i18next';

export const EarnFilterViewDesktop = () => {
  const { t } = useTranslation();
  const { changeTab, tab } = useEarnFiltering();

  const tabOptions: HorizontalTabItem[] = [
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

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    const _value = value as EarnFilterTab;
    changeTab(_value);
  };
  return (
    <HorizontalTabs
      tabs={tabOptions}
      value={tab}
      size={HorizontalTabSize.MD}
      data-testid="earn-filter-tabs"
      onChange={handleTabChange}
      sx={(theme) => ({
        flex: '0 0 auto',
        backgroundColor: `${(theme.vars || theme).palette.alpha100.main} !important`,
        '.MuiTabs-list': {
          gap: theme.spacing(0.5),
        },
      })}
    />
  );
};
