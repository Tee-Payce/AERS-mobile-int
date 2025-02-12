import { CameraView,Camera } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useSearchParams } from 'expo-router/build/hooks';
import { uploadVideo } from '@/lib/appwrite';
// Define Camera Types Manually
const CameraType = {
  back: 'back',
  front: 'front',
};

const Report= () => {
  const [facing, setFacing] = useState(CameraType.front); // Use custom CameraType
  const [isRecording, setIsRecording] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null); // State for camera permission
  const [audioPermission, setAudioPermission] = useState(null); 
  const params = useSearchParams();
  const urlUserId = params.get('userId');
  const [cameraReady, setCameraReady] = useState(false)
  const cameraRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(60); // Initial countdown time
  const [intervalId, setIntervalId] = useState(null); // To store the interval ID

  useEffect(() => {
    const requestPermissions = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const audioStatus = await Camera.requestMicrophonePermissionsAsync(); // Correct audio permission request
      setCameraPermission(cameraStatus.status); // Set camera permission status
      setAudioPermission(audioStatus.status); // Set audio permission status
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (cameraPermission === 'granted' && audioPermission === 'granted') {
      setCameraReady(true);
    }
  }, [cameraPermission, audioPermission]);
  useEffect(() => {
    // Clear the interval if the component is unmounted or the timer is stopped
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [intervalId]);

  if (cameraPermission === null || audioPermission === null) {
    return <View />;
  }

  if (cameraPermission !== 'granted' || audioPermission !== 'granted') {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to access the camera and microphone</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={() => requestPermissions()}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }
  
  const toggleCameraFacing = () => {
    setFacing((current) => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  function handleRecordPress() {
    if (isRecording) {
      const id = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      setIntervalId(id);
      Alert.alert('Stop Recording', 'Stopping the recording...');
      setIsRecording(false);
      
    } else {
      Alert.alert('Recording Started', 'Recording for 1 minute...');
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        Alert.alert('Recording Stopped', '1-minute recording complete.');
      }, 60000); // Automatically stop after 1 minute
    }
  }
  
  



  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        type={facing}
        onCameraReady={() => setCameraReady(true)}
      />
       {isRecording && (
        <Text style={styles.timer}>
          {timeLeft}s
        </Text>
      )}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <FontAwesome name="refresh" size={24} color="#ff8c00" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.recordButton}
          onPress={handleRecordPress}
          disabled={!cameraReady} // Disable button until the camera is ready
        >
          <Text style={styles.text}>
            <FontAwesome name={isRecording ? 'stop-circle-o' : 'circle-o'} size={60} color="#ff0000" />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Report;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 17,
    backgroundColor: '#161632',
  },
  timer: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
    marginTop: 5,
  },
  button: {
    backgroundColor: 'transparent',
    padding: 10,
    borderRadius: 5,
    marginRight: 70,
    marginTop: 10,
    marginLeft: 25,
  },
  recordButton: {
    backgroundColor: 'transparent',
    padding: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  permissionButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  permissionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
