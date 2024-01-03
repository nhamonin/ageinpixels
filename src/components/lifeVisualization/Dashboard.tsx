import { LifeGrid } from '@/components/lifeVisualization/LifeGrid';
import { useUserData } from '@/contexts/UserDataContext';
import { calculateAge } from '@/lib/utils';

export const Dashboard = () => {
  const { userData } = useUserData();
  const { birthDate, lifeExpectancy } = userData;
  const currentAge = birthDate ? calculateAge(birthDate) : 0;

  return (
    <section className="flex flex-col justify-center items-center sm:min-w-auto sm:min-h-auto">
      <LifeGrid max={lifeExpectancy} current={currentAge} />
    </section>
  );
};
