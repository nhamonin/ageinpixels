import { useEffect, useState } from 'react';

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

    let tempDay = part === 'day' ? partValue : localDay;
    const tempMonth = part === 'month' ? partValue : localMonth;
    const tempYear = part === 'year' ? partValue : localYear;

    const daysInMonth = new Date(Number(tempYear), Number(tempMonth), 0).getDate();

    if (Number(tempDay) > daysInMonth) {
      tempDay = String(daysInMonth);
      setLocalDay(tempDay);
    }

    const isValidDate =
      Number(tempDay) >= 1 &&
      Number(tempDay) <= daysInMonth &&
      Number(tempMonth) >= 1 &&
      Number(tempMonth) <= 12 &&
      Number(tempYear) >= 1900 &&
      Number(tempYear) <= new Date().getFullYear();

    if (isValidDate) {
      const newValue = [tempDay, tempMonth, tempYear].join('-');
      onChange(newValue);
    } else {
      onChange('');
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
    <div className="grid grid-cols-3 gap-[2px]">
      <Select value={localDay} onValueChange={(newValue) => handleInputChange('day', newValue)}>
        <SelectTrigger>
          <SelectValue placeholder="DD" />
        </SelectTrigger>
        <SelectContent>{daysOptions}</SelectContent>
      </Select>
      <Select value={localMonth} onValueChange={(newValue) => handleInputChange('month', newValue)}>
        <SelectTrigger>
          <SelectValue placeholder="MM">{months[Number(localMonth) - 1]?.slice(0, 3)}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map((monthOption, index) => (
            <SelectItem key={monthOption} value={String(index + 1).padStart(2, '0')}>
              {monthOption}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={localYear} onValueChange={(newValue) => handleInputChange('year', newValue)}>
        <SelectTrigger>
          <SelectValue placeholder="YYYY" />
        </SelectTrigger>
        <SelectContent>{yearOptions}</SelectContent>
      </Select>
    </div>
  );
};
