import { useEffect } from 'react';

import { Country } from '@/components/questions/country';
import { Sex } from '@/components/questions/sex';
import { Birthday } from '@/components/questions/birthday';
import { UserData, useUserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';
import { createMarkup, formatNumber } from '@/lib/utils';
import { reverseSexMapping, SexHumanReadable } from '@/constants/sexQueryParamMapping';
import { Question, QuestionKey } from '@/types';
import { useQueryParams } from '@/hooks/useQueryParams';

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy, lifeExpectancyUnavailable } = useLifeExpectancy();
  const { searchParams, setQueryParam } = useQueryParams();

  const questions: Question[] = [
    {
      key: 'country',
      component: Country,
      title: 'Enter or select your country',
      description: `Age in pixels is based on data from the <a href="https://www.who.int/" class="underline">World Health Organization</a>. Globally, the average life expectancy is <b>${formatNumber(
        userData.lifeExpectancy
      )}</b> years.`,
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

  useEffect(() => {
    const keys = Array.from(searchParams.keys()) as QuestionKey[];

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
            onChange={(value: string) => setQueryParam(question.key, value)}
          />
          {question.description && (
            <p
              className="text-xs text-muted text-justify z-[1]"
              dangerouslySetInnerHTML={createMarkup(question.description)}
            ></p>
          )}
        </div>
      ))}
    </section>
  );
}
