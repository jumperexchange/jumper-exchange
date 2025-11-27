import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import type { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import type { HorizontalTabItem } from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabs } from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '../HorizontalTabs/HorizontalTabs.style';
import { EarnFilterBarContentForYou } from './components/EarnFilterBarContentForYou';
import { EarnFilterSort } from './components/EarnFilterSort';
import { EarnListMode } from './components/EarnListMode';
import {
  EarnFilterBarContainer,
  EarnFilterBarHeaderContainer,
} from './EarnFilterBar.styles';
import { EarnFilterBarSkeleton } from './EarnFilterBarSkeleton';
import { EarnFilterBarContentAllDesktop } from './layouts/EarnFilterBarContentAllDesktop';
import { EarnFilterBarContentAllTablet } from './layouts/EarnFilterBarContentAllTablet';

export interface EarnFilterBarProps {
  variant: EarnCardVariant;
  setVariant: (variant: EarnCardVariant) => void;
  isLoading?: boolean;
}

export const EarnFilterBar: React.FC<EarnFilterBarProps> = ({
  variant,
  setVariant,
  isLoading,
}) => {
  const { showForYou, toggleForYou, updatedAt } = useEarnFiltering();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const { t } = useTranslation();

  const tabOptions: HorizontalTabItem[] = [
    {
      value: 'foryou',
      label: t('earn.views.forYou'),
      'data-testid': 'earn-filter-tab-foryou',
    },
    {
      value: 'all',
      label: t(`earn.views.${isTablet ? 'all' : 'allMarkets'}`),
      'data-testid': 'earn-filter-tab-all',
    },
  ];

  const handleTabChange = (_: React.SyntheticEvent, value: string) => {
    toggleForYou();
  };

  if (isLoading) {
    return <EarnFilterBarSkeleton />;
  }

  const EarnFilterBarContent = showForYou
    ? EarnFilterBarContentForYou
    : EarnFilterBarContentAllDesktop;

  return (
    <EarnFilterBarContainer>
      <EarnFilterBarHeaderContainer>
        <HorizontalTabs
          tabs={tabOptions}
          value={showForYou ? 'foryou' : 'all'}
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
        {!isTablet && updatedAt && (
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.SM}
            // TODO: i18n date:
            label={`Updated ${formatDistanceToNow(updatedAt)} ago`}
          />
        )}
        {isTablet && !showForYou && <EarnFilterBarContentAllTablet />}
      </EarnFilterBarHeaderContainer>
      {!isTablet && (
        <EarnFilterBarContent>
          <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
            <EarnListMode variant={variant} setVariant={setVariant} />
            {!showForYou && <EarnFilterSort />}
          </Stack>
        </EarnFilterBarContent>
      )}
    </EarnFilterBarContainer>
  );
};
