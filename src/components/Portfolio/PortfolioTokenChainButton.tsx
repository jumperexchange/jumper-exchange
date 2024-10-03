import {
  SmallAvatar,
  TypographyPrimary,
  TypographySecondary,
} from '@/components/Portfolio/Portfolio.styles';
import generateKey from '@/app/lib/generateKey';
import {
  Avatar as MuiAvatar,
  Badge,
  ButtonBase,
  Grid,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import type { Chain, ExtendedTokenAmount } from '@/utils/getTokens';
import { currencyFormatter, decimalFormatter } from '@/utils/formatNumbers';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useParams, useRouter } from 'next/navigation';
import { useMenuStore } from 'src/stores/menu';

interface PortfolioTokenChainButtonProps {
  token: ExtendedTokenAmount;
  chain: Chain;
}

function PortfolioTokenChainButton({
  chain,
  token,
}: PortfolioTokenChainButtonProps) {
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);
  const { isMainPaths } = useMainPaths();
  const theme = useTheme();
  const router = useRouter();
  const { lng } = useParams();

  return (
    <ButtonBase
      onClick={() => {
        setFrom(chain.address, chain.id);
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
                {!token?.logoURI ? (
                  <>?</>
                ) : (
                  <Image
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: '100%' }} // optional
                    src={chain.logoURI as string}
                    alt={chain.name}
                  />
                )}
              </SmallAvatar>
            }
          >
            <MuiAvatar sx={{ width: 32, height: 32 }}>
              {!token?.logoURI ? (
                <>?</>
              ) : (
                <Image
                  width={0}
                  height={0}
                  sizes="100vw"
                  style={{ width: '100%', height: '100%' }} // optional
                  src={token.logoURI}
                  alt={token.name}
                />
              )}
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
            {chain.name}
          </TypographySecondary>
        </Grid>
        <Grid item xs={5} style={{ textAlign: 'right' }}>
          <TypographyPrimary
            sx={{
              fontSize: '0.875rem',
              lineHeight: '1.125rem',
            }}
          >
            {decimalFormatter(lng).format(chain.formattedBalance)}
          </TypographyPrimary>
          <TypographySecondary
            sx={{
              fontSize: '0.625rem',
              lineHeight: '0.875rem',
            }}
          >
            {currencyFormatter(lng).format(chain.totalPriceUSD)}
          </TypographySecondary>
        </Grid>
      </Grid>
    </ButtonBase>
  );
}

export default PortfolioTokenChainButton;
