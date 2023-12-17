import { ChangeEvent } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { BirthdayInputProps } from '@/types';

export const BirthdayInput = ({ value, onChange }: BirthdayInputProps) => {
  const day = value ? value.getDate() : '';
  const month = value ? value.getMonth() + 1 : '';
  const year = value ? value.getFullYear() : '';

  const handleDayChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(value);
    newDate.setDate(parseInt(e.target.value));
    onChange(newDate);
  };

  const handleMonthChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(value);
    newDate.setMonth(parseInt(e.target.value) - 1);
    onChange(newDate);
  };

  const handleYearChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(value);
    newDate.setFullYear(parseInt(e.target.value));
    onChange(newDate);
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="birth-day">Day</Label>
        <Input
          id="birth-day"
          max="31"
          min="1"
          value={day}
          onChange={handleDayChange}
          placeholder="DD"
          type="number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-month">Month</Label>
        <Input
          id="birth-month"
          max="12"
          min="1"
          value={month}
          onChange={handleMonthChange}
          placeholder="MM"
          type="number"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-year">Year</Label>
        <Input
          id="birth-year"
          max={new Date().getFullYear()}
          min="1900"
          value={year}
          onChange={handleYearChange}
          placeholder="YYYY"
          type="number"
        />
      </div>
    </div>
  );
};
