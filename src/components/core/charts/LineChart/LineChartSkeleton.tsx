import dynamic from 'next/dynamic';
import { LineChartSkeletonServer } from './LineChartSkeletonServer';

const LineChartSkeletonClient = dynamic(
  () =>
    import('./LineChartSkeletonClient').then(
      (mod) => mod.LineChartSkeletonClient,
    ),
  {
    ssr: false,
    loading: () => <LineChartSkeletonServer />,
  },
);

export const LineChartSkeleton = () => {
  return <LineChartSkeletonClient />;
};
