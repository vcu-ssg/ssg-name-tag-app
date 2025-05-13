import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { CLEAR_STORAGE_ON_START, DEFAULT_EMAIL, DEFAULT_OCR_API_KEY } from '@env';

export default function SettingsScreen() {
  const [email, setEmail] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiKeyVisible, setApiKeyVisible] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        if (CLEAR_STORAGE_ON_START) {
          await AsyncStorage.removeItem('recipient_email');
          await AsyncStorage.removeItem('ocr_api_key');
          console.log('AsyncStorage cleared on startup');
        }

        const storedEmail = await AsyncStorage.getItem('recipient_email');
        const storedApiKey = await AsyncStorage.getItem('ocr_api_key');

        setEmail(storedEmail || DEFAULT_EMAIL);
        setApiKey(storedApiKey || DEFAULT_OCR_API_KEY);
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  const saveSettings = async () => {
    try {
      await AsyncStorage.setItem('recipient_email', email);
      await AsyncStorage.setItem('ocr_api_key', apiKey);
      Alert.alert('Settings saved!');
    } catch (error) {
      Alert.alert('Error saving settings');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <Text style={styles.label}>Recipient Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="example@email.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>OCR.space API Key:</Text>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter API key"
          secureTextEntry={!apiKeyVisible}
        />
        <TouchableOpacity
          style={styles.icon}
          onPress={() => setApiKeyVisible(!apiKeyVisible)}
        >
          <FontAwesome
            name={apiKeyVisible ? 'eye' : 'eye-slash'}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <Button title="Save Settings" onPress={saveSettings} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 12,
    paddingRight: 40, // make space for icon
    borderRadius: 4,
  },
  icon: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
});
