import { useState, useEffect } from 'react';

import { Progress } from '@/components/ui/progress';
import { useUserData } from '@/contexts/UserDataContext';
import { stringToDate } from '@/lib/utils';

const MILLISECONDS_IN_A_YEAR = 31556952000;

export const LifePercentage = () => {
  const { userData } = useUserData();
  const { birthDate, lifeExpectancy, globalLifeExpectancy } = userData;
  const lifeExpectancyToUse = lifeExpectancy || globalLifeExpectancy;
  const [lifePercentage, setLifePercentage] = useState(0);

  const formatTime = () => {
    const date = new Date();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = `:${date.getSeconds().toString().padStart(2, '0')}`;
    return `${hours}:${minutes}${seconds}`;
  };

  const [currentTime, setCurrentTime] = useState(formatTime);

  useEffect(() => {
    const calculateLifePercentage = () => {
      if (!birthDate || lifeExpectancyToUse === null) return 0;
      const birthDateObj = stringToDate(birthDate);
      const currentDate = new Date();
      const livedMilliseconds = currentDate.getTime() - birthDateObj.getTime();
      const totalLifeMilliseconds = lifeExpectancyToUse * MILLISECONDS_IN_A_YEAR;
      const lifePercentage = (livedMilliseconds / totalLifeMilliseconds) * 100;

      return lifePercentage;
    };

    const intervalId = setInterval(() => {
      setCurrentTime(formatTime());
      if (birthDate && lifeExpectancyToUse !== null) {
        setLifePercentage(calculateLifePercentage());
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [birthDate, lifeExpectancyToUse]);

  const displayPercentage =
    !isFinite(lifePercentage) || isNaN(lifePercentage) ? 0 : Math.min(lifePercentage, 100);
  const lifePercentageToDisplay =
    !isFinite(lifePercentage) || lifePercentage === 0 ? '0' : lifePercentage.toFixed(8);

  return (
    <div className="flex flex-col tabular-nums transition ease-in-out delay-50">
      <p className="text-muted mb-0 pt-1">{currentTime}</p>
      <p className="text-lg mb-2 leading-tight">
        <span className="font-bold">{lifePercentageToDisplay}%</span> Lived
      </p>
      <Progress
        className="h-[2px] rounded-full transition-all duration-1000 ease-out w-full"
        value={displayPercentage}
      />
    </div>
  );
};
