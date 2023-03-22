import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import analytics from '../services/analytics'

export function usePageViews() {
  const [path, setPath] = useState<string>()
  const location = useLocation()

  const currentPath = location.pathname === '/' ? '/swap' : location.pathname
  if (path !== currentPath) {
    setPath(currentPath)
  }

  useEffect(() => {
    if (path) {
      analytics.sendPageView(path)
    }
  }, [path])

  return path
}
