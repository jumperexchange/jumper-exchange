import { viewports } from "@lifi/style";
import { useMedia } from "use-media";
import { MediaQueryObject } from "use-media/lib/types";

import { UseMediaTypes } from "../types/use-media";

// Usage:
// 1.)  Import MediaTypes and hook:
//      import { useIsDesktopXL } from '@lifi/hooks'
//      import { UseMediaTypes } from '../../types/use-media'
// 2.)  Define variable using the MediaQuery-Hook and pass the option
// Examples -->
//  default:        const isDesktopXL = useIsDesktopXL()
//  less:           const isLtDesktopXL = useIsDesktopXL(UseMediaTypes.lt)
//  greater:        const isGtDesktopXL = useIsDesktopXL(UseMediaTypes.gt)
//  less+equal:     const isLteDesktopXL = useIsDesktopXL(UseMediaTypes.lte)
//  greater+equal:  const isGteDesktopXL = useIsDesktopXL(UseMediaTypes.gte)
// 3.)  In an useEffect return the boolean state
// useEffect(() => {
//   console.log({ isDesktopXL: isDesktopXL, isDesktopXLLt: isDesktopXLLt, isDesktopXLGt: isDesktopXLGt })
// }, [isDesktopXL, isLtDesktopXL, isGtDesktopXL, isLteDesktopXL, isGteDesktopXL])
//
// ** as a best practise for a mobile-first approach it is recommended to use min-width (--> UseMediaTypes.gte)

export const useIsDesktopXL = (props?: UseMediaTypes) => {
  let mediaOption = props;
  let mediaQuery: MediaQueryObject;
  switch (mediaOption) {
    case UseMediaTypes.lt:
      mediaQuery = { maxWidth: viewports.minDesktopXL };
      break;
    case UseMediaTypes.gt:
      mediaQuery = { minWidth: viewports.maxDesktopXL };
      break;
    case UseMediaTypes.lte:
      mediaQuery = { maxWidth: viewports.maxDesktopXL };
      break;
    case UseMediaTypes.gte:
      mediaQuery = { minWidth: viewports.minDesktopXL };
      break;
    default:
      mediaQuery = {
        minWidth: viewports.minDesktopXL,
        maxWidth: viewports.maxDesktopXL,
      };
      break;
  }
  return useMedia(mediaQuery);
};
