'use client';

import { notFound } from 'next/navigation';
import Box from '@mui/material/Box';
import { AdvancedPageContent } from '@/app/ui/widget/AdvancedPageContent';
import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import {
  GatekeeperStatus,
  useGatekeeperStatus,
} from '@/app/ui/gatekeeper/useGatekeeperStatus';

export default function Page() {
  const widgetAdvancedFlag = useABTest({
    feature: AB_TEST_NAME.WIDGET_ADVANCED,
  });
  const { status } = useGatekeeperStatus('hasAdvanced');

  if (!widgetAdvancedFlag.isLoading && !widgetAdvancedFlag.isEnabled) {
    return notFound();
  }

  const isLoading =
    widgetAdvancedFlag.isLoading || status === GatekeeperStatus.LOADING_ACCESS;

  if (!isLoading && status !== GatekeeperStatus.SUCCESS) {
    return notFound();
  }

  return (
    <Box sx={{ paddingBottom: { xs: 6, sm: 0 } }}>
      <AdvancedPageContent isLoading={isLoading} />
    </Box>
  );
}
