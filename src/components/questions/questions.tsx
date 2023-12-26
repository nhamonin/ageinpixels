import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CountrySelector } from '@/components/questions/country-selector';
import { SexRadiogroup } from '@/components/questions/sex-radiogroup';
import { BirthdayInput } from '@/components/questions/birthday-input';
import { useUserData, UserData } from '@/contexts/UserDataContext';
import { useLifeExpectancy } from '@/hooks/useLifeExpectancy';

const questions = [
  {
    key: 'country',
    text: 'Where do you live? Select your country.',
    component: CountrySelector,
  },
  {
    key: 'sex',
    text: 'What is your gender? This helps us provide more accurate life expectancy data.',
    component: SexRadiogroup,
  },
  {
    key: 'birthDate',
    text: 'When were you born? Enter your birth date.',
    component: BirthdayInput,
  },
];

type QuestionsProps = {
  onCompleted: () => void;
};

export function Questions({ onCompleted }: QuestionsProps) {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy, lifeExpectancyUnavailable } = useLifeExpectancy();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentInput, setCurrentInput] = useState('');

  useEffect(() => {
    const newInputValue = userData[Object.keys(userData)[currentQuestion] as keyof UserData];
    setCurrentInput(newInputValue !== undefined ? String(newInputValue) : '');
  }, [currentQuestion, userData]);

  useEffect(() => {
    const key = Object.keys(userData)[currentQuestion] as keyof UserData;

    if (currentInput.trim() !== '' && currentInput !== userData[key]) {
      updateUserData({ [key]: currentInput });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentInput, currentQuestion]);

  useEffect(() => {
    if (
      !lifeExpectancyUnavailable &&
      lifeExpectancy !== null &&
      lifeExpectancy !== undefined &&
      lifeExpectancy !== userData.lifeExpectancy
    ) {
      updateUserData({ ...userData, lifeExpectancy });
    }
  }, [lifeExpectancy, userData, updateUserData, lifeExpectancyUnavailable]);

  const Component = questions[currentQuestion].component;

  const handleInputChange = (value: string) => setCurrentInput(value);
  const handlePrevious = () => {
    if (currentQuestion <= 0) return;

    setCurrentQuestion(currentQuestion - 1);
    const prevInputValue = userData[Object.keys(userData)[currentQuestion - 1] as keyof UserData];
    setCurrentInput(prevInputValue !== undefined ? String(prevInputValue) : '');
  };

  const handleNext = () => {
    const key = Object.keys(userData)[currentQuestion] as keyof UserData;
    updateUserData({ [key]: currentInput });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentInput('');
    }
  };

  const handleSubmit = () => {
    const key = Object.keys(userData)[currentQuestion] as keyof UserData;
    updateUserData({ [key]: currentInput, questionsCompleted: true });

    if (isFormComplete()) {
      onCompleted();
    }
  };

  function isFormComplete() {
    const birthDateParts = userData.birthDate.split('-');
    const validBirthDate =
      birthDateParts.length === 3 &&
      birthDateParts.every((part) => part.length > 0) &&
      Number(birthDateParts[2]) >= 1900 &&
      Number(birthDateParts[2]) <= new Date().getFullYear();

    return userData.country && userData.sex && validBirthDate;
  }

  <p className="text-base text-gray-500">{questions[currentQuestion].text}</p>;

  return (
    <section className="w-full md:w-4/5 max-w-7xl py-0 md:py-24 h-[var(--content-height)]">
      <h2 className="text-3xl font-bold text-center tracking-tighter sm:text-4xl md:text-5xl mb-4 md:mb-8">
        Answer the questions below
      </h2>
      <Progress
        className="h-[6px] mt-6 mb:mt-10 mb-6 md:mb-12"
        value={((currentQuestion + 1) / questions.length) * 100}
      />
      <Card>
        <CardContent className="p-4 md:p-8 flex flex-col gap-2 md:gap-6 items-center">
          <h3 className="text-2xl font-semibold">
            Question {currentQuestion + 1} / {questions.length}
          </h3>
          <p className="mb-4 md:mb-12 text-base text-gray-500 text-center">
            {questions[currentQuestion].text}
          </p>
          <div className="w-full">
            <Component value={currentInput} onChange={handleInputChange} />
          </div>
          {lifeExpectancyUnavailable && (
            <div className="text-red-500">
              Life expectancy data is not available for the selected country.
            </div>
          )}
          <div className="mt-4 md:mt-12 flex justify-between w-full">
            <Button
              className="w-1/3"
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            {currentQuestion < questions.length - 1 ? (
              <Button
                className="w-1/3"
                onClick={handleNext}
                disabled={lifeExpectancyUnavailable || currentInput.trim() === ''}
              >
                Next
              </Button>
            ) : (
              <Button
                className="w-1/3"
                onClick={handleSubmit}
                disabled={lifeExpectancyUnavailable || !isFormComplete()}
              >
                Submit
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
