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
    select: (data) => data.sort((a, b) => a.Title.localeCompare(b.Title)),
  });

  return {
    countries,
    isLoading,
    error: isError ? error : null,
  };
};
