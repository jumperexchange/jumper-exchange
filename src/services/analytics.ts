import { Metric } from 'web-vitals'

const SCRIPT_ASYNC_ID = 'gaScriptAsyncId'
const SCRIPT_SYNC_ID = 'gaScriptSyncId'
const TIMEOUT = 5000

let promise: Promise<boolean> | null = null

const initialize = (gaCode: string | undefined) => {
  if (!gaCode || gaCode === '') {
    return promise
  }
  if (promise) {
    return promise
  }

  promise = new Promise((resolve, reject) => {
    const head: HTMLHeadElement = document.getElementsByTagName('head')[0]
    const scriptAsync: HTMLScriptElement = document.createElement('script')
    scriptAsync.setAttribute('id', SCRIPT_ASYNC_ID)
    scriptAsync.setAttribute('async', '')

    scriptAsync.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${gaCode}`)
    scriptAsync.onload = () => {
      resolve(true)
    }

    scriptAsync.onerror = (event: Event | string): void => {
      if (typeof event === 'string') {
        reject(`GA4React intialization failed ${event}`)
      } else {
        const error = new Error()
        error.name = 'GA4React intialization failed'
        error.message = JSON.stringify(event, ['message', 'arguments', 'type', 'name'])
        reject(error)
      }
    }

    const scriptSync: HTMLScriptElement = document.createElement('script')

    scriptSync.setAttribute('id', SCRIPT_SYNC_ID)

    let scriptHTML: string = `window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);};
    gtag('js', new Date());
    gtag('config', '${gaCode}');`

    scriptSync.innerHTML = scriptHTML

    const onChangeReadyState = () => {
      switch (document.readyState) {
        case 'interactive':
        case 'complete':
          head.appendChild(scriptAsync)
          head.appendChild(scriptSync)
          document.removeEventListener('readystatechange', onChangeReadyState)
          break
      }
    }

    if (document.readyState !== 'complete') {
      document.addEventListener('readystatechange', onChangeReadyState)
    } else {
      onChangeReadyState()
    }

    setTimeout(() => {
      reject(new Error('Analytics Timeout'))
    }, TIMEOUT)
  })

  promise.catch(() => {
    // failed
    return false
  })
}

const sendWebVitals = ({ id, name, value, delta }: Metric) => {
  // Universal Analytics
  // const data = {
  //   eventCategory: 'Web Vitals',
  //   eventAction: name,
  //   eventValue: Math.round(name === 'CLS' ? value * 1000 : value), // values must be integers
  //   eventLabel: id, // id unique to current page load
  //   nonInteraction: true, // avoids affecting bounce rate
  //   transport: 'beacon', // if browser supports it
  // };

  // Google Analytics 4
  const data = {
    value: delta, // Use `delta` so the value can be summed.
    // Custom params:
    metric_id: id, // Needed to aggregate events
    metric_value: value,
    metric_delta: delta,
  }

  gtag('event', name, data)
}

const sendEvent = (
  action: any,
  label: any,
  category: any,
  nonInteraction: boolean = false,
  // eslint-disable-next-line max-params
): any => {
  return gtag('event', action, {
    event_label: label,
    event_category: category,
    non_interaction: nonInteraction,
  })
}

const sendPageView = (path: string | Location, location?: string | Location, title?: string) => {
  return gtag('event', 'page_view', {
    page_path: path,
    page_location: location || window.location,
    page_title: title || document.title,
  })
}

const gtag = (...args: any) => {
  const w = window as any
  if (w.gtag) {
    w.gtag(...args)
  }
}

const analytics = { initialize, sendPageView, sendEvent, sendWebVitals }

export default analytics
