import { useQuery } from '@tanstack/react-query';

import { fetchCountry } from '@/api/ghoapi';
import { Country } from '@/types';

export const useCountry = (countryCode: string) => {
  const {
    data: country = null,
    isLoading,
    isError,
    error,
  } = useQuery<Country, Error>({
    queryKey: ['country', countryCode],
    queryFn: async () => {
      const result = await fetchCountry(countryCode);
      if (result === null) {
        throw new Error('Country data not found');
      }
      return result;
    },
  });

  return {
    country,
    isLoading,
    error: isError ? error : null,
  };
};
