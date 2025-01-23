import generateKey from '@/app/lib/generateKey';
import { WalletCardContainer } from '@/components/Menus';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCard.style';
import {
  CustomAccordion,
  CustomAvatarGroup,
  TypographyPrimary,
  TypographySecondary,
} from '@/components/Portfolio/Portfolio.styles';
import PortfolioTokenChainButton from '@/components/Portfolio/PortfolioTokenChainButton';
import TokenImage from '@/components/Portfolio/TokenImage';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import type { CacheToken } from '@/types/portfolio';
import {
  AccordionDetails,
  Box,
  Avatar as MuiAvatar,
  Skeleton,
  Tooltip,
} from '@mui/material';
import AccordionSummary from '@mui/material/AccordionSummary';
import Grid from '@mui/material/Grid2';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuStore } from 'src/stores/menu';
import { stringLenShortener } from 'src/utils/stringLenShortener';
import { PortfolioDivider } from './PortfolioDivider';

interface PortfolioTokenProps {
  token: CacheToken;
}

function PortfolioToken({ token }: PortfolioTokenProps) {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();
  const { isMainPaths } = useMainPaths();
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);
  const hasMultipleChains = token.chains.length > 1;

  const handleChange = (_: React.ChangeEvent<{}>, expanded: boolean) => {
    if (!hasMultipleChains) {
      setFrom(token.address, token.chainId);
      setWalletMenuState(false);

      if (!isMainPaths) {
        router.push('/');
      }
      return;
    }
    setExpanded(expanded);
  };

  return (
    <WalletCardContainer
      sx={(theme) => ({
        padding: 0,
        [theme.breakpoints.up('sm')]: {
          padding: 0,
        },
        [theme.breakpoints.up('md')]: {
          padding: 0,
        },
      })}
    >
      <CustomAccordion
        expanded={isExpanded}
        disableGutters
        onChange={handleChange}
      >
        <AccordionSummary
          sx={{
            padding: 0,
            '& .MuiAccordionSummary-content': {
              margin: 0,
            },
          }}
        >
          <Grid
            container
            display="flex"
            alignItems="center"
            sx={{ width: '100%' }}
          >
            <Grid size={{ xs: 2 }}>
              {hasMultipleChains ? (
                <MuiAvatar>
                  <TokenImage token={token} />
                </MuiAvatar>
              ) : (
                <WalletCardBadge
                  overlap="circular"
                  className="badge"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    !hasMultipleChains ? (
                      <MuiAvatar
                        alt={token?.chainName || 'chain-name'}
                        sx={(theme) => ({
                          width: '18px',
                          height: '18px',
                          border: `2px solid ${theme.palette.surface2.main}`,
                        })}
                      >
                        <TokenImage
                          token={{
                            name: token.chainName ?? '',
                            logoURI: token.chainLogoURI,
                          }}
                        />
                      </MuiAvatar>
                    ) : (
                      <Skeleton variant="circular" />
                    )
                  }
                >
                  <WalletAvatar>
                    <TokenImage token={token} />
                  </WalletAvatar>
                </WalletCardBadge>
              )}
            </Grid>
            <Grid size={{ xs: 5 }}>
              <TypographyPrimary>
                {stringLenShortener(token.symbol, 8)}
              </TypographyPrimary>
              {!hasMultipleChains ? (
                <TypographySecondary>
                  {stringLenShortener(token.chains?.[0]?.name, 18)}
                </TypographySecondary>
              ) : (
                <CustomAvatarGroup spacing={6} max={15}>
                  {token.chains.map((chain) => (
                    <Tooltip
                      title={chain.name}
                      key={`${token.symbol}-${chain.address}-${chain.chainId}`}
                    >
                      <MuiAvatar
                        alt={chain.chainName}
                        sx={{ width: '12px', height: '12px' }}
                      >
                        <TokenImage
                          token={{
                            name: chain.chainName ?? '',
                            logoURI: chain.chainLogoURI,
                          }}
                        />
                      </MuiAvatar>
                    </Tooltip>
                  ))}
                </CustomAvatarGroup>
              )}
            </Grid>
            <Grid size={{ xs: 5 }} style={{ textAlign: 'right' }}>
              <TypographyPrimary>
                {t('format.decimal', { value: token.cumulatedBalance })}
              </TypographyPrimary>
              <TypographySecondary>
                {t('format.currency', { value: token.cumulatedTotalUSD })}
              </TypographySecondary>
            </Grid>
          </Grid>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            margin: 0,
            padding: 0,
          }}
        >
          <Box
            sx={{
              flexDirection: 'column',
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <PortfolioDivider />
            {token.chains.map((tokenWithChain) => (
              <PortfolioTokenChainButton
                key={generateKey(tokenWithChain.address)}
                token={tokenWithChain}
              />
            ))}
          </Box>
        </AccordionDetails>
      </CustomAccordion>
    </WalletCardContainer>
  );
}

export default memo(PortfolioToken);
