import { useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { fetchCountries } from '@/api/ghoapi';
import { Country } from '@/types';

export const useCountries = () => {
  const cachedCountries = useMemo(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }
    try {
      const raw = window.localStorage.getItem('countriesCache');
      if (!raw) {
        return undefined;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : undefined;
    } catch {
      return undefined;
    }
  }, []);

  const {
    data: countries = [],
    isLoading,
    isError,
    error,
  } = useQuery<Country[], Error>({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    initialData: cachedCountries,
    initialDataUpdatedAt: cachedCountries ? Date.now() : 0,
    staleTime: 1000 * 60 * 60,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data: Country[]) => data.sort((a, b) => a.Title.localeCompare(b.Title)),
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (countries.length > 0) {
      window.localStorage.setItem('countriesCache', JSON.stringify(countries));
    }
  }, [countries]);

  return {
    countries,
    isLoading,
    error: isError ? error : null,
  };
};
