import { viewports } from "@transferto/shared/style";
import { useMedia } from "use-media";

export const useIsDesktopFullHD = () =>
  useMedia({ minWidth: viewports.minDesktopFullHd });
