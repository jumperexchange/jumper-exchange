import { useMediaQuery } from 'react-responsive'

export const useIsMobile = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 767px)` })
  return isMobile
}
