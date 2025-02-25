import React from 'react';
import { View, Button, Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { useRouter } from 'expo-router'; // Import useRouter for navigation
import { client, databases, config } from '@/lib/appwrite';
import GlobalProvider, { useGlobalContext } from '@/context/GlobalProvider';
import { ID } from 'react-native-appwrite';



const VideoShare = ({ videoUri }) => {
  const {user } = useGlobalContext();
  
  console.log('logged user', user.$id)
  const router = useRouter();
  const setResponderId = '678a1a180014f1a82c72'; // Set the responder ID
  const chatId = `${user.$id}_${setResponderId}`; // Replace with your chat ID
  const urlvideoUri = videoUri;
  

  const shareVideo = async () => {
    try {
      // Ensure the file exists
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      if (!fileInfo.exists) {
        throw new Error('File does not exist at the specified URI');
      }

      // Create a URL for the video (this should be a publicly accessible URL)
      const shareableUrl = `http://localhost:8082/receive-video?videoUrl=${encodeURIComponent(videoUri)}`;

      // Save the video URL to the responder in Appwrite
      const newMessage = {
        messageBody: shareableUrl,
        videoUri: urlvideoUri,
        userId: user.$id, // Replace with the actual user ID
        responderId: setResponderId,
        isResponderSender: false
        
      };

      await databases.createDocument(
        config.databaseId,
        config.messageCollectionId,
        ID.unique(), // Use unique ID for the document
        newMessage
      );

      // Navigate to the chat after sharing
      router.push({
        pathname: `/messages/${chatId}`,
        params: { userId: user.$id, responderId: setResponderId, videoUri: urlvideoUri },
      });
      console.log('video src', urlvideoUri)
    } catch (error) {
      console.error('Error sharing video:', error);
    }
  };

  return (
    <View>
      <Button title="Share Video" onPress={shareVideo} />
    </View>
  );
};

export default VideoShare;