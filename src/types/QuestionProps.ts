export type CountrySelectorProps = {
  value: string;
  onChange: (country: string) => void;
};

export type SexRadioGroupProps = {
  value: string;
  onChange: (sex: string) => void;
};

export type BirthdayInputProps = {
  value: Date;
  onChange: (date: Date) => void;
};
