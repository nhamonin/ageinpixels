import { forwardRef } from 'react';

import { LifeGrid } from '@/components/lifeVisualization/LifeGrid';
import { useUserData } from '@/contexts/UserDataContext';
import { parseDate } from '@/lib/utils';

export const Dashboard = forwardRef<HTMLDivElement>((_, ref) => {
  const { userData } = useUserData();
  const { birthDate, lifeExpectancy } = userData;

  const calculateAge = (birthDateString: string) => {
    const birthDate = parseDate(birthDateString);
    const today = new Date();

    if (isNaN(birthDate.getTime())) {
      throw new Error('Invalid birth date string');
    }

    const diffInMilliseconds = today.getTime() - birthDate.getTime();
    const ageInYears = diffInMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
    console.log({ ageInYears, lifeExpectancy });
    return ageInYears;
  };

  const currentAge = birthDate ? calculateAge(birthDate) : 0;

  return (
    <div
      ref={ref}
      className="h-[var(--content-height)] flex justify-center items-center w-2/3 sm:w-1/2 max-w-[440px]"
    >
      <div className="w-full">
        <LifeGrid max={lifeExpectancy || 0} current={currentAge || 0} />
      </div>
    </div>
  );
});
