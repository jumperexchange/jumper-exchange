import '@transferto/shared/src/fonts/inter.css';
import { createRoot } from 'react-dom/client';
import AppWrapper from './components/AppWrapper';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(<AppWrapper />);
