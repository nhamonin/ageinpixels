import { useCountries } from '@/hooks/useCountries';

export const useCountry = (countryCode: string) => {
  const { countries, isLoading, error } = useCountries();

  const normalizedCode = countryCode.toUpperCase();
  const country = countryCode
    ? countries.find((c) => c.Code.toUpperCase() === normalizedCode) || null
    : null;

  return {
    country,
    isLoading: !!countryCode && isLoading,
    error,
  };
};
