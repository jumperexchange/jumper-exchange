import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './services/reportWebVitals';
import analytics from './services/analytics';

analytics.initialize(process.env.REACT_APP_ANALYTICS_ID)

switch(process.env.REACT_APP_PACKAGE) {
  case 'lifi':
    import('./App')
      .then(({App}) => {
        ReactDOM.render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
          document.getElementById('root')
        )
      })
    break

  case 'nxtp':
    import('./AppNxtp')
      .then(({AppNxtp}) => {
        ReactDOM.render(
          <React.StrictMode>
            <AppNxtp/>
          </React.StrictMode>,
          document.getElementById('root')
        )
      })
    break
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(analytics.sendWebVitals);
