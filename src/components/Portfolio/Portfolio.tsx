import {
  AccordionDetails,
  Avatar,
  Button,
  Grid,
  IconButton,
  Stack,
  Tooltip,
  useTheme,
} from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import generateKey from '@/app/lib/generateKey';
import Image from 'next/image';
import type { ExtendedTokenAmount } from '@/utils/getTokens';
import index from '@/utils/getTokens';
import { usePortfolioStore } from '@/stores/portfolio';
import { useAccounts } from '@/hooks/useAccounts';
import PortfolioSkeleton from '@/components/Portfolio/PortfolioSkeleton';
import { useQuery } from '@tanstack/react-query';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import type { ExtendedChain } from '@lifi/sdk';
import Link from 'next/link';
import qs from 'querystring';
import { useTranslation } from 'react-i18next';
import {
  CustomAccordion,
  CustomAvatarGroup,
  TotalValue,
  TypographyPrimary,
  TypographySecondary,
  VariationValue,
} from '@/components/Portfolio/Portfolio.styles';

function buildUrl(chain: ExtendedChain, token: ExtendedTokenAmount) {
  return {
    fromChain: chain.id,
    fromToken: token.address,
  };
}

function Portfolio() {
  const { t } = useTranslation();
  const portfolio = usePortfolioStore((state) => state);
  const { account } = useAccounts();
  const theme = useTheme();

  const { data, isSuccess, isRefetching, isLoading, refetch } = useQuery({
    queryKey: ['accountPortfolio', account?.address],
    queryFn: async () => {
      try {
        if (!account?.address) {
          return;
        }

        let portfolioValue = 0;
        const tokens = await index(account?.address);
        portfolioValue =
          tokens?.reduce(
            (acc, token) => acc + Number(token.totalPriceUSD),
            0,
          ) ?? 0;
        portfolio.setLastTotalValue(portfolioValue);
        portfolio.setLastAddress(account.address);

        return {
          tokens,
          totalValue: portfolioValue,
        };
      } catch (err) {
        console.log(err);
      }
    },
    enabled: !!account?.address,
    refetchInterval: 1000 * 60 * 60,
  });

  if (isLoading || isRefetching) {
    return <PortfolioSkeleton />;
  }

  const differenceValue = (data?.totalValue || 0) - portfolio.lastTotalValue;
  const differencePercent =
    portfolio.lastTotalValue !== 0
      ? (((data?.totalValue || 0) - portfolio.lastTotalValue) /
          Math.abs(portfolio.lastTotalValue)) *
        100
      : 0;

  return (
    <>
      <Stack>
        <Stack
          direction="row"
          gap="0.5rem"
          justifyContent="space-between"
          alignItems="center"
        >
          <TotalValue>${data?.totalValue?.toFixed(2)}</TotalValue>
          <Tooltip title={t('navbar.walletMenu.refreshBalances')}>
            <IconButton
              aria-label="Refresh"
              sx={(theme) => ({
                width: 48,
                height: 48,
                color: theme.palette.text.primary,
              })}
              onClick={() => {
                refetch();
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Stack>
        <Stack direction="row" gap="0.5rem" justifyContent="space-between">
          <VariationValue>
            {/*Hidden for now*/}
            {false && (
              <>
                {differenceValue > 0 ? (
                  <ArrowUpwardIcon
                    sx={{
                      color: theme.palette.success.main,
                      fontSize: '1rem',
                    }}
                  />
                ) : (
                  <ArrowDownwardIcon
                    sx={{
                      color: theme.palette.error.main,
                      fontSize: '1rem',
                    }}
                  />
                )}
                ${differenceValue?.toFixed(2)} ({differencePercent?.toFixed(2)}
                %)
              </>
            )}
          </VariationValue>
        </Stack>
      </Stack>
      <Stack spacing={2}>
        {(data?.tokens || []).map((token) => (
          <CustomAccordion key={generateKey(token.symbol)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="flext-start">
                <Grid item xs={2}>
                  {!token?.logoURI ? (
                    <Avatar>?</Avatar>
                  ) : (
                    <Image
                      width={40}
                      height={40}
                      src={token.logoURI}
                      alt={token.name}
                    />
                  )}
                </Grid>
                <Grid item xs={5}>
                  <TypographyPrimary>{token.symbol}</TypographyPrimary>
                  <CustomAvatarGroup spacing={6}>
                    {token.chains.map((chain) => (
                      <Tooltip title={chain.name} key={chain.key}>
                        <Avatar alt={chain.name} src={chain.logoURI} />
                      </Tooltip>
                    ))}
                  </CustomAvatarGroup>
                </Grid>
                <Grid item xs={5} style={{ textAlign: 'right' }}>
                  <TypographyPrimary>
                    {token.formattedBalance?.toFixed(2)}
                  </TypographyPrimary>
                  <TypographySecondary>
                    {token.totalPriceUSD?.toFixed(2)}
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
                display="flex"
                flexWrap="wrap"
                flexDirection="row"
                justifyContent="flex-start"
              >
                {token.chains.map((chain, idx) => (
                  <Link
                    href={`${process.env.VERCEL_URL || process.env.NEXT_PUBLIC_SITE_URL}/?${qs.stringify(buildUrl(chain, token))}`}
                    passHref
                    key={idx}
                  >
                    <Button size="small">
                      <Tooltip title={chain.name}>
                        <Avatar
                          src={chain.logoURI}
                          alt={`Chain ${idx}`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        />
                      </Tooltip>
                      <TypographySecondary>
                        {chain.formattedBalance?.toFixed(2)} {token.symbol}
                      </TypographySecondary>
                    </Button>
                  </Link>
                ))}
              </Box>
            </AccordionDetails>
          </CustomAccordion>
        ))}
      </Stack>
    </>
  );
}

export default Portfolio;
