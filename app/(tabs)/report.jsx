import { StyleSheet, Text, View,Button, SafeAreaView, TouchableOpacity, Alert } from 'react-native'
import { useEffect, useState, useRef } from 'react';
import { Camera, CameraView, CameraType } from 'expo-camera';
import { Video } from 'expo-av';
import * as MediaLibrary  from 'expo-media-library'
import {shareAsync} from 'expo-sharing'
import { FontAwesome } from '@expo/vector-icons';
import { uploadVideo } from '@/lib/appwrite';
import { useRouter, useSearchParams } from 'expo-router/build/hooks';
import { useGlobalContext } from '@/context/GlobalProvider';
import VideoShare from '@/components/VideoShare'
import UploadVideo from '@/components/UploadVideo'

const Report = () => {
  const { user } = useGlobalContext();

  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get('userId');
  const responderId = '678a1a180014f1a82c72';
  

  let cameraRef = useRef();
  const [facing, setFacing] = useState({CameraType:'back'});
  const [videoUris, setVideoUris] = useState({ back: null, front: null });
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMicrophonePermission, setHasMicrophonePermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();

  const [isRecording, setIsRecording] = useState(false);
  const [video, setVideo] = useState();
  const [ cameraReady, setCameraReady] = useState();

  useEffect(() => {
    const requestPermissions = async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      const { status: mediaStatus } = await MediaLibrary.requestPermissionsAsync();
      
      
      setHasCameraPermission(cameraStatus === 'granted');
      setHasMicrophonePermission(audioStatus === 'granted');
      setHasMediaLibraryPermission(mediaStatus === 'granted');
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (hasCameraPermission && hasMicrophonePermission && hasMediaLibraryPermission) {
      setCameraReady(true);
    }
  }, [hasCameraPermission, hasMicrophonePermission, hasMediaLibraryPermission]);

  if (hasCameraPermission === null || hasMicrophonePermission === null || hasMediaLibraryPermission === null) {
    return <Text>Requesting Permissions...</Text>;
  } else if (!hasCameraPermission || !hasMicrophonePermission || !hasMediaLibraryPermission) {
    return <Text>Permission denied .</Text>;
  }

  let recordVideo = async () => {
    setIsRecording(true);
    let options = {
      quality: '1080p',
      maxDuration: 20,
      mute: false,
    };
  
    try {
      const recordedVideo = await cameraRef.current.recordAsync(options);
  
      if (!recordedVideo || !recordedVideo.uri) {
        console.error('🚨 Error: Video URI is null or undefined.');
        Alert.alert('Error', 'Failed to record video. Please try again.');
        return;
      }
  
      console.log('📸 Recorded video:', recordedVideo);
      console.log('📂 Video URI:', recordedVideo.uri);
  
      setVideo(recordedVideo);
  
      // Ensure the user is logged in
      if (!user) {
        Alert.alert('Error', 'User not logged in. Please log in to continue.');
        return;
      }
  
      console.log('🚀 Recorded video successfully:', recordedVideo.uri);
      // await uploadVideo(recordedVideo.uri, user.$id, responderId);
     //  Alert.alert('Success', 'Video uploaded successfully!');
    } catch (error) {
      console.error('❌ Recording failed!', error);
      Alert.alert('Error', 'An error occurred while recording video.');
    } finally {
      setIsRecording(false);
    }
  };
  

  let stopRecording = () => {
    setIsRecording(false);
    cameraRef.current.stopRecording();
  };

  if(video){
    let shareVideo = async () => {
      shareAsync(video.uri).then(()=>{
      setVideo(undefined);
    });
  };
  let saveVideo = ()=>{
    MediaLibrary.saveToLibraryAsync(video.uri).then(()=>{
      setVideo(undefined);
    });
  };
 
  
  return(
    <SafeAreaView style={styles.container}>
      <Video
      style={styles.video}
      source={{ uri : video.uri}}
      useNativeControls
      resizeMode='contain'
      isLooping
      />
      <View style={styles.buttonContainer}>
      {/* <Button style={styles.button1} title='Share' onPress={shareVideo}/> 
      <VideoShare videoUri={video.uri} />*/}
      <UploadVideo videoUri={video.uri} userId={user.$id} responderId={responderId}/>
      {hasMediaLibraryPermission ? <Button style={styles.button1} title='Save' onPress={saveVideo}/> : undefined}
      <Button style={styles.button1} title='Discard' onPress={() => setVideo(undefined)}/>
</View>
    </SafeAreaView>
    );
  }



  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }
  return (
    <SafeAreaView style={styles.bigContainer}>
    <CameraView style={styles.container} ref={cameraRef} mode="video" facing={facing}/>
    

    
    <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <FontAwesome name="refresh" size={24} color="#ff8c00" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.recordButton} onPress={isRecording ? stopRecording : recordVideo}>
          <Text style={styles.text}>
            <FontAwesome name={isRecording ? 'stop-circle-o' : 'circle-o'} size={60} color="#ff0000" />
          </Text>
        </TouchableOpacity>
            </View>
           
    </SafeAreaView>
  )
}

export default Report;

const styles = StyleSheet.create({
  bigContainer:{
    flex:1
  },
  container:{
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#161630'
  },
  
  video:{
    flex:1,
    alignSelf:'stretch'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: 17,
    backgroundColor: '#161630'
  },
  button1:{
    marginLeft: 5
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
    alignItems: 'center',
  },
});