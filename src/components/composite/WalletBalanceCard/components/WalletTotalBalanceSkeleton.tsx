import Stack from '@mui/material/Stack';
import {
  BaseSkeleton,
  WalletBalanceSharedContainer,
} from '../WalletBalanceCard.styles';

function TotalBalanceSkeleton() {
  return (
    <WalletBalanceSharedContainer disableGutters>
      <Stack spacing={1}>
        <BaseSkeleton variant="rounded" sx={{ width: 120, height: 16 }} />
        <BaseSkeleton variant="rounded" sx={{ width: 160, height: 64 }} />
      </Stack>
    </WalletBalanceSharedContainer>
  );
}

export default TotalBalanceSkeleton;
