import { useState, useEffect } from 'react';

import { Progress } from '@/components/ui/progress';
import { useUserData } from '@/contexts/UserDataContext';

export const LifePercentage = () => {
  const { userData } = useUserData();
  const { birthDate, lifeExpectancy, questionsCompleted } = userData;
  const [lifePercentage, setLifePercentage] = useState(0);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (!questionsCompleted) return;

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
      const rateChange = 5;
      const interval = 40;

      const textAnimationInterval = setInterval(() => {
        start += (end - start) / rateChange;
        setLifePercentage(start);
        if (Math.abs(start - end) < 0.01) {
          setLifePercentage(end);
          clearInterval(textAnimationInterval);
          setIsFirstLoad(false);
        }
      }, interval);

      return () => clearInterval(textAnimationInterval);
    } else {
      const interval = setInterval(() => {
        setLifePercentage(calculateLifePercentage());
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [birthDate, lifeExpectancy, isFirstLoad, questionsCompleted]);

  const displayPercentage = isNaN(lifePercentage) ? 0 : Math.min(lifePercentage, 100);
  const textVisibility = lifePercentage > 0 ? 'visible' : 'hidden';
  const textOpacity = lifePercentage > 0 ? 1 : 0;

  return (
    <div className="flex flex-col gap-5">
      <p
        className="text-lg tabular-nums"
        style={{ visibility: textVisibility, opacity: textOpacity }}
      >
        <span className="font-bold">{lifePercentage.toFixed(8)}%</span> Lived
      </p>
      <div className="w-full">
        <Progress
          className="h-[2px] rounded-full transition-all duration-1000 ease-out w-full"
          value={displayPercentage}
        />
      </div>
    </div>
  );
};
