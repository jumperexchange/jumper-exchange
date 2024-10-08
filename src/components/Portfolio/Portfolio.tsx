import { Box, Skeleton, Stack, Badge, useTheme } from '@mui/material';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import { useTokens } from '@/utils/getTokens';

function Portfolio() {
  const theme = useTheme();

  const { queries, isSuccess, refetch, cumulativePriceUSD, data } = useTokens();

  return (
    <>
      <TotalBalance
        refetch={refetch}
        isComplete={isSuccess}
        totalValue={Object.values(cumulativePriceUSD).reduce(
          (sum, value) => sum + value,
          0,
        )}
      />
      <Stack spacing={1}>
        {data.length == 0 &&
          Array.from({ length: 10 }, () => 42).map((_, index) => (
            <WalletCardContainer key={index}>
              <Stack direction="row" spacing={1} sx={{ width: '100%' }}>
                <Box>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                      <Skeleton
                        variant="circular"
                        width={16}
                        height={16}
                        sx={{
                          border: `2px solid ${theme.palette.surface2.main}`,
                          backgroundColor:
                            theme.palette.mode === 'light'
                              ? '#e4e4e4'
                              : '#3f3d56',
                        }}
                      />
                    }
                  >
                    <Skeleton variant="circular" width={40} height={40} />
                  </Badge>
                </Box>
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Stack direction="column" alignItems="start" spacing={1}>
                    <Skeleton
                      variant="rectangular"
                      width={64}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                    <Skeleton
                      variant="rectangular"
                      width={96}
                      height={12}
                      sx={{ borderRadius: '32px' }}
                    />
                  </Stack>
                  <Stack direction="column" alignItems="end" spacing={1}>
                    <Skeleton
                      variant="rectangular"
                      width={64}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                    <Skeleton
                      variant="text"
                      width={48}
                      height={16}
                      sx={{ borderRadius: '32px' }}
                    />
                  </Stack>
                </Box>
              </Stack>
            </WalletCardContainer>
          ))}
        {(data || []).map((token) => (
          <PortfolioToken
            token={token}
            key={`${token.chainId}-${token.address}`}
          />
        ))}
      </Stack>
    </>
  );
}

export default Portfolio;
