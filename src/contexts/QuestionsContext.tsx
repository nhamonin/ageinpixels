import { createContext, useState, useContext, ReactNode } from 'react';

type QuestionsContextType = {
  questionsCompleted: boolean;
  setQuestionsCompleted: (completed: boolean) => void;
};

const QuestionsContext = createContext<QuestionsContextType | undefined>(undefined);

export const useQuestionsContext = () => {
  const context = useContext(QuestionsContext);
  if (!context) {
    throw new Error('useQuestionsContext must be used within a QuestionsProvider');
  }
  return context;
};

export const QuestionsProvider = ({ children }: { children: ReactNode }) => {
  const [questionsCompleted, setQuestionsCompleted] = useState(false);

  return (
    <QuestionsContext.Provider value={{ questionsCompleted, setQuestionsCompleted }}>
      {children}
    </QuestionsContext.Provider>
  );
};
