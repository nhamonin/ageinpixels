import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Country } from '@/components/questions/country';
import { Sex } from '@/components/questions/sex';
import { Birthday } from '@/components/questions/birthday';
import { UserData, useUserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';
import { createMarkup } from '@/lib/utils';
import {
  sexMapping,
  reverseSexMapping,
  SexInternal,
  SexHumanReadable,
} from '@/constants/sexQueryParamMapping';

type Key = 'country' | 'sex' | 'birthDate';

type Question = {
  key: Key;
  title: string;
  description?: string;
  component: React.FC<{ value: string; onChange: (value: string) => void }>;
};

const questions: Question[] = [
  {
    key: 'country',
    component: Country,
    title: 'Enter or select your country',
    description:
      'Choose your <b>country</b> for life expectancy figures based on data from the <a href="https://www.who.int/" class="underline">World Health Organization</a>.',
  },
  {
    key: 'sex',
    title: 'Select your sex',
    component: Sex,
  },
  {
    key: 'birthDate',
    title: 'Select your birthdate',
    component: Birthday,
  },
];

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy, lifeExpectancyUnavailable } = useLifeExpectancy();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const keys = Array.from(searchParams.keys()) as Key[];

    const queryData = keys.reduce((acc, key) => {
      const value = searchParams.get(key) || '';
      if (key === 'sex') {
        const humanReadableValue = value as SexHumanReadable;
        acc[key] = reverseSexMapping[humanReadableValue];
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Partial<UserData>);

    updateUserData(queryData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const updateQueryParams = (key: Key, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (key === 'sex') {
      const internalValue = value as SexInternal;
      newSearchParams.set(key, sexMapping[internalValue]);
    } else {
      newSearchParams.set(key, value.toLowerCase());
    }

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
    <section
      className="max-h-[var(--questions-height)] sm:max-h-auto overflow-visible flex
    flex-col gap-7 sm:gap-9 items-center justify-center sm:w-[300px] my-[var(--questions-my)] sm:my-0"
    >
      {questions.map((question) => (
        <div key={question.key} className="w-full flex flex-col gap-3">
          {question.title && <h2 className="sm:font-bold font-inter">{question.title}</h2>}
          <question.component
            value={userData[question.key]}
            onChange={(value: string) => updateQueryParams(question.key, value)}
          />
          {question.description && (
            <p
              className="text-xs text-muted z-[1]"
              dangerouslySetInnerHTML={createMarkup(question.description)}
            ></p>
          )}
        </div>
      ))}
    </section>
  );
}
