// contexts/settings-context.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

type SettingsContextType = {
  email: string;
  setEmail: (email: string) => void;
  ocrApiKey: string;
  setOcrApiKey: (key: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmail] = useState('');
  const [ocrApiKey, setOcrApiKey] = useState('');

  return (
    <SettingsContext.Provider value={{ email, setEmail, ocrApiKey, setOcrApiKey }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
