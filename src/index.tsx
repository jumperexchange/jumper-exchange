import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'src/fonts/inter.css';
import 'src/fonts/urbanist.css';
import 'src/utils/structuredClone';
import { initSentry } from './config';
import { JUMPER_LEARN_PATH, JUMPER_LOYALTY_PATH } from './const';
import './fonts/inter.css';
import './fonts/urbanist.css';
import { BlogArticlePage, BlogPage, Homepage } from './pages';
import { AppProvider } from './providers';
import { reportWebVitals } from './reportWebVitals';
import { ProfilePage } from './components';
import { LoyaltyPassPage } from './pages/LoyaltyPassPage';

// initSentry();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
const router = createBrowserRouter([
  {
    path: '/*',
    element: <Homepage />,
  },
  {
    path: '/exchange/*',
    element: <Homepage />,
  },
  {
    path: '/swap/*',
    element: <Homepage />,
  },
  {
    path: '/gas/*',
    element: <Homepage />,
  },
  {
    path: '/refuel/*',
    element: <Homepage />,
  },
  {
    path: '/buy/*',
    element: <Homepage />,
  },
  {
    path: '/memecoins/*',
    element: <Homepage />,
  },
  {
    path: JUMPER_LEARN_PATH,
    element: <BlogPage />,
  },
  {
    path: `${JUMPER_LEARN_PATH}/:id`,
    element: <BlogArticlePage />,
  },
  {
    path: JUMPER_LOYALTY_PATH,
    element: <LoyaltyPassPage />,
  },
]);
root.render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
if (import.meta.env.DEV) {
  reportWebVitals(console.log);
}
