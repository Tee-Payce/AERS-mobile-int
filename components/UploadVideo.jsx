import React, { useState } from 'react';
import { View, Button, Alert } from 'react-native';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { client, databases, config } from '@/lib/appwrite';
import { ID } from 'react-native-appwrite';


const API_URL = 'http://192.168.1.115:8085/send-video'; // Update with your server IP

const UploadVideo = ({ videoUri, userId, responderId }) => {
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const uploadVideo = async () => {
    if (!videoUri) {
      Alert.alert('Error', 'No video selected');
      return;
    }

    setUploading(true);
    
    try {
      // Create FormData object
      const uniqueFileName = `video_${Date.now()}_${userId}_${responderId}.mp4`;
      console.log('uploading video', uniqueFileName);
      const formData = new FormData();
      formData.append('video', {
        uri: videoUri,
        name: uniqueFileName, 
        type: 'video/mp4',
      });
      formData.append('userId', userId);
      formData.append('responderId', responderId);

      // Send video to web app
      const response = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await response.json();
      console.log('Server Response:', data); // Debugging the response

             if (response.ok) {
            const videoFileName = data.videoFileName || uniqueFileName; // Now correctly assigned

               console.log('Saved Video Filename:', videoFileName);

        const newMessage = {
          messageBody: 'Sent emergency video check it out below',
          hasVideoUrl: true,
          userId: userId, // Replace with the actual user ID
          responderId: responderId,
          created: new Date().toISOString(),
          isResponderSender: false,
          videoUriId: videoFileName 
        };
  
        await databases.createDocument(
          config.databaseId,
          config.messageCollectionId,
          ID.unique(), // Use unique ID for the document
          newMessage
        );
        const chatId = `${userId}_${responderId}`; 
        // Navigate to the chat after sharing
        router.push({
          pathname: `/messages/${chatId}`,
          params: { userId: userId, responderId: responderId, videoUri: videoUri },
       });

        // Alert.alert('Success', 'Video sent successfully!');
        console.log('video sent!!!')
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Error', 'Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View>
      <Button title={uploading ? 'Uploading...' : 'Send Video'} onPress={uploadVideo} disabled={uploading} />
    </View>
  );
};

export default UploadVideo;
