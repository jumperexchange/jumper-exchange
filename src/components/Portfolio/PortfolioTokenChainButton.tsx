import {
  SmallAvatar,
  TypographyPrimary,
  TypographySecondary,
} from '@/components/Portfolio/Portfolio.styles';
import { Avatar as MuiAvatar, Badge, ButtonBase, Grid } from '@mui/material';
import Image from 'next/image';
import type { ExtendedTokenAmountWithChain } from '@/utils/getTokens';
import { currencyFormatter, decimalFormatter } from '@/utils/formatNumbers';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useParams, useRouter } from 'next/navigation';
import { useMenuStore } from 'src/stores/menu';
import TokenImage from '@/components/Portfolio/TokenImage';

interface PortfolioTokenChainButtonProps {
  token: ExtendedTokenAmountWithChain;
}

function PortfolioTokenChainButton({ token }: PortfolioTokenChainButtonProps) {
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);
  const { isMainPaths } = useMainPaths();
  const router = useRouter();
  const { lng } = useParams();

  return (
    <ButtonBase
      onClick={() => {
        setFrom(token.address, token.chainId);
        setWalletMenuState(false);
        if (!isMainPaths) {
          router.push('/');
        }
      }}
      sx={{
        width: '100%',
        paddingLeft: '20px',
        paddingRight: '16px',
        paddingY: '16px',
        display: 'flex',
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.04)',
        },
        '&:last-child:hover': {
          background: 'rgba(0, 0, 0, 0.04)',
          borderRadius: '0 0 16px 16px',
        },
      }}
    >
      <Grid container display="flex" alignItems="center">
        <Grid item xs={2} textAlign="left">
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
        <Grid item xs={5} textAlign="left">
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
        <Grid item xs={5} style={{ textAlign: 'right' }}>
          <TypographyPrimary
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1.125rem',
            }}
          >
            {decimalFormatter(lng).format(token.cumulatedBalance ?? 0)}
          </TypographyPrimary>
          <TypographySecondary
            sx={{
              fontSize: '0.625rem',
              lineHeight: '0.875rem',
            }}
          >
            {currencyFormatter(lng).format(token.totalPriceUSD ?? 0)}
          </TypographySecondary>
        </Grid>
      </Grid>
    </ButtonBase>
  );
}

export default PortfolioTokenChainButton;
