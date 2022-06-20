import { viewports } from "@lifi/style";
import { useMedia } from "use-media";
import { MediaQueryObject } from "use-media/lib/types";

import { UseMediaTypes } from "../types/use-media";

// Usage:
// 1.)  Import MediaTypes and hook:
//      import { useIsDesktop } from '@lifi/hooks'
//      import { UseMediaTypes } from '../../types/use-media'
//
// 2.)  Define variable using the MediaQuery-Hook and pass the option
// Examples -->
//  default:        const isDesktop = useIsDesktop()
//  less:           const isLtDesktop = useIsDesktop(UseMediaTypes.lt)
//  greater:        const isGtDesktop = useIsDesktop(UseMediaTypes.gt)
//  less+equal:     const isLteDesktop = useIsDesktop(UseMediaTypes.lte)
//  greater+equal:  const isGteDesktop = useIsDesktop(UseMediaTypes.gte)
// 3.)  In an useEffect return the boolean state
// useEffect(() => {
//   console.log({ isDesktop: isDesktop, isDesktopLt: isDesktopLt, isDesktopGt: isDesktopGt })
// }, [isDesktop, isLtDesktop, isGtDesktop, isLteDesktop, isGteDesktop])
//
// ** as a best practise for a mobile-first approach it is recommended to use min-width (--> UseMediaTypes.gte)

export const useIsDesktop = (props?: UseMediaTypes) => {
  let mediaOption = props;
  let mediaQuery: MediaQueryObject;
  switch (mediaOption) {
    case UseMediaTypes.lt:
      mediaQuery = { maxWidth: viewports.minDesktop };
      break;
    case UseMediaTypes.gt:
      mediaQuery = { minWidth: viewports.maxDesktop };
      break;
    case UseMediaTypes.lte:
      mediaQuery = { maxWidth: viewports.maxDesktop };
      break;
    case UseMediaTypes.gte:
      mediaQuery = { minWidth: viewports.minDesktop };
      break;
    default:
      mediaQuery = {
        minWidth: viewports.minDesktop,
        maxWidth: viewports.maxDesktop,
      };
      break;
  }
  return useMedia(mediaQuery);
};
