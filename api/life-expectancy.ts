import type { VercelRequest, VercelResponse } from '@vercel/node';

const WHO_LIFE_EXPECTANCY_URL = 'https://ghoapi.azureedge.net/api/WHOSIS_000001';

const SEX_CODES = ['SEX_BTSX', 'SEX_MLE', 'SEX_FMLE'];

type LifeExpectancyRecord = {
  SpatialDim?: string;
  Dim1?: string;
  TimeDim?: number;
  NumericValue?: number;
};

type LifeExpectancyResponse = {
  value?: LifeExpectancyRecord[];
};

const readParam = (param: string | string[] | undefined) =>
  Array.isArray(param) ? param[0] || '' : param || '';

const fetchLatest = async (spatialDim: string, sex: string) => {
  const params = new URLSearchParams({
    $filter: `SpatialDim eq '${spatialDim}' and Dim1 eq '${sex}'`,
    $orderby: 'TimeDim desc',
    $top: '1',
  });

  const response = await fetch(`${WHO_LIFE_EXPECTANCY_URL}?${params}`);
  if (!response.ok) {
    throw new Error(`Upstream responded with ${response.status}`);
  }

  const data = (await response.json()) as LifeExpectancyResponse;
  const record = data.value?.[0];

  return typeof record?.NumericValue === 'number' ? record : null;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  const requestedSex = readParam(req.query.sex).toUpperCase();
  const sex = SEX_CODES.includes(requestedSex) ? requestedSex : 'SEX_BTSX';
  const countryCode = readParam(req.query.country)
    .toUpperCase()
    .replace(/[^A-Z]/g, '');

  try {
    let record = countryCode ? await fetchLatest(countryCode, sex) : null;
    const source = record ? 'country' : 'global';

    if (!record) {
      record = await fetchLatest('GLOBAL', sex);
    }

    if (!record) {
      res.status(502).json({ error: 'No life expectancy data available' });
      return;
    }

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.status(200).json({ value: record.NumericValue, source, year: record.TimeDim });
  } catch {
    res.status(502).json({ error: 'Failed to fetch life expectancy' });
  }
}
