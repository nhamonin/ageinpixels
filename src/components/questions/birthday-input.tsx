import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { QuestionsInputProps } from '@/types';

export const BirthdayInput = ({ value, onChange }: QuestionsInputProps) => {
  const [day, month, year] = value ? value.split('-') : ['', '', ''];

  const [localDay, setLocalDay] = useState(day);
  const [localMonth, setLocalMonth] = useState(month);
  const [localYear, setLocalYear] = useState(year);

  useEffect(() => {
    setLocalDay(day);
    setLocalMonth(month);
    setLocalYear(year);
  }, [day, month, year]);

  const handleInputChange = (part: 'day' | 'month' | 'year', partValue: string) => {
    if (part === 'day') {
      setLocalDay(partValue);
    } else if (part === 'month') {
      setLocalMonth(partValue);
    } else if (part === 'year') {
      setLocalYear(partValue);
    }

    const newDay = part === 'day' ? partValue : localDay;
    const newMonth = part === 'month' ? partValue : localMonth;
    const newYear = part === 'year' ? partValue : localYear;

    const validDay = Number(newDay) >= 1 && Number(newDay) <= 31;
    const validMonth = Number(newMonth) >= 1 && Number(newMonth) <= 12;
    const validYear =
      newYear.length === 4 &&
      Number(newYear) >= 1900 &&
      Number(newYear) <= new Date().getFullYear();
    const validDate = validDay && validMonth && validYear;

    if (validDate) {
      const newValue = [newDay, newMonth, newYear].join('-');

      onChange(newValue);
    }
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label htmlFor="birth-day">Day</Label>
        <Input
          id="birth-day"
          max="31"
          min="1"
          placeholder="DD"
          type="number"
          value={localDay}
          onChange={(e) => handleInputChange('day', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-month">Month</Label>
        <Input
          id="birth-month"
          max="12"
          min="1"
          placeholder="MM"
          type="number"
          value={localMonth}
          onChange={(e) => handleInputChange('month', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="birth-year">Year</Label>
        <Input
          id="birth-year"
          max={new Date().getFullYear()}
          min="1900"
          placeholder="YYYY"
          type="number"
          value={localYear}
          onChange={(e) => handleInputChange('year', e.target.value)}
        />
      </div>
    </div>
  );
};
