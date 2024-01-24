export type QuestionsInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export type QuestionKey = 'country' | 'sex' | 'birthDate';

export type Question = {
  key: QuestionKey;
  component: React.FC<{ value: string; onChange: (value: string) => void }>;
  title?: string;
  description?: string;
  class?: string;
};
