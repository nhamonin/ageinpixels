import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuestionsInputProps } from '@/types';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

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

  const generateDaysOptions = (selectedMonth: string) => {
    const daysInMonth = new Date(Number(localYear), Number(selectedMonth), 0).getDate();
    const daysOptions = Array.from({ length: daysInMonth }, (_, index) =>
      String(index + 1).padStart(2, '0')
    );

    return daysOptions.map((dayOption) => (
      <SelectItem key={dayOption} value={dayOption}>
        {dayOption}
      </SelectItem>
    ));
  };

  const daysOptions = generateDaysOptions(localMonth);

  const generateYearsOptions = () => {
    const currentYear = new Date().getFullYear();
    const yearsOptions = [];

    for (let year = currentYear; year >= 1900; year--) {
      yearsOptions.push(year.toString());
    }

    return yearsOptions.map((yearOption) => (
      <SelectItem key={yearOption} value={yearOption}>
        {yearOption}
      </SelectItem>
    ));
  };

  const yearOptions = generateYearsOptions();

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="space-y-2">
        <Label>Day</Label>
        <Select value={localDay} onValueChange={(newValue) => handleInputChange('day', newValue)}>
          <SelectTrigger>
            <SelectValue placeholder="DD" />
          </SelectTrigger>
          <SelectContent>{daysOptions}</SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Month</Label>
        <Select
          value={localMonth}
          onValueChange={(newValue) => handleInputChange('month', newValue)}
        >
          <SelectTrigger>
            <SelectValue placeholder="MM">
              {months[Number(localMonth) - 1]?.slice(0, 3)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {months.map((monthOption, index) => (
              <SelectItem key={monthOption} value={String(index + 1).padStart(2, '0')}>
                {monthOption}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Year</Label>
        <Select value={localYear} onValueChange={(newValue) => handleInputChange('year', newValue)}>
          <SelectTrigger>
            <SelectValue placeholder="YYYY" />
          </SelectTrigger>
          <SelectContent>{yearOptions}</SelectContent>
        </Select>
      </div>
    </div>
  );
};
