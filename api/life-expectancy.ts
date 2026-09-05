import type { VercelRequest, VercelResponse } from '@vercel/node';

const WHO_LIFE_EXPECTANCY_URL = 'https://ghoapi.azureedge.net/api/WHOSIS_000001';

const SEX_CODES = ['SEX_BTSX', 'SEX_MLE', 'SEX_FMLE'];
const UPSTREAM_TIMEOUT_MS = 4000;

const FALLBACK_LIFE_EXPECTANCY: Record<string, number> = {
  SEX_BTSX: 73.0,
  SEX_MLE: 70.0,
  SEX_FMLE: 76.0,
};

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

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const response = await fetch(`${WHO_LIFE_EXPECTANCY_URL}?${params}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Upstream responded with ${response.status}`);
    }

    const data = (await response.json()) as LifeExpectancyResponse;
    const record = data.value?.[0];

    return typeof record?.NumericValue === 'number' ? record : null;
  } finally {
    clearTimeout(timeoutId);
  }
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

  const [countryResult, globalResult] = await Promise.allSettled([
    countryCode ? fetchLatest(countryCode, sex) : Promise.resolve(null),
    fetchLatest('GLOBAL', sex),
  ]);

  const countryRecord = countryResult.status === 'fulfilled' ? countryResult.value : null;
  const globalRecord = globalResult.status === 'fulfilled' ? globalResult.value : null;

  const degraded = countryResult.status === 'rejected' || (!countryRecord && !globalRecord);

  res.setHeader(
    'Cache-Control',
    degraded ? 's-maxage=60' : 's-maxage=86400, stale-while-revalidate=3600'
  );

  if (countryRecord) {
    res
      .status(200)
      .json({ value: countryRecord.NumericValue, source: 'country', year: countryRecord.TimeDim });
    return;
  }

  if (globalRecord) {
    res
      .status(200)
      .json({ value: globalRecord.NumericValue, source: 'global', year: globalRecord.TimeDim });
    return;
  }

  res.status(200).json({ value: FALLBACK_LIFE_EXPECTANCY[sex], source: 'global', year: null });
}
