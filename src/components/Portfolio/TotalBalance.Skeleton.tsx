import { WalletCardContainer } from '@/components/Menus';
import { Skeleton, Stack } from '@mui/material';

function TotalBalanceSkeleton() {
  return (
    <WalletCardContainer>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton
            variant="rectangular"
            width={96}
            height={12}
            sx={{ borderRadius: '32px' }}
          />
        </Stack>
        <Skeleton
          sx={(theme) => ({
            color: theme.palette.text.primary,
            textOverflow: 'ellipsis',
            fontWeight: '700',
            textShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            fontSize: '3rem',
            lineHeight: '4rem',
            borderRadius: '32px',
          })}
          variant="rectangular"
          width={160}
          height={48}
        />
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton
            variant="rectangular"
            width={48}
            height={12}
            sx={{ borderRadius: '32px' }}
          />
          <Skeleton
            variant="rectangular"
            width={48}
            height={12}
            sx={{ borderRadius: '32px' }}
          />
        </Stack>
      </Stack>
    </WalletCardContainer>
  );
}

export default TotalBalanceSkeleton;
