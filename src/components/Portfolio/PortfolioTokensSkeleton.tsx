import { Badge, Box, Skeleton, Stack, useTheme } from '@mui/material';
import { WalletCardContainer } from '../Menus';
import { PortfolioSkeletonBox } from './Portfolio.styles';

export default function PortfolioTokenSkeleton() {
  const theme = useTheme();

  return (
    <>
      {Array.from({ length: 10 }, () => 42).map((_, index) => (
        <WalletCardContainer key={index} sx={{ paddingX: '16px !important' }}>
          <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
            <Box>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Skeleton
                    variant="circular"
                    width={16}
                    height={16}
                    sx={(theme) => ({
                      border: `2px solid ${theme.palette.surface2.main}`,
                      backgroundColor: '#3f3d56',
                      ...theme.applyStyles('light', {
                        backgroundColor: '#e4e4e4',
                      }),
                    })}
                  />
                }
              >
                <Skeleton variant="circular" width={40} height={40} />
              </Badge>
            </Box>
            <PortfolioSkeletonBox>
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
            </PortfolioSkeletonBox>
          </Stack>
        </WalletCardContainer>
      ))}
    </>
  );
}
