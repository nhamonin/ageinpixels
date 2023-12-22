import { useQuery } from '@tanstack/react-query';

import { proxify } from '@/lib/utils';
import { Country } from '@/types';
import { URLS } from '@/constants/urls';

const fetchCountries = async (): Promise<Country[]> => {
  const url = proxify(URLS.COUNTRIES);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  if (data && data.value) {
    return data.value.filter((country: Country) => !/\d/.test(country.Code));
  }
  return [];
};

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
