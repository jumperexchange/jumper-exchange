import { viewports } from "@transferto/shared/src";
import { useMedia } from "use-media";
import { MediaQueryObject } from "use-media/lib/types";

import { UseMediaTypes } from "../types/use-media";

// Usage:
// 1.)  Import MediaTypes and hook:
//      import { useIsLaptop } from '@shared/hookshooks'
//      import { UseMediaTypes } from '@transferto/shared/types/use-media'
//
// 2.)  Define variable using the MediaQuery-Hook and pass the option
// Examples -->
//  default:        const isLaptop = useIsLaptop()
//  less:           const isLtLaptop = useIsLaptop(UseMediaTypes.lt)
//  greater:        const isGtLaptop = useIsLaptop(UseMediaTypes.gt)
//  less+equal:     const isLteLaptop = useIsLaptop(UseMediaTypes.lte)
//  greater+equal:  const isGteLaptop = useIsLaptop(UseMediaTypes.gte)
// 3.)  In an useEffect return the boolean state
// useEffect(() => {
//   console.log({ isLaptop: isLaptop, isLaptopLt: isLaptopLt, isLaptopGt: isLaptopGt })
// }, [isLaptop, isLtLaptop, isGtLaptop, isLteLaptop, isGteLaptop])
//
// ** as a best practise for a mobile-first approach it is recommended to use min-width (--> UseMediaTypes.gte)

export const useIsLaptop = (props?: UseMediaTypes) => {
  let mediaOption = props;
  let mediaQuery: MediaQueryObject;
  switch (mediaOption) {
    case UseMediaTypes.lt:
      mediaQuery = { maxWidth: viewports.minLaptop };
      break;
    case UseMediaTypes.gt:
      mediaQuery = { minWidth: viewports.maxLaptop };
      break;
    case UseMediaTypes.lte:
      mediaQuery = { maxWidth: viewports.maxLaptop };
      break;
    case UseMediaTypes.gte:
      mediaQuery = { minWidth: viewports.minLaptop };
      break;
    default:
      mediaQuery = {
        minWidth: viewports.minLaptop,
        maxWidth: viewports.maxLaptop,
      };
      break;
  }
  return useMedia(mediaQuery);
};
