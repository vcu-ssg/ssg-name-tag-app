import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  RESET_STORAGE_ON_START,
  DEFAULT_EMAIL,
  DEFAULT_OCR_API_KEY,
} from '@/constants/env';

const STORAGE_EMAIL = 'ssg-name-tagger-settings.email';
const STORAGE_OCR_KEY = 'ssg-name-tagger-settings.ocrApiKey';
const STORAGE_SCANNED_NAMES = 'ssg-name-tagger-scanned-names';

type SettingsContextType = {
  email: string;
  setEmail: (email: string) => void;
  ocrApiKey: string;
  setOcrApiKey: (key: string) => void;
  scannedNames: string[];
  addScannedName: (name: string) => void;
  clearScannedNames: () => void;
  setScannedNames: (names: string[]) => void; 
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmailState] = useState('');
  const [ocrApiKey, setOcrApiKeyState] = useState('');
  const [scannedNames, setScannedNames] = useState<string[]>([]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (RESET_STORAGE_ON_START) {
          await AsyncStorage.multiRemove([
            STORAGE_EMAIL,
            STORAGE_OCR_KEY,
            STORAGE_SCANNED_NAMES, // clear name list
          ]);
          console.log('Settings storage reset due to .env flag.');
        }

        const [storedEmail, storedApiKey] = await AsyncStorage.multiGet([
          STORAGE_EMAIL,
          STORAGE_OCR_KEY,
        ]);
        const storedNames = await AsyncStorage.getItem(STORAGE_SCANNED_NAMES);

        const emailValue = storedEmail?.[1] || DEFAULT_EMAIL;
        const apiKeyValue = storedApiKey?.[1] || DEFAULT_OCR_API_KEY;

        setEmailState(emailValue);
        setOcrApiKeyState(apiKeyValue);
        if (storedNames) setScannedNames(JSON.parse(storedNames));

        if (!storedEmail?.[1]) await AsyncStorage.setItem(STORAGE_EMAIL, emailValue);
        if (!storedApiKey?.[1]) await AsyncStorage.setItem(STORAGE_OCR_KEY, apiKeyValue);
      } catch (error) {
        console.warn('Failed to initialize settings from storage', error);
      }
    }; 
    loadSettings();
  }, []);

  const setEmail = (value: string) => {
    setEmailState(value);
    AsyncStorage.setItem(STORAGE_EMAIL, value);
  };

  const setOcrApiKey = (value: string) => {
    setOcrApiKeyState(value);
    AsyncStorage.setItem(STORAGE_OCR_KEY, value);
  };

  const addScannedName = (name: string) => {
    setScannedNames((prev) => {
      const updated = [...prev, name];
      AsyncStorage.setItem(STORAGE_SCANNED_NAMES, JSON.stringify(updated));
      return updated;
    });
  };

  const clearScannedNames = () => {
    setScannedNames([]);
    AsyncStorage.removeItem(STORAGE_SCANNED_NAMES);
  };

  const setScannedNamesPersisted = (names: string[]) => {
    setScannedNames(names);
    AsyncStorage.setItem(STORAGE_SCANNED_NAMES, JSON.stringify(names));
  };  

  return (
    <SettingsContext.Provider
      value={{
        email, setEmail,
        ocrApiKey, setOcrApiKey,
        scannedNames, 
        addScannedName, 
        clearScannedNames,
        setScannedNames : setScannedNamesPersisted }}
    >
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
