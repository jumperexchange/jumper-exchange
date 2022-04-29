import { useMediaQuery } from 'react-responsive'

export const useIsMobile = () => {
  const isMobile = useMediaQuery({ query: `(max-width: 760px)` })
  return isMobile
}
