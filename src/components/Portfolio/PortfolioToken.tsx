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
  Badge,
  ButtonBase,
  Grid,
  Skeleton,
  styled,
  Tooltip,
  Avatar as MuiAvatar,
} from '@mui/material';
import Image from 'next/image';
import CoinLink, { buildUrl } from '@/components/Portfolio/CoinLink';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import qs from 'querystring';
import { useRouter } from 'next/navigation';
import {
  WalletAvatar,
  WalletCardBadge,
} from '@/components/Menus/WalletMenu/WalletCardV2.style';
import { getConnectorIcon } from '@lifi/wallet-management';
import { Avatar } from '@/components/Avatar';

interface PortfolioTokenProps {
  token: ExtendedTokenAmount;
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 12,
  height: 12,
  border: `2px solid ${theme.palette.background.paper}`,
}));

function PortfolioToken({ token }: PortfolioTokenProps) {
  const [isExpanded, setExpanded] = useState<boolean>(false);
  const { t } = useTranslation();
  const router = useRouter();
  const hasMultipleChains = token.chains.length > 1;

  console.log('---', token, hasMultipleChains);

  const handleChange = () => {
    console.log('change', token);
    if (!hasMultipleChains) {
      router.push(`/?${qs.stringify(buildUrl(token.chains[0], token))}`);
      return;
    }
    setExpanded(!isExpanded);
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
                  {/*                (
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    <SmallAvatar
                      alt={token.chains[0].name}
                      src={token.chains[0].logoURI}
                      sx={{ width: 15, height: 15 }}
                    />
                  }
                >
                  <Avatar sx={{ width: 40, height: 40 }}>
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
                  </Avatar>
                </Badge>
              )*/}
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
                    <CoinLink
                      chain={chain}
                      token={token}
                      key={`${token.symbol}-${chain.key}`}
                    >
                      <Tooltip
                        title={chain.name}
                        key={`${token.symbol}-${chain.key}`}
                      >
                        <MuiAvatar alt={chain.name} src={chain.logoURI} />
                      </Tooltip>
                    </CoinLink>
                  ))}
                </CustomAvatarGroup>
              )}
            </Grid>
            <Grid item xs={5} style={{ textAlign: 'right' }}>
              <TypographyPrimary>
                {token.formattedBalance?.toFixed(2)}
              </TypographyPrimary>
              <TypographySecondary>
                ${token.totalPriceUSD?.toFixed(2)}
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
                router.push(`/?${qs.stringify(buildUrl(chain, token))}`);
              }}
              sx={{
                width: '100%',
                padding: '16px',
                display: 'flex',
              }}
            >
              <Grid container display="flex" alignItems="center">
                <Grid item xs={2}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <SmallAvatar alt={chain.name} src={chain.logoURI} />
                    }
                  >
                    <Avatar sx={{ width: 24, height: 24 }}>
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
                    </Avatar>
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
                    {chain.formattedBalance?.toFixed(2)}
                  </TypographyPrimary>
                  <TypographySecondary
                    sx={{
                      fontSize: '0.625rem',
                      lineHeight: '0.875rem',
                    }}
                  >
                    ${chain.totalPriceUSD?.toFixed(2)}
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
