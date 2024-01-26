import { useEffect, useState } from 'react';

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
import { useFullScreen } from '@/hooks/useFullScreen';

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy } = useLifeExpectancy();
  const { searchParams, setQueryParam } = useQueryParams();
  const { country } = useCountry(userData.country);
  const { isFullScreen } = useFullScreen();
  const [opacity, setOpacity] = useState(isFullScreen ? 1 : 0);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isFullScreen) {
      timer = setTimeout(() => {
        setOpacity(1);
      }, 700);
    } else {
      setOpacity(0);
    }
    return () => clearTimeout(timer);
  }, [isFullScreen]);

  return (
    <section
      id="questions"
      className="pt-6 sm:pt-9 md:pt-0 pb-3.5 sm:pb-5 md:pb-0 md:max-h-auto overflow-visible flex
    flex-col gap-3 md:gap-5 items-center justify-center w-full lg:w-[300px] md:my-0 z-0 md:z-[1]"
      style={{ opacity, transition: 'opacity 0.3s' }}
    >
      {questions.map((question) => (
        <div key={question.key} className={`w-full flex flex-col gap-3 ${question.class || ''}`}>
          {question.title && <h2 className="md:font-bold font-inter">{question.title}</h2>}
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
