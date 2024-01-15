import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Country } from '@/components/questions/country';
import { Sex } from '@/components/questions/sex';
import { Birthday } from '@/components/questions/birthday';
import { UserData, useUserData } from '@/contexts/UserDataContext';
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
    component: Country,
    description:
      'Choose your <b>country</b> for life expectancy figures based on data from the <a href="https://www.who.int/" class="underline">World Health Organization</a>.',
  },
  {
    key: 'sex',
    component: Sex,
    description: 'Select your <b>sex</b> for more accurate life expectancy statistics.',
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
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    console.log('searchParams');
    const keys = Array.from(searchParams.keys()) as Key[];

    const queryData = keys.reduce(
      (acc, key) => {
        acc[key] = searchParams.get(key) as string;
        return acc;
      },
      {} as Record<Key, string>
    );

    updateUserData(queryData as Partial<UserData>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateQueryParams = (key: Key, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.set(key, value);
    setSearchParams(newSearchParams, { replace: true });
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
    <section className="hidden sm:flex flex-col gap-10 items-center justify-center w-[300px]">
      {questions.map((question) => (
        <div key={question.key} className="w-full flex flex-col gap-2.5">
          {question.text && <h2 className="font-bold text-muted">{question.text}</h2>}
          <question.component
            value={userData[question.key]}
            onChange={(value: string) => updateQueryParams(question.key, value)}
          />
          {question.description && (
            <p
              className="text-sm text-muted z-[1]"
              dangerouslySetInnerHTML={createMarkup(question.description)}
            ></p>
          )}
        </div>
      ))}
    </section>
  );
}
