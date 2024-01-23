import { createContext, ReactNode, useContext, useState } from 'react';

export type UserData = {
  country: string;
  sex: 'SEX_MLE' | 'SEX_FMLE' | 'SEX_BTSX';
  birthDate: string;
  lifeExpectancy: number;
  globalLifeExpectancy: number;
};

type UserDataContextType = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
};

const defaultUserData: UserData = {
  country: '',
  sex: 'SEX_BTSX',
  birthDate: '',
  lifeExpectancy: 0,
  globalLifeExpectancy: 0,
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
