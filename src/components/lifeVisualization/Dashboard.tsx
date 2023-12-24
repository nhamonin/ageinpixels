import { useState, useEffect, useRef, forwardRef } from 'react';

import { LifePercentage } from '@/components/lifeVisualization/LifePercentage';
import { useUserData } from '@/contexts/UserDataContext';

export const Dashboard = forwardRef<HTMLDivElement>((_props, ref) => {
  const { userData } = useUserData();
  const [isVisible, setIsVisible] = useState(false);
  const lifePercentageRef = useRef(null);

  useEffect(() => {
    const currentRef = lifePercentageRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <div ref={ref}>
      <div ref={lifePercentageRef}>
        <LifePercentage
          birthDate={userData.birthDate}
          lifeExpectancy={userData.lifeExpectancy}
          isVisible={isVisible}
        />
      </div>
    </div>
  );
});
