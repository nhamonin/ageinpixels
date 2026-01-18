import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

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
import { Country as CountryType, QuestionsInputProps } from '@/types';

const BANNED_COUNTRIES = ['RUS'];

export function Country({ value, onChange }: QuestionsInputProps) {
  const { countries, isLoading, error } = useCountries() as {
    countries: CountryType[];
    isLoading: boolean;
    error: Error | null;
  };
  const [inputValue, setInputValue] = useState('');
  const [chosenCountry, setChosenCountry] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!value) {
      setChosenCountry('');
      return;
    }
    
    if (!countries || countries.length === 0) {
      return;
    }

    const lowerCaseValue = value.toLowerCase();
    const selectedCountry = countries.find((country) => country.Code.toLowerCase() === lowerCaseValue);
    
    if (selectedCountry) {
      setChosenCountry(selectedCountry.Title);
    } else {
      setChosenCountry('');
    }
  }, [value, countries]);

  const filteredCountries = inputValue
    ? countries?.filter(
        (country) =>
          country.Title.toLowerCase().includes(inputValue.toLowerCase()) ||
          country.Code.toLowerCase().includes(inputValue.toLowerCase())
      )
    : countries;

  const handleSelectCountry = (countryCode: string) => {
    const selectedCountry = countries?.find((country) => country.Code === countryCode);
    if (selectedCountry) {
      onChange(countryCode);
      setChosenCountry(selectedCountry.Title);
      setPopoverOpen(false);
      setInputValue('');
    }
  };

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    if (newValue === '') {
      onChange('');
    }
  };

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger className="overflow-hidden transition-none z-[1]" asChild>
        <Button
          className="w-full flex justify-between items-center overflow-hidden text-base"
          role="combobox"
          variant="outline"
          onClick={() => setPopoverOpen(true)}
        >
          <span className={`truncate mr-2 ${!chosenCountry && 'text-muted'}`}>
            {chosenCountry || 'Select or search country...'}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--content-width)] md:w-[300px] p-0" sideOffset={0}>
        <Command>
          <CommandInput
            className="h-10"
            value={inputValue}
            onValueChange={handleInputChange}
            onFocus={() => setPopoverOpen(true)}
          />
          {isLoading && (
            <LoadingSpinner className="text-gray-500" size={10} width={'100%'} height={'20px'} />
          )}
          {error && <CommandEmpty>Error loading countries. Please try again later.</CommandEmpty>}
          {!isLoading && !error && (
            <CommandList>
              {filteredCountries?.length ? (
                filteredCountries.map((country) => (
                  <CommandItem
                    key={country.Code}
                    onSelect={() => handleSelectCountry(country.Code)}
                    disabled={BANNED_COUNTRIES.includes(country.Code)}
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
