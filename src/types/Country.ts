export type Country = {
  Code: string;
  Title: string;
  Dimension: string;
  ParentDimension: string;
  ParentCode: string;
  ParentTitle: string;
};

export type CountrySource = 'country' | 'global';
