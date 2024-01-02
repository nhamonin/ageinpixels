import { useState, useEffect } from 'react';

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

export function CountrySelector({ value, onChange }: QuestionsInputProps) {
  const { countries, isLoading, error } = useCountries();
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (value && !isTyping) {
      const selectedCountryTitle = countries?.find(country => country.Code === value)?.Title || '';
      setInputValue(selectedCountryTitle);
    }
  }, [value, isTyping, countries]);

  const filteredCountries = inputValue
    ? countries?.filter((country) =>
        country.Title.toLowerCase().startsWith(inputValue.toLowerCase())
      )
    : [];

  const handleSelectCountry = (countryCode: string) => {
    onChange(countryCode);
    setIsTyping(false);
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
    <Command>
      <CommandInput
        placeholder="Search country..."
        value={inputValue}
        onValueChange={handleInputChange}
      />
      <CommandList>
        {isLoading && <LoadingSpinner className="text-gray-500" size={20} />}
        {error && <CommandEmpty>Error loading countries. Please try again.</CommandEmpty>}
        {!isLoading && !error && isTyping && inputValue.length > 0 && (
          <>
            {filteredCountries?.length ? (
              filteredCountries.map((country) => (
                <CommandItem
                  key={country.Code}
                  onSelect={() => handleSelectCountry(country.Code)}
                  value={country.Title}
                >
                  {country.Title}
                </CommandItem>
              ))
            ) : (
              <CommandEmpty>No countries found.</CommandEmpty>
            )}
          </>
        )}
      </CommandList>
    </Command>
  );
}
