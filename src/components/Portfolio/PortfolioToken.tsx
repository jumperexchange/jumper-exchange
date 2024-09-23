import { WalletCardContainer } from '@/components/Menus';
import {
  CustomAccordion,
  CustomAvatarGroup,
  TypographyPrimary,
  TypographySecondary,
  SmallAvatar,
} from '@/components/Portfolio/Portfolio.styles';
import generateKey from '@/app/lib/generateKey';
import AccordionSummary from '@mui/material/AccordionSummary';
import {
  AccordionDetails,
  Badge,
  ButtonBase,
  Grid,
  Skeleton,
  Tooltip,
  Avatar as MuiAvatar,
} from '@mui/material';
import Image from 'next/image';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCardV2.style';
import { Avatar } from '@/components/Avatar';
import { useMainPaths } from '@/hooks/useMainPaths';
import { useParams, useRouter } from 'next/navigation';
import { useWidgetCacheStore } from '@/stores/widgetCache';
import { currencyFormatter, decimalFormatter } from '@/utils/formatNumbers';

interface PortfolioTokenProps {
  token: ExtendedTokenAmount;
}

function PortfolioToken({ token }: PortfolioTokenProps) {
  const { lng } = useParams();
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();
  const { isMainPaths } = useMainPaths();
  const router = useRouter();
  const setFrom = useWidgetCacheStore((state) => state.setFrom);

  const hasMultipleChains = token.chains.length > 1;

  const handleChange = (_: React.ChangeEvent<{}>, expanded: boolean) => {
    if (!hasMultipleChains) {
      setFrom(token.address, token.chainId);

      if (!isMainPaths) {
        router.push('/');
      }
      return;
    }
    setExpanded(expanded);
  };

  return (
    <WalletCardContainer sx={{ padding: '0!important' }}>
      <CustomAccordion
        expanded={isExpanded}
        key={generateKey(token.symbol)}
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
                  {!token?.logoURI ? (
                    <>?</>
                  ) : (
                    <Image
                      width={40}
                      height={40}
                      src={token.logoURI}
                      alt={token.name}
                    />
                  )}
                </MuiAvatar>
              ) : (
                <>
                  <WalletCardBadge
                    overlap="circular"
                    className="badge"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      token?.logoURI ? (
                        <Avatar
                          size="small"
                          src={token.chains[0]?.logoURI || ''}
                          alt={'wallet-avatar'}
                        />
                      ) : (
                        <Skeleton variant="circular" />
                      )
                    }
                  >
                    <WalletAvatar src={token.logoURI} />
                  </WalletCardBadge>
                </>
              )}
            </Grid>
            <Grid item xs={5}>
              <TypographyPrimary>{token.symbol}</TypographyPrimary>
              {!hasMultipleChains ? (
                <TypographySecondary>
                  {token.chains[0].name}
                </TypographySecondary>
              ) : isExpanded ? (
                <TypographySecondary>
                  {t('navbar.walletMenu.numberOfChains', {
                    numberOfChains: token.chains?.length,
                  })}
                </TypographySecondary>
              ) : (
                <CustomAvatarGroup spacing={6} max={15}>
                  {token.chains.map((chain) => (
                    <Tooltip
                      title={chain.name}
                      key={`${token.symbol}-${chain.key}`}
                    >
                      <MuiAvatar alt={chain.name} src={chain.logoURI} />
                    </Tooltip>
                  ))}
                </CustomAvatarGroup>
              )}
            </Grid>
            <Grid item xs={5} style={{ textAlign: 'right' }}>
              <TypographyPrimary>
                {decimalFormatter(lng).format(token.formattedBalance ?? 0)}
              </TypographyPrimary>
              <TypographySecondary>
                {currencyFormatter(lng).format(token.totalPriceUSD ?? 0)}
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
          {token.chains.map((chain) => (
            <ButtonBase
              key={generateKey(chain.key)}
              onClick={() => {
                setFrom(chain.address, chain.id);
                if (!isMainPaths) {
                  router.push('/');
                }
              }}
              sx={{
                width: '100%',
                padding: '16px',
                display: 'flex',
                '&:hover': {
                  background: 'rgba(0, 0, 0, 0.04)',
                },
              }}
            >
              <Grid container display="flex" alignItems="center">
                <Grid item xs={2}>
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
                    <MuiAvatar sx={{ width: 24, height: 24 }}>
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
          ))}
        </AccordionDetails>
      </CustomAccordion>
    </WalletCardContainer>
  );
}

export default PortfolioToken;
