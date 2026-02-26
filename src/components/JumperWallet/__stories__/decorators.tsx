import type { Decorator } from '@storybook/nextjs-vite';
import { useRef } from 'react';
import {
  createJumperWalletStore,
  type JumperWalletState,
} from '@/stores/jumperWallet/createJumperWalletStore';
import { JumperWalletStoreContext } from '@/stores/jumperWallet/JumperWalletStore';

/**
 * Constrains story width to a modal-like container (480px) so
 * step / wizard components don't stretch to fill the full Storybook canvas.
 */
export const withMockModalContainer: Decorator = (Story) => (
  <div style={{ width: '100%', maxWidth: 480 }}>
    <Story />
  </div>
);

/**
 * Storybook decorator that wraps a story with the real JumperWallet Zustand store,
 * then overrides specific state values for the story.
 *
 * Skips the side effects from JumperWalletStoreProvider (initialize, auto-lock,
 * connector callbacks) so stories render in a clean, predictable state.
 */
export function withMockJumperWalletStore(
  overrides?: Partial<JumperWalletState>,
): Decorator {
  return (Story) => {
    const storeRef = useRef(createJumperWalletStore());

    if (overrides) {
      storeRef.current.setState(overrides);
    }

    return (
      <JumperWalletStoreContext.Provider value={storeRef.current}>
        <Story />
      </JumperWalletStoreContext.Provider>
    );
  };
}
