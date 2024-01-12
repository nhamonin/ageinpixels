import { proxify } from '@/lib/utils';
import { URLS } from '@/constants/urls';
import { ApiResponse, LifeExpectancyParams, LifeExpectancy, Country } from '@/types';

export const fetchLifeExpectancy = async ({
  countryCode,
  sex,
}: LifeExpectancyParams): Promise<number | null> => {
  let filter = '';
  if (countryCode) {
    filter = `SpatialDim eq '${countryCode}' and Dim1 eq '${sex}'`;
  } else {
    filter = `SpatialDim eq 'GLOBAL' and Dim1 eq '${sex}'`;
  }

  const url = proxify(`${URLS.LIFE_EXPECTANCY}?$filter=${encodeURIComponent(filter)}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data: ApiResponse<LifeExpectancy> = await response.json();

  if (data.value.length === 0) {
    return null;
  }

  const mostRecentData = data.value
    .filter((entry) => entry.Dim1 === sex && entry.TimeDim)
    .sort((a, b) => b.TimeDim - a.TimeDim)[0];

  return mostRecentData.NumericValue;
};

export const fetchCountries = async (): Promise<Country[]> => {
  const url = proxify(URLS.COUNTRIES);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await response.json();
  if (data && data.value) {
    return data.value.map((country: Country) => ({
      ...country,
      Title: country.Title.replace(/\s*\(.*?\)\s*/g, ''),
    }));
  }
  return [];
};
