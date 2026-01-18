import { useQuery } from '@tanstack/react-query';

import { fetchCountries } from '@/api/ghoapi';
import { Country } from '@/types';

export const useCountries = () => {
  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery<Country[], Error>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
    select: (data: Country[]) => {
      if (!Array.isArray(data)) {
        return [];
      }
      return [...data].sort((a, b) => a.Title.localeCompare(b.Title));
    },
  });

  return {
    countries,
    isLoading,
    error: isError ? error : null,
  };
};
