import { FC, ChangeEvent } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type BirthdayInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export const BirthdayInput: FC<BirthdayInputProps> = ({ value, onChange }) => {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="birth-day">Day</Label>
        <Input id="birth-day" max="31" min="1" placeholder="DD" type="number" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-month">Month</Label>
        <Input id="birth-month" max="12" min="1" placeholder="MM" type="number" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-year">Year</Label>
        <Input
          id="birth-year"
          max={new Date().getFullYear()}
          min="1900"
          value={value}
          onChange={handleInputChange}
          placeholder="YYYY"
          type="number"
        />
      </div>
    </div>
  );
};
