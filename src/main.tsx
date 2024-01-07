import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { UserDataProvider } from '@/contexts/UserDataContext';
import { CameraProvider } from '@/contexts/CameraContext';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UserDataProvider>
          <CameraProvider>
            <App />
          </CameraProvider>
        </UserDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
