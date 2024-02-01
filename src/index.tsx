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
    <div
      style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        textAlign: 'center',
        padding: '10px',
        background: 'rgb(101 0 254 / 10%)',
        fontWeight: 700,
      }}
    >
      we don't take a fee mfkers{' '}
      <img
        alt=""
        width={24}
        height={24}
        style={{ marginLeft: 8 }}
        src="https://cdn.discordapp.com/emojis/911220159967019068.webp?size=96&quality=lossless"
      />
    </div>
    <App />
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  reportWebVitals(console.log);
}
