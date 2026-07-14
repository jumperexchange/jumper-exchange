'use client';

import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import { MainWidgetPageContent } from '@/app/ui/widget/MainWidgetPageContent';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import { useAccount } from '@jumperexchange/wallet-management';

const Page = () => {
  const { account } = useAccount();
  const privateSwapsFeatureFlag = useABTest({
    feature: AB_TEST_NAME.PRIVATE_SWAPS,
    address: account?.address ?? '',
  });

  if (
    !privateSwapsFeatureFlag.isLoading &&
    !privateSwapsFeatureFlag.isEnabled
  ) {
    return notFound();
  }

  return (
    <Box sx={{ paddingBottom: { xs: 6, sm: 0 } }}>
      <MainWidgetPageContent
        variant="private"
        isLoading={privateSwapsFeatureFlag.isLoading}
      />
    </Box>
  );
};

export default Page;
