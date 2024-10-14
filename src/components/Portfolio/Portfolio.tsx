import { WalletCardContainer } from '@/components/Menus';
import PortfolioToken from '@/components/Portfolio/PortfolioToken';
import TotalBalance from '@/components/Portfolio/TotalBalance';
import { useTokens } from '@/utils/getTokens';
import { Badge, Box, Skeleton, Stack, useTheme } from '@mui/material';

export function Portfolio() {
  const theme = useTheme();

  const { isSuccess, refetch, isFetching, data } = useTokens();

  return (
    <>
      <TotalBalance
        refetch={refetch}
        isFetching={isFetching}
        isComplete={isSuccess}
      />
      <Stack spacing={1}>
        {!isSuccess &&
          data.length == 0 &&
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
                      variant="rectangular"
                      width={48}
                      height={12}
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
