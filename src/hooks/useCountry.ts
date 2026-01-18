import { useQuery } from '@tanstack/react-query';

import { fetchCountry } from '@/api/ghoapi';
import { Country } from '@/types';

export const useCountry = (countryCode: string) => {
  const {
    data: country,
    isLoading,
    isError,
    error,
  } = useQuery<Country | null, Error>({
    queryKey: ['country', countryCode],
    queryFn: async () => {
      if (!countryCode) {
        return null;
      }
      const result = await fetchCountry(countryCode);
      if (result === null) {
        throw new Error('Country data not found');
      }
      return result;
    },
    enabled: !!countryCode,
  });

  return {
    country: country || null,
    isLoading,
    error: isError ? error : null,
  };
};
