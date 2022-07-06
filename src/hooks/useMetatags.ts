import { useEffect } from 'react'

import setMetatags from '../services/metatags'

export const useMetatags = (data: any) => {
  useEffect(() => {
    setMetatags(data)
  }, [])
}
