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
        <RadioGroupItem value="MLE" id="sex-male" />
        <Label htmlFor="sex-male" className="cursor-pointer">
          Male
        </Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="FMLE" id="sex-female" />
        <Label htmlFor="sex-female" className="cursor-pointer">
          Female
        </Label>
      </div>
    </RadioGroup>
  );
}
