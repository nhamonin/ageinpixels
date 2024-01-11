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

export const Birthday = ({ value, onChange }: QuestionsInputProps) => {
  const [day, month, year] = value ? value.split('-') : ['', '', ''];

  const [localDay, setLocalDay] = useState(day);
  const [localMonth, setLocalMonth] = useState(month);
  const [localYear, setLocalYear] = useState(year);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const currentDay = currentDate.getDate();

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

  const generateDaysOptions = () => {
    const selectedYear = Number(localYear);
    const selectedMonth = Number(localMonth);
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

    const isCurrentYear = selectedYear === currentYear;
    const isCurrentMonth = selectedMonth === currentMonth + 1;
    const isCurrentYearAndCurrentOrJanuaryMonth =
      isCurrentYear && (isCurrentMonth || currentMonth === 1);

    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = index + 1;
      const isFutureDay = isCurrentYearAndCurrentOrJanuaryMonth && day > currentDay;
      const dayOption = String(day).padStart(2, '0');

      return (
        <SelectItem key={dayOption} value={dayOption} disabled={isFutureDay}>
          {dayOption}
        </SelectItem>
      );
    });
  };

  const daysOptions = generateDaysOptions();

  const generateMonthsOptions = () => {
    const isCurrentYear = Number(localYear) === currentYear;
    const selectedDay = parseInt(localDay, 10);

    return months.map((month, index) => {
      const monthIndex = index + 1;
      const monthValue = monthIndex.toString().padStart(2, '0');
      const isFutureMonth = monthIndex > currentMonth;
      const isCurrentMonthWithFutureDay = monthIndex === currentMonth && selectedDay > currentDay;

      const isDisabled = isCurrentYear && (isFutureMonth || isCurrentMonthWithFutureDay);

      return (
        <SelectItem key={month} value={monthValue} disabled={isDisabled}>
          {month}
        </SelectItem>
      );
    });
  };

  const monthsOptions = generateMonthsOptions();

  const generateYearsOptions = () => {
    const daySelected = parseInt(localDay, 10);
    const monthSelected = parseInt(localMonth, 10);

    const isFutureMonth = monthSelected > currentMonth;
    const isFutureDay = monthSelected === currentMonth && daySelected > currentDay;

    const shouldDisableCurrentYear = (year: number) => {
      return year === currentYear && (isFutureMonth || isFutureDay);
    };

    return Array.from({ length: currentYear - 1899 }, (_, index) => {
      const yearValue = (currentYear - index).toString();
      return (
        <SelectItem
          key={yearValue}
          value={yearValue}
          disabled={shouldDisableCurrentYear(currentYear - index)}
        >
          {yearValue}
        </SelectItem>
      );
    });
  };

  const yearOptions = generateYearsOptions();

  return (
    <div className="grid grid-cols-3 gap-[2px]">
      <Select value={localDay} onValueChange={(newValue) => handleInputChange('day', newValue)}>
        <SelectTrigger className="hover:bg-accent hover:text-accent-foreground z-[1]">
          <SelectValue placeholder="DD" />
        </SelectTrigger>
        <SelectContent>{daysOptions}</SelectContent>
      </Select>
      <Select value={localMonth} onValueChange={(newValue) => handleInputChange('month', newValue)}>
        <SelectTrigger className="hover:bg-accent hover:text-accent-foreground z-[1]">
          <SelectValue placeholder="MM">{months[Number(localMonth) - 1]?.slice(0, 3)}</SelectValue>
        </SelectTrigger>
        <SelectContent>{monthsOptions}</SelectContent>
      </Select>
      <Select value={localYear} onValueChange={(newValue) => handleInputChange('year', newValue)}>
        <SelectTrigger className="hover:bg-accent hover:text-accent-foreground z-[1]">
          <SelectValue placeholder="YYYY" />
        </SelectTrigger>
        <SelectContent>{yearOptions}</SelectContent>
      </Select>
    </div>
  );
};
