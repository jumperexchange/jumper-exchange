import { Button } from '@/components/core/buttons/Button/Button';
import Typography from '@mui/material/Typography';
import { Trans, useTranslation } from 'react-i18next';
import { EntityStack } from '../EntityStack/EntityStack';
import { AvatarSize } from '@/components/core/AvatarStack/AvatarStack.types';
import { useDustBalances } from './hooks/useDustBalances';
import { usePortfolioFormatters } from '@/hooks/tokens/usePortfolioFormatters';
import { type FC, useMemo } from 'react';
import { orderBy, uniqBy } from 'lodash';
import {
  DustBannerContainer,
  DustBannerContentContainer,
} from './DustFlow.styles';
import { INITIAL_MAX_THRESHOLD_USD } from './constants';
import useMediaQuery from '@mui/material/useMediaQuery';
import { checkBalanceWithinRange, getChainMinUsdThreshold } from './utils';

interface DustBannerProps {
  forceDisplay?: boolean;
  onClick: () => void;
}

export const DustBanner: FC<DustBannerProps> = ({
  forceDisplay = false,
  onClick,
}) => {
  const { t } = useTranslation();
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const { nonNativeBalances } = useDustBalances();
  const { toDisplayAggregatedAmountUSD } = usePortfolioFormatters();

  const filteredBalances = useMemo(
    () =>
      orderBy(
        nonNativeBalances.filter((balance) =>
          checkBalanceWithinRange(
            balance,
            INITIAL_MAX_THRESHOLD_USD,
            getChainMinUsdThreshold(balance.token.chainId),
          ),
        ),
        'amountUSD',
        'desc',
      ),
    [nonNativeBalances],
  );

  const tokens = useMemo(() => {
    return uniqBy(
      filteredBalances.map((balance) => balance.token),
      'symbol',
    );
  }, [filteredBalances]);

  const totalUSD = toDisplayAggregatedAmountUSD(filteredBalances);

  if (!tokens.length && !forceDisplay) {
    return null;
  }

  return (
    <DustBannerContainer>
      <DustBannerContentContainer>
        <EntityStack
          entities={tokens}
          direction="row-reverse"
          size={AvatarSize.MD}
          limit={3}
          useAvatarOverflow
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
      <Button onClick={onClick} fullWidth={isMobile}>
        {t('buttons.convertDust')}
      </Button>
    </DustBannerContainer>
  );
};
