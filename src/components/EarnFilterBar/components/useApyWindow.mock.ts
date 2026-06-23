import { useCallback, useState } from 'react';
import { ApyWindowOptions, type ApyWindow } from './EarnApyWindowToggle';

export function useApyWindowMock(
  initial: ApyWindow = ApyWindowOptions.SEVEN_DAY,
) {
  const [apyWindow, setApyWindow] = useState<ApyWindow>(initial);

  const toggleApyWindow = useCallback(() => {
    setApyWindow((prev) =>
      prev === ApyWindowOptions.SEVEN_DAY
        ? ApyWindowOptions.THIRTY_DAY
        : ApyWindowOptions.SEVEN_DAY,
    );
  }, []);

  return { apyWindow, setApyWindow, toggleApyWindow } as const;
}
