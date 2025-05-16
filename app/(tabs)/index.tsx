import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { HelloWave } from '@/components/HelloWave';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText>
          This app scans name tags and sends the scanned list through email.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Scan</ThemedText>
        <ThemedText>
          Press the{' '}
          <ThemedText
            onPress={() => router.push('/camera')}
            style={{ color: '#007aff', textDecorationLine: 'underline' }}
          >
            scan
          </ThemedText>{' '}
          tab below. Center the name tag in the camera and press Snap. The captured image will appear. The OCR name will appear. Clean the name (if necessary) and Add it to the list.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Send</ThemedText>
        <ThemedText>
          Press the{' '}
          <ThemedText
            onPress={() => router.push('/mail')}
            style={{ color: '#007aff', textDecorationLine: 'underline' }}
          >
            mail
          </ThemedText>{' '}
          tab below. Review the mail. Press send.  Clear the list to start over.
        </ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Other notes</ThemedText>
        <ThemedText>
          The {' '}
          <ThemedText
            onPress={() => router.push('/settings')}
            style={{ color: '#007aff', textDecorationLine: 'underline' }}
          >
          Settings
          </ThemedText>{' '}
          tab stores the default outgoing email address and the OCR API key.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
