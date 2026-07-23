'use client';
import { useAccount } from '@lifi/wallet-management';
import { Fab } from '@mui/material';
import { useIsBeta } from '@/hooks/useIsBeta';
import { useSocialCardStore } from '@/stores/socialCard/SocialCardStore';
import {
  debugExtraOutputCard,
  deriveExtraOutputCardPreview,
} from '@/utils/image-generation/deriveExtraOutputCard';

/**
 * Beta-only helper to preview the PNL social card nudge using the real route the
 * widget currently has selected — no swap execution and no mocked numbers.
 * Only rendered when the `use-beta` localStorage flag is set.
 *
 * Test flow: enter a swap so quotes load (a route gets selected), then click
 * this button to render the card from that real selection.
 */
export const SocialCardTestTrigger = () => {
  const isBeta = useIsBeta();
  const { account } = useAccount();
  const showCard = useSocialCardStore((state) => state.showCard);
  const latestSelection = useSocialCardStore((state) => state.latestSelection);

  if (!isBeta) {
    return null;
  }

  const handleClick = () => {
    if (!latestSelection) {
      console.warn(
        '[SocialCardTestTrigger] No route selected yet — enter a swap in the widget first, then click again.',
      );
      return;
    }

    /* eslint-disable no-console */
    const debug = debugExtraOutputCard(latestSelection);
    console.groupCollapsed(
      `[SocialCardTestTrigger] ${debug.fromToken} → ${debug.toToken} · selected $${debug.selectedValueUSD} · median $${debug.medianUSD} · amountWon $${debug.amountWon} (baseline: ${debug.baselineSource}, ${debug.eligibleCount}/${debug.totalQuotes} eligible)`,
    );
    console.log('summary', debug);
    console.table(debug.quotes);
    console.groupEnd();
    /* eslint-enable no-console */

    const card = deriveExtraOutputCardPreview(latestSelection);
    if (!card) {
      console.warn(
        '[SocialCardTestTrigger] Could not derive a card from the current selection.',
      );
      return;
    }

    showCard({ ...card, referralCode: account?.address });
  };

  return (
    <Fab
      color="primary"
      variant="extended"
      size="small"
      onClick={handleClick}
      sx={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: (theme) => theme.zIndex.modal + 1,
        textTransform: 'none',
      }}
    >
      Test PnL card
    </Fab>
  );
};
