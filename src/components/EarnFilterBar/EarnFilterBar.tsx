import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useEarnFiltering } from '../../app/ui/earn/EarnFilteringContext';
import { EarnFilterTab } from '../../app/ui/earn/types';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import type { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
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
import { EarnFilterViewDesktop } from './layouts/EarnFilterViewDesktop';
import { EarnFilterViewTablet } from './layouts/EarnFilterViewTablet';

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
  const { t } = useTranslation();
  const { tab, updatedAt } = useEarnFiltering();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

  if (isLoading) {
    return <EarnFilterBarSkeleton />;
  }

  const isForYouTab = EarnFilterTab.FOR_YOU === tab;

  const EarnFilterBarContent = isForYouTab
    ? EarnFilterBarContentForYou
    : EarnFilterBarContentAllDesktop;

  return (
    <EarnFilterBarContainer>
      <EarnFilterBarHeaderContainer>
        {isTablet ? <EarnFilterViewTablet /> : <EarnFilterViewDesktop />}
        {!isTablet && updatedAt && (
          <Badge
            variant={BadgeVariant.Secondary}
            size={BadgeSize.SM}
            label={t('badge.updated', { time: formatDistanceToNow(updatedAt) })}
          />
        )}
        {isTablet && !isForYouTab && <EarnFilterBarContentAllTablet />}
      </EarnFilterBarHeaderContainer>
      {!isTablet && (
        <EarnFilterBarContent>
          <Stack
            direction="row"
            sx={{
              gap: 1,
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <EarnListMode variant={variant} setVariant={setVariant} />
            {!isForYouTab && <EarnFilterSort />}
          </Stack>
        </EarnFilterBarContent>
      )}
    </EarnFilterBarContainer>
  );
};
