import { createContext, ReactNode, useContext, useState } from 'react';

export type UserData = {
  country: string | null;
  sex: 'male' | 'female' | null;
  birthDate: Date | null;
};

type UserDataContextType = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
};

const defaultUserData: UserData = {
  country: null,
  sex: null,
  birthDate: null,
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
