import { createContext, ReactNode, useContext, useState } from 'react';

export type UserData = {
  country: string;
  sex: 'MLE' | 'FMLE';
  birthDate: string;
  lifeExpectancy: number | null;
  questionsCompleted: boolean;
};

type UserDataContextType = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
};

const defaultUserData: UserData = {
  country: '',
  sex: 'MLE',
  birthDate: '',
  lifeExpectancy: null,
  questionsCompleted: false,
};

const UserDataContext = createContext<UserDataContextType>({
  userData: defaultUserData,
  updateUserData: () => {},
});

export function useUserData() {
  return useContext(UserDataContext);
}

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData({ ...userData, ...data });
  };

  return (
    <UserDataContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
