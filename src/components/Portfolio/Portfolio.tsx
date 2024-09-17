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
import { usePortfolioStore } from '@/stores/portfolio';
import { useAccounts } from '@/hooks/useAccounts';
import PortfolioSkeleton from '@/components/Portfolio/PortfolioSkeleton';
import RefreshIcon from '@mui/icons-material/Refresh';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/system';
import { isEqual } from 'lodash';
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
import CoinLink from '@/components/Portfolio/CoinLink';
import { useEffect, useState } from 'react';
import TotalBalance from '@/components/Portfolio/TotalBalance';

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

  return (
    <>
      <TotalBalance
        refetch={refetch}
        totalValue={totalValue}
      />
      <Stack spacing={2}>
        {(data || []).map((token) => (
          <CustomAccordion key={generateKey(token.symbol)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Grid container alignItems="flext-start">
                <Grid item xs={2}>
                  <Avatar>
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
                  </Avatar>
                </Grid>
                <Grid item xs={5}>
                  <TypographyPrimary>{token.symbol}</TypographyPrimary>
                  <CustomAvatarGroup spacing={6} max={15}>
                    {token.chains.map((chain) => (
                      <CoinLink
                        chain={chain}
                        token={token}
                        key={`${token.symbol}-${chain.key}`}
                      >
                        <Tooltip title={chain.name}>
                          <Avatar alt={chain.name} src={chain.logoURI} />
                        </Tooltip>
                      </CoinLink>
                    ))}
                  </CustomAvatarGroup>
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
              <Box
                display="flex"
                flexWrap="wrap"
                flexDirection="row"
                justifyContent="flex-start"
              >
                {token.chains.map((chain, idx) => (
                  <CoinLink
                    chain={chain}
                    token={token}
                    key={`${token.symbol}-${chain.key}`}
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
                  </CoinLink>
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
