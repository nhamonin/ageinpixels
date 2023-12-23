import { useState, useEffect } from 'react';

type LifePercentageProps = {
  birthDate: string;
  lifeExpectancy: number;
};

export const LifePercentage = ({ birthDate, lifeExpectancy }: LifePercentageProps) => {
  const [lifePercentage, setLifePercentage] = useState(0);

  useEffect(() => {
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

    const interval = setInterval(() => {
      setLifePercentage(calculateLifePercentage());
    }, 1000);

    return () => clearInterval(interval);
  }, [birthDate, lifeExpectancy]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl font-bold">Life Percentage:</h1>
      <p className="text-5xl mt-5">
        {isNaN(lifePercentage) ? 'Loading...' : lifePercentage.toFixed(8)}%
      </p>
    </div>
  );
};
