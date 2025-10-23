import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import {
  EarnFilterBarContainer,
  EarnFilterBarHeaderContainer,
} from './EarnFilterBar.styles';
import {
  HorizontalTabItem,
  HorizontalTabs,
} from '../HorizontalTabs/HorizontalTabs';
import { HorizontalTabSize } from '../HorizontalTabs/HorizontalTabs.style';
import { EarnFilterBarContentForYou } from './components/EarnFilterBarContentForYou';
import { EarnFilterBarContentAll } from './components/EarnFilterBarContentAll';
import Stack from '@mui/material/Stack';
import { EarnListMode } from './components/EarnListMode';
import { EarnFilterSort } from './components/EarnFilterSort';
import { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { EarnFilterBarSkeleton } from './EarnFilterBarSkeleton';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import { Badge } from '../Badge/Badge';

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
  const { showForYou, toggleForYou } = useEarnFiltering();

  const tabOptions: HorizontalTabItem[] = [
    {
      value: 'foryou',
      label: 'For You',
      'data-testid': 'earn-filter-tab-foryou',
    },
    {
      value: 'all',
      label: 'All Markets',
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
    : EarnFilterBarContentAll;

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
          })}
        />
        {/* TODO: add latest update in backend and render here */}
        <Badge
          variant={BadgeVariant.Secondary}
          size={BadgeSize.SM}
          label="Updated 12 hours ago"
        />
      </EarnFilterBarHeaderContainer>
      <EarnFilterBarContent>
        <Stack direction="row" gap={1} alignItems="center" flexShrink={0}>
          <EarnListMode variant={variant} setVariant={setVariant} />
          {!showForYou && <EarnFilterSort />}
        </Stack>
      </EarnFilterBarContent>
    </EarnFilterBarContainer>
  );
};
