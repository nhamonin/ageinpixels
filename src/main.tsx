import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { UserDataProvider } from '@/contexts/UserDataContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
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
          <App />
        </UserDataProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
