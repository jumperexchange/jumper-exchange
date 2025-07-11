import {
  SmallAvatar,
  TypographyPrimary,
  TypographySecondary,
} from '@/components/Portfolio/Portfolio.styles';
import TokenImage from '@/components/Portfolio/TokenImage';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { CacheToken } from '@/types/portfolio';
import {
  Badge,
  ButtonBase,
  darken,
  Grid,
  Avatar as MuiAvatar,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useMenuStore } from 'src/stores/menu';

interface PortfolioTokenChainButtonProps {
  token: CacheToken;
}

function PortfolioTokenChainButton({ token }: PortfolioTokenChainButtonProps) {
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);
  const { isMainPaths } = useMainPaths();
  const router = useRouter();
  // const { lng } = useParams();
  const { t } = useTranslation();

  return (
    <ButtonBase
      onClick={() => {
        setFrom(token.address, token.chainId);
        setWalletMenuState(false);
        if (!isMainPaths) {
          router.push('/');
        }
      }}
      sx={(theme) => ({
        width: '100%',
        paddingLeft: '20px',
        paddingRight: '16px',
        paddingY: '16px',
        display: 'flex',
        '&:hover': {
          backgroundColor: '#2c2844',
          ...theme.applyStyles('light', {
            backgroundColor: darken(theme.palette.surface2.main, 0.04),
          }),
        },
        '&:last-child:hover': {
          borderRadius: '0 0 16px 16px',
        },
      })}
    >
      <Grid container display="flex" alignItems="center" sx={{ width: '100%' }}>
        <Grid textAlign="left" size={2}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              <SmallAvatar>
                <TokenImage
                  token={{
                    logoURI: token.chainLogoURI,
                    name: token.chainName ?? '',
                  }}
                />
              </SmallAvatar>
            }
          >
            <MuiAvatar sx={{ width: 32, height: 32 }}>
              <TokenImage token={token} />
            </MuiAvatar>
          </Badge>
        </Grid>
        <Grid textAlign="left" size={5}>
          <TypographyPrimary
            sx={{ fontSize: '0.875rem', lineHeight: '1.125rem' }}
          >
            {token.symbol}
          </TypographyPrimary>
          <TypographySecondary
            sx={{ fontSize: '0.625rem', lineHeight: '0.875rem' }}
          >
            {token.chainName}
          </TypographySecondary>
        </Grid>
        <Grid style={{ textAlign: 'right' }} size={5}>
          <TypographyPrimary
            sx={{
              fontWeight: 600,
              fontSize: '0.875rem',
              lineHeight: '1.125rem',
            }}
          >
            {t('format.decimal', { value: token.cumulatedBalance })}
          </TypographyPrimary>
          <TypographySecondary
            sx={{
              fontSize: '0.625rem',
              lineHeight: '0.875rem',
            }}
          >
            {t('format.currency', { value: token.totalPriceUSD })}
          </TypographySecondary>
        </Grid>
      </Grid>
    </ButtonBase>
  );
}

export default PortfolioTokenChainButton;
