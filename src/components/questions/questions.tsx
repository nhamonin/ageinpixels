import { CountrySelector } from '@/components/questions/country';
import { SexSelect } from '@/components/questions/sex';
import { BirthdayInput } from '@/components/questions/birthday';
import { useUserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';
import { useEffect } from 'react';

type Key = 'country' | 'sex' | 'birthDate';

type Question = {
  key: Key;
  text?: string;
  component: React.FC<{ value: string; onChange: (value: string) => void }>;
};

const questions: Question[] = [
  {
    key: 'country',
    component: CountrySelector,
  },
  {
    key: 'sex',
    component: SexSelect,
  },
  {
    key: 'birthDate',
    text: 'Date of birth',
    component: BirthdayInput,
  },
];

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy, lifeExpectancyUnavailable } = useLifeExpectancy();

  const handleInputChange = (key: Key, value: string) => {
    updateUserData({ [key]: value });
  };

  useEffect(() => {
    if (
      !lifeExpectancyUnavailable &&
      lifeExpectancy &&
      lifeExpectancy !== userData.lifeExpectancy
    ) {
      updateUserData({ ...userData, lifeExpectancy });
    }
  }, [lifeExpectancy, userData, updateUserData, lifeExpectancyUnavailable]);

  return (
    <section className="flex flex-col gap-10 items-center justify-center w-[300px]">
      {questions.map((question) => (
        <div key={question.key} className="w-full flex flex-col gap-2.5">
          {question.text && <h2 className="font-bold text-muted">{question.text}</h2>}
          <question.component
            value={userData[question.key]}
            onChange={(value: string) => handleInputChange(question.key, value)}
          />
        </div>
      ))}
    </section>
  );
}
