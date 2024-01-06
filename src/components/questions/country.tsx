import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { useCountries } from '@/hooks/useCountries';
import { QuestionsInputProps } from '@/types';
import { ChevronDown } from 'lucide-react';

export function Country({ value, onChange }: QuestionsInputProps) {
  const { countries, isLoading, error } = useCountries();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chosenCountry, setChosenCountry] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (value && !isTyping) {
      const selectedCountryTitle =
        countries?.find((country) => country.Code === value)?.Title || '';
      setInputValue(selectedCountryTitle);
    }
  }, [value, isTyping, countries]);

  const filteredCountries = inputValue
    ? countries?.filter((country) => country.Title.toLowerCase().includes(inputValue.toLowerCase()))
    : countries;

  const handleSelectCountry = (countryCode: string) => {
    onChange(countryCode);
    setChosenCountry(countries?.find((country) => country.Code === countryCode)?.Title || '');
    setIsTyping(false);
    setPopoverOpen(false);
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue === '') {
      onChange('');
    } else {
      setIsTyping(true);
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger className="text-lg overflow-hidden" asChild>
        <Button
          className="w-full justify-between"
          role="combobox"
          variant="outline"
          onClick={() => setPopoverOpen(true)}
        >
          {chosenCountry || 'Select or search country...'}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            className="h-10"
            value={inputValue}
            onValueChange={handleInputChange}
            onFocus={() => setPopoverOpen(true)}
          />
          {isLoading && <LoadingSpinner className="text-gray-500" size={20} />}
          {error && <CommandEmpty>Error loading countries. Please try again.</CommandEmpty>}
          {!isLoading && !error && (
            <CommandList>
              {filteredCountries?.length ? (
                filteredCountries.map((country) => (
                  <CommandItem
                    key={country.Code}
                    onSelect={() => handleSelectCountry(country.Code)}
                  >
                    {country.Title}
                  </CommandItem>
                ))
              ) : (
                <CommandEmpty>No country found.</CommandEmpty>
              )}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
}
