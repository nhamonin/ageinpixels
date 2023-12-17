import { useState, FC } from 'react';

import { Button } from '@/components/ui/button';
import { CardContent, Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CountrySelector } from '@/components/country-selector';
import { SexRadiogroup } from '@/components/sex-radiogroup';
import { BirthdayInput } from '@/components/birthday-input';
import { useUserData, UserData } from '@/contexts/UserDataContext';

type Question = {
  id: number;
  text: string;
  component: FC;
};

const questions: Question[] = [
  {
    id: 0,
    text: 'Select your country',
    component: CountrySelector,
  },
  {
    id: 1,
    text: 'Specify your sex',
    component: SexRadiogroup,
  },
  {
    id: 2,
    text: 'Enter your birth date',
    component: BirthdayInput,
  },
];

export function Questions() {
  const { userData, updateUserData } = useUserData();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentInput, setCurrentInput] = useState<string | Date | null>(null);
  const currentQuestionData = questions[currentQuestion];

  const handleInputChange = (value: string | Date) => {
    setCurrentInput(value);
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleNext = () => {
    // Update context with current input
    const key = Object.keys(userData)[currentQuestion] as keyof UserData;
    updateUserData({ [key]: currentInput });

    // Move to next question or handle submit
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      // Reset current input for the next question
      setCurrentInput(null);
    } else {
      // Handle form submission here
      console.log('Form submission:', userData);
    }
  };

  const Component = currentQuestionData.component;

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
              <p className="text-base text-gray-500">{currentQuestionData.text}</p>
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
                <Button className="w-1/3" onClick={handleNext}>
                  {currentQuestion === questions.length - 1 ? 'Submit' : 'Next'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
