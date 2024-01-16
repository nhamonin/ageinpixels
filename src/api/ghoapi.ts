import { proxify } from '@/lib/utils';
import { URLS } from '@/constants/urls';
import { ApiResponse, LifeExpectancyParams, LifeExpectancy, Country } from '@/types';

export const fetchLifeExpectancy = async ({
  countryCode,
  sex,
}: LifeExpectancyParams): Promise<number | null> => {
  const buildFilter = (countryCode: string, sex: string) => {
    return `SpatialDim eq '${countryCode || 'GLOBAL'}' and Dim1 eq '${sex}'`;
  };

  const fetchData = async (filter: string) => {
    console.log({ filter });
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

  if (data.length === 0 && countryCode) {
    const globalFilter = buildFilter('GLOBAL', sex);
    data = await fetchData(globalFilter);
  }

  if (data.length > 0) {
    const mostRecentData = data
      .filter((entry) => entry.Dim1 === sex && entry.TimeDim)
      .sort((a, b) => b.TimeDim - a.TimeDim)[0];

    return mostRecentData.NumericValue;
  }

  return null;
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
