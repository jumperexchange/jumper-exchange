import { viewports } from "@lifi/style";
import { useMedia } from "use-media";
import { MediaQueryObject } from "use-media/lib/types";

import { UseMediaTypes } from "../types/use-media";

// Usage:
// 1.)  Import MediaTypes and hook:
//      import { useIsTablet } from '@lifi/hooks'
//      import { UseMediaTypes } from '../../types/use-media'
// 2.)  Define variable using the MediaQuery-Hook and pass the option
// Examples -->
//  default:        const isTablet = useIsTablet()
//  less:           const isLtTablet = useIsTablet(UseMediaTypes.lt)
//  greater:        const isGtTablet = useIsTablet(UseMediaTypes.gt)
//  less+equal:     const isLteTablet = useIsTablet(UseMediaTypes.lte)
//  greater+equal:  const isGteTablet = useIsTablet(UseMediaTypes.gte)
// 3.)  In an useEffect return the boolean state
// useEffect(() => {
//   console.log({ isTablet: isTablet, isTabletLt: isTabletLt, isTabletGt: isTabletGt })
// }, [isTablet, isLtTablet, isGtTablet, isLteTablet, isGteTablet])
//
// ** as a best practise for a mobile-first approach it is recommended to use min-width (--> UseMediaTypes.gte)

export const useIsTablet = (props?: UseMediaTypes) => {
  let mediaOption = props;
  let mediaQuery: MediaQueryObject;
  switch (mediaOption) {
    case UseMediaTypes.lt:
      mediaQuery = { maxWidth: viewports.minTablet };
      break;
    case UseMediaTypes.gt:
      mediaQuery = { minWidth: viewports.maxTablet };
      break;
    case UseMediaTypes.lte:
      mediaQuery = { maxWidth: viewports.maxTablet };
      break;
    case UseMediaTypes.gte:
      mediaQuery = { minWidth: viewports.minTablet };
      break;
    default:
      mediaQuery = {
        minWidth: viewports.minTablet,
        maxWidth: viewports.maxTablet,
      };
      break;
  }
  return useMedia(mediaQuery);
};
