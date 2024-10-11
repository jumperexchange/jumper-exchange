import { WalletCardContainer } from '@/components/Menus';
import {
  CustomAccordion,
  CustomAvatarGroup,
  TypographyPrimary,
  TypographySecondary,
} from '@/components/Portfolio/Portfolio.styles';
import generateKey from '@/app/lib/generateKey';
import AccordionSummary from '@mui/material/AccordionSummary';
import {
  AccordionDetails,
  Grid,
  Skeleton,
  Tooltip,
  Avatar as MuiAvatar,
  Divider,
  Box,
  useTheme,
} from '@mui/material';
import Image from 'next/image';
import type { ExtendedTokenAmountWithChain } from '@/utils/getTokens';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCardV2.style';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useParams, useRouter } from 'next/navigation';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { currencyFormatter, decimalFormatter } from '@/utils/formatNumbers';
import PortfolioTokenChainButton from '@/components/Portfolio/PortfolioTokenChainButton';
import { useMenuStore } from 'src/stores/menu';
import TokenImage from '@/components/Portfolio/TokenImage';
import { capitalize } from 'lodash';
import type { CacheToken } from '@/types/portfolio';

interface PortfolioTokenProps {
  token: CacheToken;
}

function PortfolioToken({ token }: PortfolioTokenProps) {
  const { lng } = useParams();
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();
  const { isMainPaths } = useMainPaths();
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);
  const { setWalletMenuState } = useMenuStore((state) => state);
  const theme = useTheme();

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
      sx={{
        padding: '0!important',
      }}
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
          <Grid container display="flex" alignItems="center">
            <Grid item xs={2}>
              {hasMultipleChains ? (
                <MuiAvatar>
                  <TokenImage token={token} />
                </MuiAvatar>
              ) : (
                <>
                  <WalletCardBadge
                    overlap="circular"
                    className="badge"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      !hasMultipleChains ? (
                        <MuiAvatar
                          alt={token?.chainName || 'chain-name'}
                          sx={{
                            width: '18px',
                            height: '18px',
                            border: `2px solid ${theme.palette.surface2.main}`,
                          }}
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
                </>
              )}
            </Grid>
            <Grid item xs={5}>
              <TypographyPrimary>
                {token.symbol?.length > 8
                  ? token.symbol.slice(0, 7) + '...'
                  : token.symbol}
              </TypographyPrimary>
              {!hasMultipleChains ? (
                <TypographySecondary>
                  {token.chains[0].name?.length > 20
                    ? token.chains[0].name.slice(0, 18) + '...'
                    : token.chains[0].name}
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
            <Grid item xs={5} style={{ textAlign: 'right' }}>
              <TypographyPrimary>
                {decimalFormatter(lng).format(
                  parseFloat(String(token.cumulatedBalance?.toFixed(3))) ?? 0,
                )}
              </TypographyPrimary>
              <TypographySecondary>
                {currencyFormatter(lng).format(token.cumulatedTotalUSD ?? 0)}
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
            <Divider
              sx={{
                opacity: 0.3,
                width: '95%',
              }}
            />
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
