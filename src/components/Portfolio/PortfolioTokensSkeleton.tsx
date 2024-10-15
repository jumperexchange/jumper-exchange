import {
  AvatarGroup,
  Badge,
  Box,
  Skeleton,
  Stack,
  useTheme,
} from '@mui/material';
import generateKey from '@/app/lib/generateKey';
import { WalletCardContainer } from '../Menus';

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
                    sx={{
                      border: `2px solid ${theme.palette.surface2.main}`,
                      backgroundColor:
                        theme.palette.mode === 'light' ? '#e4e4e4' : '#3f3d56',
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
    </>
  );
}
