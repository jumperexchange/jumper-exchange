import { useEffect } from 'react'

let inited = false

type StomtPages = 'lifi' | 'swap' | 'dashboard'

const appIds = {
  lifi: 'uUVExD5kjMR92siP7moqDzhKn',
  swap: 'FMHeDpf9yAOWkQ8rAClG06TUh',
  dashboard: 'KozDav9YnWAKlijkRdpAJciWM',
}

export const initStomt = (page: StomtPages) => {
  const w = window as any
  if (!process.env.REACT_APP_STOMT_ENABLED) {
    return
  }
  if (w.innerWidth < 560) {
    return
  }

  const appId = appIds[page]
  if (!inited) {
    inited = true
    w.Stomt = w.Stomt || []
    const script = document.getElementsByTagName('script')[0]
    const tag = document.createElement('script')
    tag.async = true
    tag.src = 'https://www.stomt.com/widget.js'
    script?.parentNode?.insertBefore(tag, script)

    w.Stomt.push([
      'addTab',
      {
        appId: appId,
        colorBackground: '#0a0a79',
        label: 'Feedback',
        preload: false,
      },
    ])
  } else {
    w.Stomt?.tab?.setOptions({
      appId: appId,
    })
  }
}

export const useStomt = (page: StomtPages) => {
  useEffect(() => {
    initStomt(page)
  }, [])
}
