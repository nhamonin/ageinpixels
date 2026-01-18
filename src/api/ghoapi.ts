import { proxify } from '@/lib/utils';
import { URLS } from '@/constants/urls';
import { ApiResponse, LifeExpectancyParams, LifeExpectancy, Country, CountrySource } from '@/types';

const FALLBACK_LIFE_EXPECTANCY: Record<string, number> = {
  SEX_BTSX: 73.0,
  SEX_MLE: 70.0,
  SEX_FMLE: 76.0,
};

const fetchWithProxy = async <T>(url: string, retries = 0, timeoutMs = 20000): Promise<T> => {
  const proxiedUrl = proxify(url);
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
      const response = await fetch(proxiedUrl, { signal: controller.signal });
      clearTimeout(timeoutId);
      const contentType = response.headers.get('content-type') || '';
      const isHtmlResponse = contentType.includes('text/html');
      
      const text = await response.text();
      
      if (!response.ok || isHtmlResponse || text.startsWith('<html>')) {
        if (text.startsWith('<html>')) {
          if (attempt < retries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
            continue;
          }
          throw new Error(`WHO API returned 500 error. The API may be temporarily unavailable.`);
        }
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      
      try {
        return JSON.parse(text) as T;
      } catch (parseError) {
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
          continue;
        }
        throw new Error(`Failed to parse JSON response: ${text.substring(0, 100)}`);
      }
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
  
  throw new Error('Failed to fetch after retries');
};

export const fetchLifeExpectancy = async ({
  countryCode,
  sex,
}: LifeExpectancyParams): Promise<{ value: number | null; source: CountrySource }> => {
  const normalizedCountry = countryCode ? countryCode.toUpperCase() : '';
  const fallbackValue = FALLBACK_LIFE_EXPECTANCY[sex] || FALLBACK_LIFE_EXPECTANCY.SEX_BTSX;

  try {
    const data = await fetchWithProxy<ApiResponse<LifeExpectancy>>(URLS.LIFE_EXPECTANCY, 0);
    if (!data?.value?.length) {
      return { value: fallbackValue, source: 'global' };
    }

    let filteredData = data.value.filter((entry) => {
      const matchesSex = entry.Dim1 === sex;
      const matchesCountry = normalizedCountry
        ? entry.SpatialDim === normalizedCountry
        : entry.SpatialDim === 'GLOBAL';
      return matchesSex && matchesCountry && entry.TimeDim;
    });

    let source: CountrySource = normalizedCountry ? 'country' : 'global';

    if (filteredData.length === 0 && normalizedCountry) {
      filteredData = data.value.filter((entry) => {
        return entry.Dim1 === sex && entry.SpatialDim === 'GLOBAL' && entry.TimeDim;
      });
      source = 'global';
    }

    if (filteredData.length > 0) {
      const mostRecentData = filteredData.sort((a, b) => b.TimeDim - a.TimeDim)[0];
      return { value: mostRecentData.NumericValue, source };
    }

    return { value: fallbackValue, source: 'global' };
  } catch (error) {
    console.warn('WHO API unavailable, using fallback values.', error);
    return { value: fallbackValue, source: 'global' };
  }
};

type CountriesResponse = {
  value: Country[];
};

export const fetchCountries = async (): Promise<Country[]> => {
  const data = await fetchWithProxy<CountriesResponse>(URLS.COUNTRIES, 1, 30000);
  if (data && data.value && Array.isArray(data.value)) {
    return data.value
      .filter((country) => !!country.Code)
      .map((country) => ({
        ...country,
        Title: country.Title.replace(/\s*\(.*?\)\s*/g, ''),
      }));
  }
  return [];
};

export const fetchCountry = async (countryCode: string): Promise<Country | null> => {
  if (!countryCode) {
    return null;
  }
  const allCountries = await fetchCountries();
  const country = allCountries.find((c) => c.Code === countryCode);
  if (country) {
    return country;
  }
  return null;
};
