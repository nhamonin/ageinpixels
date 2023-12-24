import { useState, useEffect } from 'react';

import { Progress } from '@/components/ui/progress';

type LifePercentageProps = {
  birthDate: string;
  lifeExpectancy: number;
  isVisible: boolean;
};

export const LifePercentage = ({ birthDate, lifeExpectancy, isVisible }: LifePercentageProps) => {
  const [lifePercentage, setLifePercentage] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!isVisible) return;

    const parseDate = (dateStr: string) => {
      const parts = dateStr.split('-');
      return new Date(+parts[2], +parts[1] - 1, +parts[0]);
    };

    const calculateLifePercentage = (): number => {
      const birthDateObj = parseDate(birthDate);
      const currentDate = new Date();
      const expectedEndDate = new Date(
        birthDateObj.getFullYear() + lifeExpectancy,
        birthDateObj.getMonth(),
        birthDateObj.getDate()
      );
      const livedMilliseconds = currentDate.getTime() - birthDateObj.getTime();
      const totalLifeMilliseconds = expectedEndDate.getTime() - birthDateObj.getTime();
      return (livedMilliseconds / totalLifeMilliseconds) * 100;
    };

    if (isFirstLoad) {
      let start = 0;
      const end = calculateLifePercentage();

      const textAnimationInterval = setInterval(() => {
        start += (end - start) / 10;
        setLifePercentage(start);
        if (Math.abs(start - end) < 0.01) {
          setLifePercentage(end);
          clearInterval(textAnimationInterval);
          setIsFirstLoad(false);
        }
      }, 50);

      return () => clearInterval(textAnimationInterval);
    } else {
      const interval = setInterval(() => {
        setLifePercentage(calculateLifePercentage());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [birthDate, lifeExpectancy, isFirstLoad, isVisible]);

  const displayPercentage = isNaN(lifePercentage) ? 0 : Math.min(lifePercentage, 100);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-4xl md:text-6xl font-bold text-center">Life Percentage:</h1>
      <p className="text-3xl md:text-5xl mt-5 tabular-nums">
        {isNaN(lifePercentage) ? 'Loading...' : lifePercentage.toFixed(8)}%
      </p>
      <div className="w-full max-w-md mt-5">
        <Progress
          className="h-6 bg-gray-200 rounded-full transition-all duration-1000 ease-out"
          value={displayPercentage}
        />
      </div>
    </div>
  );
};
