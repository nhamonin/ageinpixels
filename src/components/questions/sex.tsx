import { useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { QuestionsInputProps } from '@/types';

export function SexSelect({ value, onChange }: QuestionsInputProps) {
  const [selectedSex, setSelectedSex] = useState(value);

  const handleSexChange = (newValue: string) => {
    setSelectedSex(newValue);
    onChange(newValue);
  };

  return (
    <Select value={selectedSex} onValueChange={handleSexChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select Sex" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="MLE">Male</SelectItem>
        <SelectItem value="FMLE">Female</SelectItem>
      </SelectContent>
    </Select>
  );
}
