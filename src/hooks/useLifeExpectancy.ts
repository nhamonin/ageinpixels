import { useQuery } from '@tanstack/react-query';
import { fetchLifeExpectancy } from '@/api/ghoapi';
import { useUserData } from '@/contexts/UserDataContext';

export const useLifeExpectancy = () => {
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

  return {
    lifeExpectancy,
    lifeExpectancyUnavailable: lifeExpectancy === null,
    isLoading,
    error: isError ? error : null,
  };
};
