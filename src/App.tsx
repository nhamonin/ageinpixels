import { Questions } from '@/components/questions/questions';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Questions />

      <ReactQueryDevtools initialIsOpen={false} />
      <VercelAnalytics />
    </QueryClientProvider>
  );
}

export default App;
