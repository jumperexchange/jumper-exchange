'use client';
import { type AbTestName } from 'src/const/abtests';
import { useFeatureFlags } from './useFeatureFlags';

export interface UseABTestProps {
  isEnabled: boolean;
  isLoading: boolean;
  value?: string | boolean;
}

export const useABTest = ({
  feature,
}: {
  feature: AbTestName;
  address?: string;
}): UseABTestProps => {
  const { data, isPending } = useFeatureFlags();
  const flag = data?.find((f) => f.key === feature);

  return {
    isEnabled: !!flag,
    isLoading: isPending,
    value: flag?.variant as unknown as string | boolean | undefined,
  };
};
