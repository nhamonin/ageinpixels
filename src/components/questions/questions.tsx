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
    text: 'Select your country',
    component: CountrySelector,
  },
  {
    text: 'Specify your sex',
    component: SexRadiogroup,
  },
  {
    text: 'Enter your birth date',
    component: BirthdayInput,
  },
];

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const { lifeExpectancy } = useLifeExpectancy();
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
    if (lifeExpectancy && lifeExpectancy !== userData.lifeExpectancy) {
      updateUserData({ ...userData, lifeExpectancy });
    }
  }, [lifeExpectancy, userData, updateUserData]);

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
    updateUserData({ [key]: currentInput });
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
    <main className="min-h-screen bg-white dark:bg-gray-800">
      <section className="py-12 md:py-24">
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8">
              Answer the questions below
            </h2>
          </div>
          <div className="w-full h-[6px] bg-gray-200 mt-10 mb-12 rounded-full">
            <Progress
              className="h-full rounded-full"
              value={((currentQuestion + 1) / questions.length) * 100}
            />
          </div>
          <Card>
            <CardContent className="p-8 flex flex-col gap-6 items-center">
              <h3 className="text-2xl font-semibold">
                Question {currentQuestion + 1} / {questions.length}
              </h3>
              <p className="text-base text-gray-500">{questions[currentQuestion].text}</p>
              <div className="my-12 w-full">
                <Component value={currentInput} onChange={handleInputChange} />
              </div>
              <div className="flex justify-between w-full">
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
                    disabled={currentInput.trim() === ''}
                  >
                    Next
                  </Button>
                ) : (
                  <Button className="w-1/3" onClick={handleSubmit} disabled={!isFormComplete()}>
                    Submit
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
