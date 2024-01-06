import { useEffect } from 'react';

import { Country } from '@/components/questions/country';
import { Sex } from '@/components/questions/sex';
import { Birthday } from '@/components/questions/birthday';
import { useUserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';
import { createMarkup } from '@/lib/utils';
import { DEFAULT_LIFE_EXPECTANCY } from '@/constants/defaultLifeExpectancy';

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
    component: Country,
    description:
      'Choose your <b>country</b> for life expectancy figures based on data from the <a href="https://www.who.int/" class="underline">World Health Organization</a>.',
  },
  {
    key: 'sex',
    component: Sex,
    description: 'Your <b>sex</b> is needed for more accurate statistics.',
  },
  {
    key: 'birthDate',
    component: Birthday,
    description:
      'Fill in your <b>birthdate</b> to see your age and the time you have lived compared to expected lifespan.',
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

  useEffect(() => {
    if (
      userData.sex &&
      !userData.country &&
      userData.lifeExpectancy !== DEFAULT_LIFE_EXPECTANCY[userData.sex]
    ) {
      const newLifeExpectancy = DEFAULT_LIFE_EXPECTANCY[userData.sex];
      updateUserData({ ...userData, lifeExpectancy: newLifeExpectancy });
    }
  }, [userData, updateUserData]);

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
