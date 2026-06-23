import { useCallback } from 'react';
import { parseAsStringEnum, useQueryState } from 'nuqs';
import { ApyWindowOptions, type ApyWindow } from './EarnApyWindowToggle';

export const apyWindowParser = parseAsStringEnum<ApyWindow>(
  Object.values(ApyWindowOptions) as ApyWindow[],
).withDefault(ApyWindowOptions.SEVEN_DAY);

export function useApyWindow() {
  const [apyWindow, setApyWindow] = useQueryState('apyWindow', apyWindowParser);

  const toggleApyWindow = useCallback(() => {
    setApyWindow((prev) =>
      prev === ApyWindowOptions.SEVEN_DAY
        ? ApyWindowOptions.THIRTY_DAY
        : ApyWindowOptions.SEVEN_DAY,
    );
  }, [setApyWindow]);

  return { apyWindow, setApyWindow, toggleApyWindow } as const;
}
