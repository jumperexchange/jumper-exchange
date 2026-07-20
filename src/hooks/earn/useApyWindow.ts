import { ApyWindowOptions, type ApyWindow } from '@/utils/earn/apyWindow';
import { parseAsStringEnum, useQueryState } from 'nuqs';

export const apyWindowParser = parseAsStringEnum<ApyWindow>(
  Object.values(ApyWindowOptions) as ApyWindow[],
).withDefault(ApyWindowOptions.SEVEN_DAY);

export function useApyWindow() {
  const [apyWindow, setApyWindow] = useQueryState('apyWindow', apyWindowParser);

  const toggleApyWindow = () => {
    setApyWindow((prev) =>
      prev === ApyWindowOptions.SEVEN_DAY
        ? ApyWindowOptions.THIRTY_DAY
        : ApyWindowOptions.SEVEN_DAY,
    );
  };

  return { apyWindow, setApyWindow, toggleApyWindow } as const;
}
