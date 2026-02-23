import { Button } from '@/components/core/buttons/Button/Button';
import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'react-i18next';
import { EntityStack } from '../EntityStack/EntityStack';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useDustBalances } from './hooks/useDustBalances';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { type FC, useMemo } from 'react';
import { uniqBy } from 'lodash';
import {
  DustBannerContainer,
  DustBannerContentContainer,
} from './DustFlow.styles';

interface DustBannerProps {
  forceDisplay?: boolean;
  onClick: () => void;
}

export const DustBanner: FC<DustBannerProps> = ({
  forceDisplay = false,
  onClick,
}) => {
  const { t } = useTranslation();
  const { nonNativeBalances } = useDustBalances();
  const { toDisplayAggregatedAmountUSD } = usePortfolioFormatters();

  const tokens = useMemo(() => {
    return uniqBy(
      nonNativeBalances.map((balance) => balance.token),
      'symbol',
    );
  }, [nonNativeBalances]);

  const totalUSD = toDisplayAggregatedAmountUSD(nonNativeBalances);

  if (!tokens.length && !forceDisplay) {
    return null;
  }

  return (
    <DustBannerContainer>
      <DustBannerContentContainer>
        <EntityStack
          entities={tokens}
          size={AvatarSize.MD}
          disableBorder
          avatarSx={(theme) => ({
            border: `2px solid ${(theme.vars || theme).palette.surface1.main}`,
          })}
        />
        <Typography variant="bodyXSmall">
          <Trans
            i18nKey="portfolio.dustConversion.banner"
            values={{ value: totalUSD }}
          />
        </Typography>
      </DustBannerContentContainer>
      <Button onClick={onClick}>{t('buttons.convertDust')}</Button>
    </DustBannerContainer>
  );
};
