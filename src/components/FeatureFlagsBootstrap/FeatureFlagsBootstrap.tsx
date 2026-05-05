'use client';
import { useFeatureFlags } from 'src/hooks/useFeatureFlags';

export function FeatureFlagsBootstrap() {
  useFeatureFlags();
  return null;
}
