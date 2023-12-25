import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/loading';
import { useCountries } from '@/hooks/useCountries';
import { QuestionsInputProps } from '@/types';

export function CountrySelector({ value, onChange }: QuestionsInputProps) {
  const { countries, isLoading, error } = useCountries();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingSpinner className="text-gray-500" size={20} />;
    }

    if (error) {
      return 'Error loading countries. Please try again.';
    }

    if (!countries?.length) {
      return 'No countries available.';
    }

    return countries.map((country) => (
      <SelectItem key={country.Code} value={country.Code}>
        {country.Title}
      </SelectItem>
    ));
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={isLoading || error ? '' : 'Select a country'} />
      </SelectTrigger>
      <SelectContent>{renderContent()}</SelectContent>
    </Select>
  );
}
