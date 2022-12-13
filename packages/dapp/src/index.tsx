import { createRoot } from 'react-dom/client';
import AppWrapper from './components/AppWrapper';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);

root.render(<AppWrapper />);
