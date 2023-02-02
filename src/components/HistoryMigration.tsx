import { useEffect } from 'react'

function HistoryMigration() {
  useEffect(() => {
    const data = localStorage.getItem('li.fi-widget-routes')
    if (!data) {
      return
    }
    const targetOrigin =
      origin.split('.').length === 3
        ? `${origin.substring(0, origin.indexOf('.'))}.jumper.exchange`
        : 'https://jumper.exchange'
    window.parent.postMessage(data, targetOrigin)
  }, [])
  return null
}

export default HistoryMigration
