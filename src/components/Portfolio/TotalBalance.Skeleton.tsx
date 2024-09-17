import { WalletCardContainer } from '@/components/Menus';
import { Skeleton, Stack } from '@mui/material';

function TotalBalanceSkeleton () {
  return (
    <WalletCardContainer>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Skeleton
            variant="circular"
            width={34}
            height={34}
          />
          <Skeleton
            variant="rectangular"
            width={100}
            height={24}
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
          })}
          variant="rectangular"
          width={210}
          height={60}
        />
      </Stack>
    </WalletCardContainer>
  );
}

export default TotalBalanceSkeleton;
