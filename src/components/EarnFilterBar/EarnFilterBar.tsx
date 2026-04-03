import Stack from '@mui/material/Stack';
import useMediaQuery from '@mui/material/useMediaQuery';
import { formatDistanceToNow } from 'date-fns';
import { useTranslation } from 'react-i18next';

import { useEarnData } from '../../app/ui/earn/EarnFilteringContext';
import { EarnFilterTab } from '../../app/ui/earn/types';
import { Badge } from '../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../Badge/Badge.styles';
import type { EarnCardVariant } from '../Cards/EarnCard/EarnCard.types';
import { EarnFilterBarContentForYou } from './components/EarnFilterBarContentForYou';
import { EarnListMode } from './components/EarnListMode';
import {
  EarnFilterBarContainer,
  EarnFilterBarHeaderContainer,
} from './EarnFilterBar.styles';
import { EarnFilterBarSkeleton } from './EarnFilterBarSkeleton';
import { EarnFilterBarContentAll } from './layouts/EarnFilterBarContentAll';
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
  const { tab, updatedAt } = useEarnData();
  const isTablet = useMediaQuery((theme) => theme.breakpoints.down('md'));

  if (isLoading) {
    return <EarnFilterBarSkeleton />;
  }

  const isForYouTab = EarnFilterTab.FOR_YOU === tab;

  return (
    <>
      <EarnFilterBarContainer>
        <EarnFilterBarHeaderContainer>
          {isTablet ? <EarnFilterViewTablet /> : <EarnFilterViewDesktop />}
          <Stack
            direction="row"
            sx={{
              gap: 1,
              display: 'flex',
              alignItems: 'center',
              flexShrink: 0,
            }}
          >
            <Stack
              direction="row"
              sx={{
                gap: 1,
                display: 'flex',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <EarnListMode variant={variant} setVariant={setVariant} />
            </Stack>
            {!isForYouTab && <EarnFilterBarContentAll />}
          </Stack>
        </EarnFilterBarHeaderContainer>
      </EarnFilterBarContainer>
      {isForYouTab && (
        <EarnFilterBarContainer>
          <EarnFilterBarContentForYou>
            {!isTablet && updatedAt && (
              <Badge
                variant={BadgeVariant.Secondary}
                size={BadgeSize.SM}
                label={t('badge.updated', {
                  time: formatDistanceToNow(updatedAt),
                })}
              />
            )}
          </EarnFilterBarContentForYou>
        </EarnFilterBarContainer>
      )}
    </>
  );
};
