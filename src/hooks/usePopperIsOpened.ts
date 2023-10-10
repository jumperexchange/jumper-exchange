import { useMenuStore } from '../stores';

export const usePopperIsOpened = () => {
  const [
    openMainMenuPopper,
    openWalletPopper,
    openSubMenuPopper,
    openChainsPopper,
    openWalletSelectPopper,
  ] = useMenuStore((state) => [
    state.openMainMenuPopper,
    state.openWalletPopper,
    state.openSubMenuPopper,
    state.openChainsPopper,
    state.openWalletSelectPopper,
  ]);

  return (
    openMainMenuPopper ||
    openWalletPopper ||
    openSubMenuPopper !== 'None' ||
    openChainsPopper ||
    openWalletSelectPopper
  );
};
