import { forwardRef } from 'react';

import { LifePercentage } from '@/components/lifeVisualization/LifePercentage';
import { useUserData } from '@/contexts/UserDataContext';
import { LoadingSpinner } from '../ui/loading';

export const Dashboard = forwardRef<HTMLDivElement>((_props, ref) => {
  const { userData } = useUserData();

  if (!userData.birthDate || !userData.lifeExpectancy) {
    return <LoadingSpinner />;
  }

  return (
    <div ref={ref}>
      <LifePercentage birthDate={userData.birthDate} lifeExpectancy={userData.lifeExpectancy} />
    </div>
  );
});
