import { useEffect, useState } from 'react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuestionsInputProps } from '@/types';

export function Sex({ value, onChange }: QuestionsInputProps) {
  const [selectedSex, setSelectedSex] = useState(value);

  useEffect(() => {
    setSelectedSex(value);
  }, [value]);

  const handleSexChange = (newValue: string) => {
    setSelectedSex(newValue);
    onChange(newValue);
  };

  return (
    <RadioGroup
      value={selectedSex}
      onValueChange={handleSexChange}
      className="flex justify-between w-full"
    >
      <Label htmlFor="btsx" className="flex items-center space-x-2 z-[1] text-radio cursor-pointer">
        <RadioGroupItem value="SEX_BTSX" id="btsx" />
        <span>Both</span>
      </Label>
      <Label htmlFor="mle" className="flex items-center space-x-2 z-[1] text-radio cursor-pointer">
        <RadioGroupItem value="SEX_MLE" id="mle" />
        <span>Male</span>
      </Label>
      <Label htmlFor="fmle" className="flex items-center space-x-2 z-[1] text-radio cursor-pointer">
        <RadioGroupItem value="SEX_FMLE" id="fmle" />
        <span>Female</span>
      </Label>
    </RadioGroup>
  );
}
