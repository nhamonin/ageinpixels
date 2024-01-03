import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Layout } from '@/components/layout/Layout';
import { Questions } from '@/components/questions/questions';
import { Dashboard } from '@/components/lifeVisualization/Dashboard';

function App() {
  return (
    <>
      <Layout>
        <Questions />
        <Dashboard />
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
