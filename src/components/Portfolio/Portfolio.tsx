import {
  AccordionDetails,
  Avatar, AvatarGroup,
  Button,
  Grid,
  IconButton, Skeleton,
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
import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';

function Portfolio() {
  const { t } = useTranslation();
  const portfolio = usePortfolioStore((state) => state);
  const { accounts } = useAccounts();
  const theme = useTheme();

  const { isLoading, isRefetching, refetch, data, totalValue } =
    useTokenBalances(accounts);
  //
  // if (isLoading || isRefetching) {
  //   return <PortfolioSkeleton />;
  // }

  return (
    <>
      <TotalBalance
        refetch={refetch}
        totalValue={totalValue}
      />
      <Stack spacing={1}>
        {false && new Array(8).fill(undefined).map((token) => (
          <WalletCardContainer>
            <Stack direction="row" spacing={1}>
                <Skeleton
                  variant="circular"
                  width={40}
                  height={40}
                />
              <Stack direction="column" alignItems="center" spacing={1}>
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={24}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                />
              </Stack>
              <Stack direction="column" alignItems="center" spacing={1}>
                <Skeleton
                  variant="rectangular"
                  width={100}
                  height={24}
                />
                <Skeleton
                  variant="text"
                  width={100}
                  height={24}
                />
              </Stack>
            </Stack>
          </WalletCardContainer>
        ))}
        {(data || []).map((token, index) => <PortfolioToken token={token} key={index} />)}
      </Stack>
    </>
  );
}

export default Portfolio;
