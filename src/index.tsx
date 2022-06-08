import './index.css'

import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import analytics from './services/analytics'
import reportWebVitals from './services/reportWebVitals'

analytics.initialize(process.env.REACT_APP_ANALYTICS_ID)

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Failed to find the root element.')
}
const root = createRoot(rootElement)

switch (process.env.REACT_APP_PACKAGE) {
  case 'transferto.xyz':
  default:
    import('./App').then(({ App }) => {
      root.render(
        <React.StrictMode>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </React.StrictMode>,
      )
    })
    break
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(analytics.sendWebVitals)
