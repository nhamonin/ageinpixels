import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Layout } from '@/components/layout/Layout';
import { Questions } from '@/components/questions/questions';
import { Authors } from '@/components/authors/Authors';
import { AgeVisualization } from '@/components/lifeVisualization/AgeVisualization';

function App() {
  return (
    <>
      <Layout>
        <Questions />
        <AgeVisualization />
        <Authors />
      </Layout>

      <ReactQueryDevtools initialIsOpen={false} />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
