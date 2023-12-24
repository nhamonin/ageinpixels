import { useEffect, useRef, useState } from 'react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import { Questions } from '@/components/questions/questions';
import { Dashboard } from '@/components/lifeVisualization/Dashboard';

import './App.css';

function App() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [questionsCompleted, setQuestionsCompleted] = useState(false);
  let scrollTimeout: NodeJS.Timeout | null = null;

  const handleCompletedQuestions = () => {
    setQuestionsCompleted(true);

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
    <>
      <Questions onCompleted={handleCompletedQuestions} />

      {questionsCompleted && <Dashboard ref={dashboardRef} />}

      <ReactQueryDevtools initialIsOpen={false} />
      <VercelAnalytics />
    </>
  );
}

export default App;
