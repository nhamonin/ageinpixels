import { useQuery } from '@tanstack/react-query';

import { fetchCountries } from '@/api/ghoapi';
import { Country } from '@/types';

export const useCountries = () => {
  const {
    data: countries,
    isLoading,
    isError,
    error,
  } = useQuery<Country[], Error>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
  });

  return {
    countries,
    isLoading,
    error: isError ? error : null,
  };
};
