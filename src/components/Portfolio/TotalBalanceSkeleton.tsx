import { WalletCardContainer } from '@/components/Menus';
import Stack from '@mui/material/Stack';
import { BaseSkeleton } from './Portfolio.styles';

function TotalBalanceSkeleton() {
  return (
    <WalletCardContainer disableGutters>
      <Stack spacing={1}>
        <BaseSkeleton variant="rounded" sx={{ width: 120, height: 16 }} />
        <BaseSkeleton variant="rounded" sx={{ width: 160, height: 64 }} />
      </Stack>
    </WalletCardContainer>
  );
}

export default TotalBalanceSkeleton;
