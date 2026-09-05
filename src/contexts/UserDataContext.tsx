import { createContext, ReactNode, useContext, useState } from 'react';

import { reverseSexMapping, SexHumanReadable } from '@/constants/sexQueryParamMapping';

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

const readUserDataFromUrl = (): UserData => {
  const params = new URLSearchParams(window.location.search);
  const sex = params.get('sex') as SexHumanReadable | null;

  return {
    ...defaultUserData,
    country: params.get('country') || defaultUserData.country,
    sex: (sex && reverseSexMapping[sex]) || defaultUserData.sex,
    birthDate: params.get('birthDate') || defaultUserData.birthDate,
  };
};

export function UserDataProvider({ children }: { children: ReactNode }) {
  const [userData, setUserData] = useState<UserData>(readUserDataFromUrl);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData({ ...userData, ...data });
  };

  return (
    <UserDataContext.Provider value={{ userData, updateUserData }}>
      {children}
    </UserDataContext.Provider>
  );
}
