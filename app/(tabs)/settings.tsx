import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { useSettings } from '@/contexts/settings-context';

export default function SettingsScreen() {
  const { email, setEmail, ocrApiKey, setOcrApiKey } = useSettings();
  const [showApiKey, setShowApiKey] = useState(false);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ParallaxScrollView
            headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
            headerImage={
              <IconSymbol
                size={310}
                color="#808080"
                name="gear.circle.fill"
                style={styles.headerImage}
              />
            }
          >
            <ThemedView style={styles.container}>
              <ThemedText type="title">Settings</ThemedText>

              <Text style={styles.label}>Destination Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
              />

              <Text style={styles.label}>OCR.space API Key</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.inputWithPadding}
                  placeholder="Enter API Key"
                  secureTextEntry={!showApiKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={ocrApiKey}
                  onChangeText={setOcrApiKey}
                />
                <TouchableOpacity
                  onPress={() => setShowApiKey(prev => !prev)}
                  accessibilityLabel={showApiKey ? 'Hide API Key' : 'Show API Key'}
                  style={styles.iconInsideInput}
                >
                  <IconSymbol
                    name={showApiKey ? 'eye.slash.fill' : 'eye.fill'}
                    size={24}
                    color="#808080"
                  />
                </TouchableOpacity>
              </View>
            </ThemedView>
          </ParallaxScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inputWithPadding: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 12,
    paddingRight: 36, // leave space for icon
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  iconInsideInput: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }],
    padding: 4,
  },
});
