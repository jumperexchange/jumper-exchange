import { viewports } from "@transferto/shared/src";
import { useMedia } from "use-media";
import { MediaQueryObject } from "use-media/lib/types";

import { UseMediaTypes } from "../types/use-media";
// Usage:
// 1.)  Import MediaTypes and hook:
//      import { useIsMobile } from '@transferto/shared/hooks'
//      import { UseMediaTypes } from '@transferto/shared/types/use-media'
//
// 2.)  Define variable using the MediaQuery-Hook and pass the option
// Examples -->
//  default:        const isMobile = useIsMobile()
//  less:           const isLtMobile = useIsMobile(UseMediaTypes.lt)
//  greater:        const isGtMobile = useIsMobile(UseMediaTypes.gt)
//  less+equal:     const isLteMobile = useIsMobile(UseMediaTypes.lte)
//  greater+equal:  const isGteMobile = useIsMobile(UseMediaTypes.gte)
//
// 3.)  In an useEffect return the boolean state
// useEffect(() => {
//   console.log({ isMobile: isMobile, isMobileLt: isMobileLt, isMobileGt: isMobileGt })
// }, [isMobile, isLtMobile, isGtMobile, isLteMobile, isGteMobile])
//
// ** as a best practise for a mobile-first approach it is recommended to use min-width (--> UseMediaTypes.gte)

export const useIsMobile = (props?: UseMediaTypes) => {
  let mediaOption = props;
  let mediaQuery: MediaQueryObject;
  switch (mediaOption) {
    case UseMediaTypes.lt:
      mediaQuery = { maxWidth: viewports.minMobile };
      break;
    case UseMediaTypes.gt:
      mediaQuery = { minWidth: viewports.maxMobile };
      break;
    case UseMediaTypes.lte:
      mediaQuery = { maxWidth: viewports.maxMobile };
      break;
    case UseMediaTypes.gte:
      mediaQuery = { minWidth: viewports.minMobile };
      break;
    default:
      mediaQuery = {
        minWidth: viewports.minMobile,
        maxWidth: viewports.maxMobile,
      };
      break;
  }
  return useMedia(mediaQuery);
};
