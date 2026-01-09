import { useAccount } from '@lifi/wallet-management';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSettingsStore } from '@/stores/settings';

interface UsePortfolioWelcomeScreenResult {
  portfolioWelcomeScreenClosed: boolean | undefined;
  setPortfolioWelcomeScreenClosed: (closed: boolean) => void;
}

export const usePortfolioWelcomeScreen =
  (): UsePortfolioWelcomeScreenResult => {
    const { account } = useAccount();
    const [
      temporaryPortfolioWelcomeClosed,
      setTemporaryPortfolioWelcomeClosed,
    ] = useState(false);

    const [allPortfolioWelcomeScreenClosed, setPortfolioWelcomeScreenClosed] =
      useSettingsStore((state) => [
        state.portfolioWelcomeScreenClosed,
        state.setPortfolioWelcomeScreenClosed,
      ]);

    const updateState = useCallback(
      (closed: boolean) => {
        setTemporaryPortfolioWelcomeClosed(closed);
        setPortfolioWelcomeScreenClosed(account.address, closed);
      },
      [account.address, setPortfolioWelcomeScreenClosed],
    );

    useEffect(() => {
      if (
        temporaryPortfolioWelcomeClosed &&
        account.address &&
        !allPortfolioWelcomeScreenClosed[account.address]
      ) {
        updateState(true);
        setTemporaryPortfolioWelcomeClosed(false);
      }
    }, [
      account.address,
      allPortfolioWelcomeScreenClosed,
      temporaryPortfolioWelcomeClosed,
      setTemporaryPortfolioWelcomeClosed,
      updateState,
    ]);

    const portfolioWelcomeScreenClosed = useMemo(() => {
      if (!account.address) {
        return false;
      }
      return (
        allPortfolioWelcomeScreenClosed[account.address] ||
        temporaryPortfolioWelcomeClosed
      );
    }, [
      account.address,
      temporaryPortfolioWelcomeClosed,
      allPortfolioWelcomeScreenClosed,
    ]);

    return {
      portfolioWelcomeScreenClosed,
      setPortfolioWelcomeScreenClosed: updateState,
    };
  };
