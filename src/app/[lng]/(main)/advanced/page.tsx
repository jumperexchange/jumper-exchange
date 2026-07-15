'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Box from '@mui/material/Box';
import { AdvancedPageContent } from '@/app/ui/widget/AdvancedPageContent';
import { AppPaths } from '@/const/urls';
import { useAdvancedAccess } from '@/hooks/useAdvancedAccess';

export default function Page() {
  const router = useRouter();
  const { isLoading, isAllowed } = useAdvancedAccess();
  const isDenied = !isLoading && !isAllowed;

  useEffect(() => {
    if (isDenied) {
      router.replace(AppPaths.Main);
    }
  }, [isDenied, router]);

  if (isDenied) {
    return null;
  }

  return (
    <Box sx={{ paddingBottom: { xs: 6, sm: 0 } }}>
      <AdvancedPageContent isLoading={isLoading} />
    </Box>
  );
}
