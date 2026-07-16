'use client';

import { AB_TEST_NAME } from '@/const/abtests';
import { useABTest } from '@/hooks/useABTest';
import {
  GatekeeperStatus,
  useGatekeeperStatus,
} from '@/app/ui/gatekeeper/useGatekeeperStatus';

type AdvancedAccessRule = 'allow' | 'deny' | 'gatekeeper';

// Single source of truth for how each widget-advanced AB test variant gates
// access. Tune gating by editing this object only.
const ADVANCED_ACCESS_RULES: Record<string, AdvancedAccessRule> = {
  control: 'deny',
  test: 'allow',
  'wallet-access-control': 'gatekeeper',
};

// Applied when the flag hasn't resolved to a known variant yet (still
// loading, or an unrecognized value) — fails closed.
const DEFAULT_ADVANCED_ACCESS_RULE: AdvancedAccessRule = 'deny';

export const useAdvancedAccess = () => {
  const widgetAdvancedFlag = useABTest({
    feature: AB_TEST_NAME.WIDGET_ADVANCED,
  });
  const { status } = useGatekeeperStatus('hasAdvanced');

  const rule: AdvancedAccessRule =
    widgetAdvancedFlag.value === true
      ? 'allow'
      : (typeof widgetAdvancedFlag.value === 'string' &&
          ADVANCED_ACCESS_RULES[widgetAdvancedFlag.value]) ||
        DEFAULT_ADVANCED_ACCESS_RULE;

  const isLoading =
    widgetAdvancedFlag.isLoading ||
    (rule === 'gatekeeper' && status === GatekeeperStatus.LOADING_ACCESS);

  const isAllowed =
    rule === 'allow' ||
    (rule === 'gatekeeper' && status === GatekeeperStatus.SUCCESS);

  return {
    isLoading,
    isEnabled: rule !== 'deny',
    isAllowed,
  };
};
