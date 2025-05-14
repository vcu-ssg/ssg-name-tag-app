import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';

export default function CameraScreen() {
  const [facing] = useState<CameraType>('back');
  const [inputText, setInputText] = useState('');
  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to use the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function handleSnapBadge() {
    console.log('📸 Snap Badge pressed');
    // Implementation will come later
  }

  function handleAddNameToList() {
    console.log('📸 Add name to list');
    // Implementation will come later
  }
  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView style={styles.camera} facing={facing} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter text here"
        value={inputText}
        onChangeText={setInputText}
      />

      <TouchableOpacity style={styles.snapButton} onPress={handleSnapBadge}>
        <Text style={styles.snapButtonText}>Snap Badge</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.addNameButton} onPress={handleAddNameToList}>
        <Text style={styles.addNameButtonText}>Add name to list</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  message: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 12,
  },
  permissionButton: {
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  permissionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraWrapper: {
    width: '100%',
    height: 240, // roughly triple the previous height
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#000',
    marginBottom: 16,
  },
  camera: {
    width: '100%',
    height: '300%', // still stretch camera view for cropping
    transform: [{ translateY: '-33%' }],
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  snapButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addNameButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  snapButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  addNameButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
