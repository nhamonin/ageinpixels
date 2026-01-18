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
    gcTime: 1000 * 60 * 60,
    retry: 2,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    select: (data: Country[]) => {
      if (!Array.isArray(data)) {
        return [];
      }
      return [...data].sort((a, b) => a.Title.localeCompare(b.Title));
    },
  });

  return {
    countries,
    isLoading: isLoading && countries.length === 0,
    error: isError && countries.length === 0 ? error : null,
  };
};
