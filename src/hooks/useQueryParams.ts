import { useSearchParams } from 'react-router-dom';

import { SexInternal, sexMapping } from '@/constants/sexQueryParamMapping';
import { QuestionKey } from '@/types';

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setQueryParam = (key: QuestionKey, value: string) => {
    const newSearchParams = new URLSearchParams(searchParams);

    if (key === 'sex') {
      const internalValue = value as SexInternal;
      newSearchParams.set(key, sexMapping[internalValue]);
    } else {
      newSearchParams.set(key, value.toLowerCase());
    }

    setSearchParams(newSearchParams, { replace: true });
  };

  return { searchParams, setQueryParam };
};
