import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchLifeExpectancy } from '@/api/ghoapi';
import { useUserData, UserData } from '@/contexts/UserDataContext';
import { CountrySource } from '@/types';

export const useLifeExpectancy = () => {
  const queryClient = useQueryClient();
  const { userData } = useUserData();

  const {
    data: lifeExpectancy,
    isLoading,
    isError,
    error,
  } = useQuery<{ value: number | null; source: CountrySource } | null, Error>({
    queryKey: ['lifeExpectancy', userData.country, userData.sex],
    queryFn: () => fetchLifeExpectancy({ countryCode: userData.country, sex: userData.sex }),
    retry: false,
  });

  useEffect(() => {
    const sexes = ['SEX_BTSX', 'SEX_MLE', 'SEX_FMLE'] as UserData['sex'][];

    sexes.forEach((sex) => {
      queryClient.prefetchQuery({
        queryKey: ['lifeExpectancy', userData.country, sex],
        queryFn: () => fetchLifeExpectancy({ countryCode: userData.country, sex }),
      });
    });
  }, [queryClient, userData.country]);

  return {
    lifeExpectancy,
    isLoading,
    error: isError ? error : null,
  };
};
