import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserDataProvider } from '@/contexts/UserDataContext';
import { CameraProvider } from '@/contexts/CameraContext';
import './index.css';

const BrowserRouter = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);

const HOUR_IN_MILLISECONDS = 3600000;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: HOUR_IN_MILLISECONDS,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserDataProvider>
          <CameraProvider>
            <RouterProvider router={BrowserRouter} />
          </CameraProvider>
        </UserDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
