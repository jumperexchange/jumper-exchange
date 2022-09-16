import { viewports } from "@transferto/shared/src";
import { useMedia } from "use-media";

export const useIsDesktopFullHD = () =>
  useMedia({ minWidth: viewports.minDesktopFullHd });
