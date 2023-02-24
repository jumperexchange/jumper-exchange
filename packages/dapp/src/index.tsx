import '@transferto/shared/src/fonts/inter.css';
import { createRoot } from 'react-dom/client';
import { default as App } from './App';
import { initSentry } from './config/initSentry';

initSentry()

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(<App />);

