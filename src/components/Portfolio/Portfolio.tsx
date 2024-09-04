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
import { useQueries } from '@tanstack/react-query';
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
import { useTokenBalances } from '@/hooks/useTokenBalances';

function buildUrl(chain: ExtendedChain, token: ExtendedTokenAmount) {
  return {
    fromChain: chain.id,
    fromToken: token.address,
  };
}

function Portfolio() {
  const { t } = useTranslation();
  const portfolio = usePortfolioStore((state) => state);
  const { accounts } = useAccounts();
  const theme = useTheme();

  const { isLoading, isRefetching, refetch, data, totalValue } =
    useTokenBalances(accounts);

  if (isLoading || isRefetching) {
    return <PortfolioSkeleton />;
  }

  const differenceValue = totalValue - portfolio.lastTotalValue;
  const differencePercent =
    portfolio.lastTotalValue !== 0
      ? ((totalValue - portfolio.lastTotalValue) /
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
          <TotalValue>${totalValue.toFixed(2)}</TotalValue>
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
        {(data || []).map((token) => (
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
                      <Tooltip
                        title={chain.name}
                        key={`${token.symbol}-${chain.key}`}
                      >
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
                    href={`https://jumper-exchange-git-ft-beta-testing1-jumper-exchange.vercel.app/?${qs.stringify(buildUrl(chain, token))}`}
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
