export type SexInternal = 'SEX_MLE' | 'SEX_FMLE' | 'SEX_BTSX';
export type SexHumanReadable = 'male' | 'female' | 'both';

export const sexMapping: { [K in SexInternal]: SexHumanReadable } = {
  SEX_MLE: 'male',
  SEX_FMLE: 'female',
  SEX_BTSX: 'both',
};

export const reverseSexMapping: { [K in SexHumanReadable]: SexInternal } = {
  male: 'SEX_MLE',
  female: 'SEX_FMLE',
  both: 'SEX_BTSX',
};
