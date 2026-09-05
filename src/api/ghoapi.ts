import { URLS } from '@/constants/urls';
import { Country, CountrySource, LifeExpectancyParams } from '@/types';

const FALLBACK_LIFE_EXPECTANCY: Record<string, number> = {
  SEX_BTSX: 73.0,
  SEX_MLE: 70.0,
  SEX_FMLE: 76.0,
};

const fetchJson = async <T>(url: string, retries = 0, timeoutMs = 20000): Promise<T> => {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      try {
        const response = await fetch(url, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        return (await response.json()) as T;
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }

  throw new Error('Failed to fetch after retries');
};

type LifeExpectancyResponse = {
  value: number | null;
  source: CountrySource;
};

export const fetchLifeExpectancy = async ({
  countryCode,
  sex,
}: LifeExpectancyParams): Promise<{ value: number | null; source: CountrySource }> => {
  const fallbackValue = FALLBACK_LIFE_EXPECTANCY[sex] || FALLBACK_LIFE_EXPECTANCY.SEX_BTSX;

  const params = new URLSearchParams({ sex });
  if (countryCode) {
    params.set('country', countryCode.toUpperCase());
  }

  try {
    const data = await fetchJson<LifeExpectancyResponse>(`${URLS.LIFE_EXPECTANCY}?${params}`, 0, 8000);

    if (typeof data?.value !== 'number') {
      return { value: fallbackValue, source: 'global' };
    }

    return { value: data.value, source: data.source === 'country' ? 'country' : 'global' };
  } catch (error) {
    console.warn('WHO API unavailable, using fallback values.', error);
    return { value: fallbackValue, source: 'global' };
  }
};

type CountriesResponse = {
  value: Country[];
};

export const fetchCountries = async (): Promise<Country[]> => {
  const data = await fetchJson<CountriesResponse>(URLS.COUNTRIES, 1, 30000);

  if (data && Array.isArray(data.value)) {
    return data.value
      .filter((country) => !!country.Code)
      .map((country) => ({
        ...country,
        Title: country.Title.replace(/\s*\(.*?\)\s*/g, ''),
      }));
  }

  return [];
};
