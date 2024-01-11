import { useState } from 'react';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuestionsInputProps } from '@/types';

export function Sex({ value, onChange }: QuestionsInputProps) {
  const [selectedSex, setSelectedSex] = useState(value);

  const handleSexChange = (newValue: string) => {
    setSelectedSex(newValue);
    onChange(newValue);
  };

  return (
    <RadioGroup value={selectedSex} onValueChange={handleSexChange} className="flex space-x-4">
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="SEX_BTSX" id="btsx" />
        <Label htmlFor="btsx" className="cursor-pointer">
          Both sexes
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="SEX_MLE" id="mle" />
        <Label htmlFor="mle" className="cursor-pointer">
          Male
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="SEX_FMLE" id="fmle" />
        <Label htmlFor="fmle" className="cursor-pointer">
          Female
        </Label>
      </div>
    </RadioGroup>
  );
}
