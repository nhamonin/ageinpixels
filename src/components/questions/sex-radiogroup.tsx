import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { QuestionsInputProps } from '@/types';

export function SexRadiogroup({ value, onChange }: QuestionsInputProps) {
  return (
    <RadioGroup value={value} onValueChange={onChange}>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="male" id="male" />
        <Label htmlFor="male">Male</Label>
      </div>
      <div className="flex items-center space-x-2">
        <RadioGroupItem value="female" id="female" />
        <Label htmlFor="female">Female</Label>
      </div>
    </RadioGroup>
  );
}
