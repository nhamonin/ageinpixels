import { Questions } from '@/components/questions/questions';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';

import './App.css';

function App() {
  return (
    <>
      <Questions />

      <VercelAnalytics />
    </>
  );
}

export default App;
