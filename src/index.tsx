import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'src/fonts/inter.css';
import 'src/utils/structuredClone';
import { initSentry } from './config';
import './fonts/inter.css';
import { BlogArticlePage, BlogPage, Homepage } from './pages';
import { AppProvider } from './providers';
import { reportWebVitals } from './reportWebVitals';

initSentry();

const rootElement = document.getElementById('root');
const root = createRoot(rootElement!);
const router = createBrowserRouter([
  {
    path: '/*',
    element: <Homepage />,
  },
  {
    path: '/exchange',
    element: <Homepage />,
  },
  {
    path: '/swap',
    element: <Homepage />,
  },
  {
    path: '/gas',
    element: <Homepage />,
  },
  {
    path: '/refuel',
    element: <Homepage />,
  },
  {
    path: '/buy',
    element: <Homepage />,
  },
  {
    path: '/blog',
    element: <BlogPage />,
  },
  {
    path: '/blog/:id',
    element: <BlogArticlePage />,
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
