import { useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  Platform,
} from 'react-native';

import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import { useSettings } from '@/contexts/settings-context';

export default function CameraScreen() {
  const { ocrApiKey } = useSettings();
  const [permission, requestPermission] = useCameraPermissions();
  const [inputText, setInputText] = useState('');

  const [photo, setPhoto] = useState(null);

  const cameraRef = useRef(null);

  const [facing] = useState<CameraType>('back');

  if (!permission) return <View />;
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

  async function handleSnapBadge() {
    try {
      if (!cameraRef.current) {
        console.warn('Camera not ready');
        return;
      }

      setInputText('');

      console.log("before take picture")
      const photo = await cameraRef.current.takePictureAsync({
        skipMetadata: true,
      });
      console.log("after take picture")

      console.log('📷 Photo URI:', photo.uri);

      const manipulator = ImageManipulator.manipulate(photo.uri);
      manipulator.resize({ width: 640 });
      const imageRef = await manipulator.renderAsync();              // apply the resize operation
      const compressedImage = await imageRef.saveAsync({
        format: SaveFormat.JPEG,   // output as JPEG (allows compression) :contentReference[oaicite:16]{index=16}
        compress: 0.5             // 50% quality compression :contentReference[oaicite:17]{index=17}
        // You can omit 'base64' since we'll upload the file directly
      });
      console.log("Compressed image saved at:", compressedImage.uri);
      setPhoto( compressedImage );

      const formData = new FormData();
      formData.append('apikey', ocrApiKey);
      formData.append('language', 'eng');
      formData.append('isOverlayRequired', 'false');
      formData.append('file', {
        uri: compressedImage.uri,
        type: 'image/jpeg',
        name: 'photo.jpg',
      });


      console.log('polling ocr space: ',{formData})
      const response = await fetch('https://api.ocr.space/parse/image', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      console.log("response: ",{result})
      const parsedText = result?.ParsedResults?.[0]?.ParsedText?.trim();

      if (parsedText) {
        const normalized = parsedText.replace(/\s+/g, ' ').trim();  // Remove line breaks and extra spaces
        console.log('✅ OCR Result:', normalized );
        setInputText(normalized);
      } else {
        console.warn('No text found in image');
      }
    } catch (err) {
      console.error('Error snapping badge:', err);
    }
  }

  function handleAddNameToList() {
    console.log('📋 Add name to list:', inputText);
    // Implementation will come later
  }

  return (
    <View style={styles.container}>
      <View style={styles.cameraWrapper}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
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

      {photo?.uri && (
        <Image
          source={{ uri: photo.uri }}
          style={{ width: 300, height: 200, marginVertical: 16 }}
        />
        )
      }
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
