import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initSentry } from 'src/config';
import 'src/fonts/inter.css';
import 'src/utils/structuredClone';
import { App } from './App';
import './fonts/inter.css';
import { reportWebVitals } from './reportWebVitals';

initSentry();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  reportWebVitals(console.log);
}
