import { useQuery } from '@tanstack/react-query';

import { fetchLifeExpectancy } from '@/api/ghoapi';
import { useUserData } from '@/contexts/UserDataContext';
import { CountrySource } from '@/types';

export const useLifeExpectancy = () => {
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
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });

  return {
    lifeExpectancy,
    isLoading,
    error: isError ? error : null,
  };
};
