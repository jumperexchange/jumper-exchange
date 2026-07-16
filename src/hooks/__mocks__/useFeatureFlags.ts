import { AB_TEST_NAME } from '@/const/abtests';
import type { FeatureFlagResponseDto } from '@/types/jumper-backend';

const storybookFeatureFlags: FeatureFlagResponseDto[] = [
  { key: AB_TEST_NAME.THEME_PARTNER_DEFAULT, variant: true },
];

export const useFeatureFlagsDistinctId = () => 'storybook';

export const useFeatureFlags = () => ({
  data: storybookFeatureFlags,
  isPending: false,
  isLoading: false,
  isFetching: false,
  isRefetching: false,
  isError: false,
  isSuccess: true,
});
