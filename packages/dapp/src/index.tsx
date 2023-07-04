// import '@transferto/shared/src/fonts/gt-america.css';
import '@transferto/shared/src/fonts/inter.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { default as App } from './App';
import { initSentry } from './config/initSentry';

initSentry();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
