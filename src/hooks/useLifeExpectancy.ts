import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchLifeExpectancy } from '@/api/ghoapi';
import { useUserData, UserData } from '@/contexts/UserDataContext';

export const useLifeExpectancy = () => {
  const queryClient = useQueryClient();
  const { userData } = useUserData();

  const {
    data: lifeExpectancy,
    isLoading,
    isError,
    error,
  } = useQuery<number | null, Error>({
    queryKey: ['lifeExpectancy', userData.country, userData.sex],
    queryFn: () => fetchLifeExpectancy({ countryCode: userData.country, sex: userData.sex }),
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
    lifeExpectancyUnavailable: lifeExpectancy === null,
    isLoading,
    error: isError ? error : null,
  };
};
