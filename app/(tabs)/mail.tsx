import { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import { useSettings } from '@/contexts/settings-context';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';

export default function MailScreen() {
  const { email, scannedNames } = useSettings();

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
    setSubject(`New event: ${formattedDate}`);
    setBody(scannedNames.join('\n'));
  }, [scannedNames]);

  const handleSend = () => {
    console.log('Sending email...');
    console.log('To:', email);
    console.log('Subject:', subject);
    console.log('Body:', body);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80} // adjust if needed
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.headerIcon}>
          <IconSymbol size={200} name="mail" color="#808080" />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>To:</Text>
          <Text style={styles.readonly}>{email}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Subject:</Text>
          <TextInput
            style={styles.input}
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Body:</Text>
          <TextInput
            style={styles.textarea}
            value={body}
            onChangeText={setBody}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.sendButton}>
          <Button title="Send" onPress={handleSend} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 10,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerIcon: {
    alignItems: 'center',
    marginBottom: 20,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  readonly: {
    fontSize: 16,
    color: '#666',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
  },
  textarea: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
    fontSize: 16,
    minHeight: 150,
  },
  sendButton: {
    marginTop: 20,
    alignItems: 'center',
  },
});
