import type { VercelRequest, VercelResponse } from '@vercel/node';

const WHO_COUNTRIES_URL =
  'https://ghoapi.azureedge.net/api/DIMENSION/COUNTRY/DimensionValues';

type CountryRecord = {
  Code?: string;
  Title?: string;
};

type CountriesResponse = {
  value?: CountryRecord[];
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }

  try {
    const response = await fetch(WHO_COUNTRIES_URL);
    if (!response.ok) {
      res.status(response.status).json({ error: 'Upstream error' });
      return;
    }

    const data = (await response.json()) as CountriesResponse;
    const normalized = (data.value || [])
      .filter((country) => country.Code)
      .map((country) => ({
        Code: country.Code,
        Title: (country.Title || '').replace(/\s*\(.*?\)\s*/g, ''),
      }));

    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');
    res.status(200).json({ value: normalized });
  } catch {
    res.status(502).json({ error: 'Failed to fetch countries' });
  }
}
