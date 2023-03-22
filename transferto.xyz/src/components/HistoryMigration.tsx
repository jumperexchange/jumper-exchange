import { useEffect } from 'react'

function HistoryMigration() {
  useEffect(() => {
    const data = localStorage.getItem('li.fi-widget-routes')
    if (!data) {
      return
    }
    window.parent.postMessage(data, 'https://jumper.exchange')
    window.parent.postMessage(data, 'https://allowlist.jumper.exchange')
    window.parent.postMessage(data, 'https://onboardto.xyz')
  }, [])
  return null
}

export default HistoryMigration
