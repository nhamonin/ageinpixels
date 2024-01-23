import { proxify } from '@/lib/utils';
import { URLS } from '@/constants/urls';
import { ApiResponse, LifeExpectancyParams, LifeExpectancy, Country, CountrySource } from '@/types';

export const fetchLifeExpectancy = async ({
  countryCode,
  sex,
}: LifeExpectancyParams): Promise<{ value: number | null; source: CountrySource }> => {
  const buildFilter = (countryCode: string, sex: string) => {
    return `SpatialDim eq '${countryCode || 'GLOBAL'}' and Dim1 eq '${sex}'`;
  };

  const fetchData = async (filter: string) => {
    const url = proxify(`${URLS.LIFE_EXPECTANCY}?$filter=${encodeURIComponent(filter)}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data: ApiResponse<LifeExpectancy> = await response.json();
    return data.value;
  };

  const countryFilter = buildFilter(countryCode, sex);
  let data = await fetchData(countryFilter);
  let source: CountrySource = countryCode ? 'country' : 'global';

  if (data.length === 0 && countryCode) {
    const globalFilter = buildFilter('GLOBAL', sex);
    data = await fetchData(globalFilter);
    source = 'global';
  }

  if (data.length > 0) {
    const mostRecentData = data
      .filter((entry) => entry.Dim1 === sex && entry.TimeDim)
      .sort((a, b) => b.TimeDim - a.TimeDim)[0];

    return { value: mostRecentData.NumericValue, source };
  }

  return { value: null, source };
};

type CountriesResponse = {
  value: Country[];
};

export const fetchCountries = async (): Promise<Country[]> => {
  const url = proxify(URLS.COUNTRIES);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = (await response.json()) as CountriesResponse;
  if (data && data.value) {
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
  const url = proxify(`${URLS.COUNTRIES}?$filter=Code eq '${countryCode}'`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = (await response.json()) as CountriesResponse;
  if (data && data.value && data.value.length > 0) {
    const country = data.value[0];
    return {
      ...country,
      Title: country.Title.replace(/\s*\(.*?\)\s*/g, ''),
    };
  }
  return null;
};
