export type QuestionsInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export type QuestionKey = 'country' | 'sex' | 'birthDate';

export type Question = {
  key: QuestionKey;
  title: string;
  description?: string;
  component: React.FC<{ value: string; onChange: (value: string) => void }>;
};
