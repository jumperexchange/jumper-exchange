import { FC, PropsWithChildren } from 'react';
import Typography from '@mui/material/Typography';
import { useTranslation } from 'react-i18next';
import { useEarnFiltering } from 'src/app/ui/earn/EarnFilteringContext';
import { Badge } from '../../Badge/Badge';
import { BadgeSize, BadgeVariant } from '../../Badge/Badge.styles';
import { RecommendationIcon } from '../../illustrations/RecommendationIcon';
import { EarnAnimatedLayoutContainer } from './EarnAnimatedLayoutContainer';
import { EarnFilterBarContentContainer } from '../EarnFilterBar.styles';

export const EarnFilterBarContentForYou: FC<PropsWithChildren> = ({
  children,
}) => {
  const { t } = useTranslation();

  const { totalMarkets, usedYourAddress } = useEarnFiltering();

  const formatedTotalMarkets = totalMarkets.toLocaleString();

  const copy = usedYourAddress
    ? t('earn.copy.forYouBasedOnActivity', {
        totalMarkets: formatedTotalMarkets,
      })
    : t('earn.copy.forYouDefault', { totalMarkets: formatedTotalMarkets });

  return (
    <EarnFilterBarContentContainer>
      {/* Left side: Badge and copy */}
      <EarnAnimatedLayoutContainer>
        <Badge
          variant={BadgeVariant.Secondary}
          size={BadgeSize.LG}
          startIcon={<RecommendationIcon height={20} width={20} />}
        />
        <Typography variant="bodyMediumStrong">{copy}</Typography>
      </EarnAnimatedLayoutContainer>

      {children}
    </EarnFilterBarContentContainer>
  );
};
