import { useState, useEffect } from 'react';

import { Progress } from '@/components/ui/progress';
import { useUserData } from '@/contexts/UserDataContext';
import { parseDate } from '@/lib/utils';

export const LifePercentage = () => {
  const { userData } = useUserData();
  const { birthDate, lifeExpectancy } = userData;
  const [lifePercentage, setLifePercentage] = useState(0);
  const [initialAnimationDone, setInitialAnimationDone] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const date = new Date();
    return `${date.getHours().toString().padStart(2, '0')}:${date
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;
  });

  useEffect(() => {
    const formatTime = (date: Date) => {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    };

    const calculateLifePercentage = (): number => {
      if (!birthDate || lifeExpectancy === null) return 0;
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

    if (!initialAnimationDone) {
      let start = 0;
      const end = calculateLifePercentage();
      const animationInterval = setInterval(() => {
        start += (end - start) / 5;
        setLifePercentage(start);
        if (Math.abs(start - end) < 0.01) {
          setLifePercentage(end);
          clearInterval(animationInterval);
          setInitialAnimationDone(true);
        }
      }, 40);
      return () => clearInterval(animationInterval);
    } else {
      const regularInterval = setInterval(() => {
        setCurrentTime(formatTime(new Date()));
        setLifePercentage(calculateLifePercentage());
      }, 1000);
      return () => clearInterval(regularInterval);
    }
  }, [birthDate, lifeExpectancy, initialAnimationDone]);

  const displayPercentage = isNaN(lifePercentage) ? 0 : Math.min(lifePercentage, 100);

  useEffect(() => {
    document.documentElement.style.setProperty(
      '--footer-height',
      lifePercentage > 0 ? 'var(--footer-max-height)' : 'var(--footer-min-height)'
    );

    document.documentElement.style.setProperty(
      '--gradient-line-height',
      lifePercentage > 0 ? 'var(--gradient-line-max-height)' : 'var(--gradient-line-min-height)'
    );
  }, [lifePercentage]);

  return (
    <div className="flex flex-col tabular-nums transition ease-in-out delay-50">
      <p className="text-muted mb-0">{currentTime}</p>
      {lifePercentage > 0 && (
        <p className="text-lg mb-2">
          <span className="font-bold">{lifePercentage.toFixed(8)}%</span> Lived
        </p>
      )}
      <Progress
        className="h-[2px] rounded-full transition-all duration-1000 ease-out w-full"
        value={displayPercentage}
      />
    </div>
  );
};
