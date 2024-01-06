import { UserData } from '@/contexts/UserDataContext';

export type LifeExpectancy = {
  Id: number;
  IndicatorCode: string;
  SpatialDimType: string;
  SpatialDim: string;
  ParentLocationCode: string;
  TimeDimType: string;
  ParentLocation: string;
  Dim1Type: string;
  Dim1: string;
  TimeDim: number;
  Dim2Type: null;
  Dim2: null;
  Dim3Type: null;
  Dim3: null;
  DataSourceDimType: null;
  DataSourceDim: null;
  Value: string;
  NumericValue: number;
  Low: null;
  High: null;
  Comments: null;
  Date: string;
  TimeDimensionValue: string;
  TimeDimensionBegin: string;
};

export type LifeExpectancyParams = {
  countryCode: string;
  sex: UserData['sex'];
};
