import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Layout } from '@/components/layout/Layout';
import { Questions } from '@/components/questions/questions';
import { AgeVisualization } from '@/components/lifeVisualization/AgeVisualization';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';

function App() {
  useLifeExpectancy();

  return (
    <>
      <Layout>
        <Questions />
        <AgeVisualization />
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
