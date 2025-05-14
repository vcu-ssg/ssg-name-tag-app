import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_EMAIL = 'ssg-name-tagger-settings.email';
const STORAGE_OCR_KEY = 'ssg-name-tagger-settings.ocrApiKey';

type SettingsContextType = {
  email: string;
  setEmail: (email: string) => void;
  ocrApiKey: string;
  setOcrApiKey: (key: string) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [email, setEmailState] = useState('');
  const [ocrApiKey, setOcrApiKeyState] = useState('');

  // Load from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem(STORAGE_EMAIL);
        const storedApiKey = await AsyncStorage.getItem(STORAGE_OCR_KEY);
        if (storedEmail) setEmailState(storedEmail);
        if (storedApiKey) setOcrApiKeyState(storedApiKey);
      } catch (error) {
        console.warn('Failed to load settings from storage', error);
      }
    };
    loadSettings();
  }, []);

  // Wrapped setters: update state + persist to AsyncStorage
  const setEmail = (value: string) => {
    setEmailState(value);
    AsyncStorage.setItem(STORAGE_EMAIL, value);
  };

  const setOcrApiKey = (value: string) => {
    setOcrApiKeyState(value);
    AsyncStorage.setItem(STORAGE_OCR_KEY, value);
  };

  return (
    <SettingsContext.Provider
      value={{ email, setEmail, ocrApiKey, setOcrApiKey }}
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
