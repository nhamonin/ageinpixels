import { useEffect } from 'react';

import { CountrySelector } from '@/components/questions/country';
import { SexSelect } from '@/components/questions/sex';
import { BirthdayInput } from '@/components/questions/birthday';
import { useUserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';
import { createMarkup } from '@/lib/utils';

type Key = 'country' | 'sex' | 'birthDate';

type Question = {
  key: Key;
  text?: string;
  description?: string;
  component: React.FC<{ value: string; onChange: (value: string) => void }>;
};

const questions: Question[] = [
  {
    key: 'country',
    component: CountrySelector,
    description:
      'Choose your country to get a more accurate life expectancy. Source: <a href="https://www.who.int/" class="underline">World Health Organization</a>.',
  },
  {
    key: 'sex',
    description: 'Gender affects life expectancy.',
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
          {question.description && (
            <p
              className="text-sm text-muted"
              dangerouslySetInnerHTML={createMarkup(question.description)}
            ></p>
          )}
        </div>
      ))}
    </section>
  );
}
