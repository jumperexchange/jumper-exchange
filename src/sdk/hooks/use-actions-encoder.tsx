import type { encodeActionsReturnType, MarketActions } from '../market';
import { encodeActions } from '../market';

export const useActionsEncoder = ({
  marketActions,
}: {
  marketActions: MarketActions | undefined | null;
}) => {
  let data: encodeActionsReturnType['script'] | null = null;

  if (!!marketActions) {
    const res = encodeActions({ marketActions });

    if (res.status === true) {
      data = res.script;
    }
  }

  return {
    data,
  };
};
