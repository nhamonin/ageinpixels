import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import { QuestionsProvider } from './contexts/QuestionsContext';
import { UserDataProvider } from './contexts/UserDataContext';
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
      <QuestionsProvider>
        <UserDataProvider>
          <App />
        </UserDataProvider>
      </QuestionsProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
