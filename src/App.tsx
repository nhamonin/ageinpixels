import { useEffect, useRef } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import { Questions } from '@/components/questions/questions';
import { Dashboard } from '@/components/lifeVisualization/Dashboard';
import { useQuestionsContext } from './contexts/QuestionsContext';

import './App.css';

function App() {
  const { questionsCompleted } = useQuestionsContext();
  const dashboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (questionsCompleted && dashboardRef.current) {
      dashboardRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [questionsCompleted]);

  return (
    <>
      <Questions />
      <Dashboard ref={dashboardRef} />

      <ReactQueryDevtools initialIsOpen={false} />
      <VercelAnalytics />
    </>
  );
}

export default App;
