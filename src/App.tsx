import { useEffect, useRef } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

import { Layout } from '@/components/layout/Layout';
import { Questions } from '@/components/questions/questions';
import { Dashboard } from '@/components/lifeVisualization/Dashboard';

import { useUserData } from './contexts/UserDataContext';

function App() {
  const { userData, updateUserData } = useUserData();
  const dashboardRef = useRef<HTMLDivElement>(null);

  let scrollTimeout: NodeJS.Timeout | null = null;

  const handleCompletedQuestions = () => {
    updateUserData({ ...userData, questionsCompleted: true });

    scrollTimeout = setTimeout(() => {
      if (dashboardRef.current) {
        dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [scrollTimeout]);

  return (
    <Layout>
      <Questions onCompleted={handleCompletedQuestions} />

      {userData.questionsCompleted && <Dashboard ref={dashboardRef} />}

      <ReactQueryDevtools initialIsOpen={false} />
      <Analytics />
      <SpeedInsights />
    </Layout>
  );
}

export default App;
