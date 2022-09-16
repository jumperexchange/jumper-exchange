import { DashboardOld } from '@transferto/dashboard-old/src';
import dynamic from 'next/dynamic';

const DashboardOldDynamic = dynamic(
  () =>
    import('@transferto/dashboard-old/src').then(
      (module) => module.DashboardOld,
    ) as any,
  {
    ssr: false,
  },
) as typeof DashboardOld;

export default function Dashboard() {
  return (
    <>
      <DashboardOldDynamic
        account={{
          address: '0x552008c0f6870c2f77e5cC1d2eb9bdff03e30Ea0',
          chainId: 1,
          isActive: true,
        }}
      />
    </>
  );
}
