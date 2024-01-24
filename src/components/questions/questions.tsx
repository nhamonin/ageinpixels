import { useEffect } from 'react';

import { Country } from '@/components/questions/country';
import { Sex } from '@/components/questions/sex';
import { Birthday } from '@/components/questions/birthday';
import { UserData, useUserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';
import { createMarkup, getAgeDescriptionText, getCountrySexDescriptionText } from '@/lib/utils';
import { reverseSexMapping, SexHumanReadable } from '@/constants/sexQueryParamMapping';
import { Question, QuestionKey } from '@/types';
import { useQueryParams } from '@/hooks/useQueryParams';
import { useCountry } from '@/hooks/useCountry';

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy } = useLifeExpectancy();
  const { searchParams, setQueryParam } = useQueryParams();
  const { country } = useCountry(userData.country);

  const questions: Question[] = [
    {
      key: 'country',
      component: Country,
      title: 'Select your country and sex',
    },
    {
      key: 'sex',
      component: Sex,
      description: getCountrySexDescriptionText(userData, country?.Title),
    },
    {
      key: 'birthDate',
      title: 'Select your birthdate',
      component: Birthday,
      description: getAgeDescriptionText(userData.birthDate),
      class: 'mt-4',
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
    if (!lifeExpectancy?.value) return;

    const shouldUpdateCountryLifeExpectancy =
      userData.country &&
      lifeExpectancy.source === 'country' &&
      userData.lifeExpectancy !== lifeExpectancy.value;
    const shouldUpdateGlobalLifeExpectancy =
      userData.country &&
      lifeExpectancy.source !== 'country' &&
      userData.globalLifeExpectancy !== lifeExpectancy.value;
    const shouldUpdateGlobalLifeExpectancyNoCountry =
      !userData.country && userData.globalLifeExpectancy !== lifeExpectancy.value;

    if (shouldUpdateCountryLifeExpectancy) {
      updateUserData({ lifeExpectancy: lifeExpectancy.value });
    } else if (shouldUpdateGlobalLifeExpectancy || shouldUpdateGlobalLifeExpectancyNoCountry) {
      updateUserData({ globalLifeExpectancy: lifeExpectancy.value, lifeExpectancy: 0 });
    }
  }, [
    lifeExpectancy?.value,
    lifeExpectancy?.source,
    userData.country,
    userData.lifeExpectancy,
    userData.globalLifeExpectancy,
    updateUserData,
  ]);

  return (
    <section
      className="sm:max-h-auto overflow-visible flex
    flex-col gap-3 sm:gap-5 items-center justify-center sm:w-[300px] my-[var(--questions-my)] sm:my-0"
    >
      {questions.map((question) => (
        <div key={question.key} className={`w-full flex flex-col gap-3 ${question.class || ''}`}>
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
