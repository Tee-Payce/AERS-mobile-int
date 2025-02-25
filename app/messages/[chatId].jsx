import * as Permissions from 'expo-permissions';
import { useSearchParams } from 'expo-router/build/hooks'
import { useRouter } from 'expo-router/build/hooks'
import React, { useEffect, useState, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Client, Databases, Query, Realtime, ID } from 'react-native-appwrite';
import { client ,databases, config, sendMessage } from '../../lib/appwrite';
import { View, Text, FlatList, TextInput, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import FormField from '../../components/FormField';
import { FontAwesome } from '@expo/vector-icons';
import CustomButton from '../../components/CustomButton';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';


// const client = new Client();
// client.setEndpoint(config.endpoint).setProject(config.projectId);
// const databases = new Databases(client);

const Chat = () => {
  const params = useSearchParams();
  const chatId = params.get('chatId'); // Use `get` to retrieve query parameters
  const urlUserId = params.get('userId');
  const videoUri = params.get('videoUri');
  console.log('videoUri', videoUri)
  const urlResponderId = params.get('responderId');
  const isSender = false;
  const [form, setForm] = useState({
   messageBody:''
  });
  const videoSource = videoUri;
  console.log('video source', videoSource)
  const player = useVideoPlayer(videoSource, player => {
    player.loop = true;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });

 

  const [messages, setMessages] = useState([]);
  const [messageBody, setMessageBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState('');
  const [responderName, setResponderName] = useState('');
  const scrollViewRef = useRef();

//video permissions
 useEffect(() => {
  const checkFileAccess = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
    if (status !== 'granted') {
      console.error('Permission to access media library is required!');
    } else {
      const fileInfo = await FileSystem.getInfoAsync(videoUri);
      console.log('📂 File info:', fileInfo);
    }
  };

  checkFileAccess();
}, [videoUri]);
useEffect(() => {
  scrollViewRef.current?.scrollToEnd({ animated: true });
}, [messages]);

  useEffect(() => {
    fetchMessages(); // Initial fetch
    fetchResponderName();

    // Polling every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval); // Cleanup when component unmounts
  }, []);
  
  //existing messages
  const fetchMessages = async () => {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.messageCollectionId,
        [
          Query.and([
            Query.equal('userId', urlUserId),
            Query.equal('responderId', urlResponderId),
          ])
        ]
      );
      setMessages(response.documents);
      
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      setNotification('Failed to fetch messages. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    }
  };

  //responender name
  const fetchResponderName = async () => {
    try {
      const response = await databases.getDocument(
        config.databaseId,
        config.responderCollectionId,  // Use the responder collection ID
        urlResponderId  // This should match the document ID
      );
      setResponderName(response.name); // Assuming the responder's name is in the 'name' field
    } catch (error) {
      console.error('Failed to fetch responder name:', error);
      setNotification('Failed to fetch responder details.');
      setTimeout(() => setNotification(''), 5000);
    }
  };


  const send = async () => {
    if (!form.messageBody){
      Alert.alert('Error', 'Please fill in all the fields!');
    return;
    }

    setIsSubmitting(true);
  
    try {
      const newMessage = {
        messageBody: form.messageBody,
        userId: urlUserId,
        responderId: urlResponderId,
        created: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update state immediately

      await sendMessage(form.messageBody, urlUserId, urlResponderId);
    } catch (error) {
      console.error('Failed to send message:', error);
      setNotification('Failed to send message. Please try again.');
      setTimeout(() => setNotification(''), 5000);
    } finally {
      setIsSubmitting(false);
      setForm({
        messageBody:''
       }); 
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>
        <FontAwesome size={24} name="comments-o" color='#ff8c00' />
        Chat with Responder 
      </Text>
      <Text style={styles.responderName}>{responderName}</Text>
      {notification ? (
        <View style={styles.notification}>
          <Text style={styles.notificationText}>{notification}</Text>
        </View>
      ) : null}
      <View style={styles.innerContainer}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.scrollView}>
          <View style={styles.messagesContainer}>
           
          {messages.map((msg, index) => {
            const isSenderStyle = msg.isResponderSender === isSender;// Adjust this logic as needed
  return (
    <View key={index} style={[styles.messageContainer, isSenderStyle ? styles.senderMessage : styles.responderMessage]}>
                <Text style={styles.messageText}>{msg.messageBody}</Text>
                <Text style={styles.timestamp}>{new Date(msg.created).toLocaleTimeString()}</Text>
              </View>
            );
          })}

          </View>
        </ScrollView>
        <View style={styles.inputContainer}>
          <FormField
            title=""
            value={form.messageBody}
            handleChangeText={(e) => setForm({ ...form, messageBody: e })}
            otherStyles={styles.inputField}
            placeholder="Type your message"
          />
          <Text style={styles.sendButton} onPress={send}>
            <FontAwesome size={36} name='paper-plane' color='#ff8c00' />
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 40,
    // marginBottom: 20,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messagesContainer: {
      flex: 1,
      padding: 10,
      backgroundColor: '#161630',
    },
    messageContainer: {
      maxWidth: '75%',
      padding: 8,
      borderRadius: 10,
      marginVertical: 4,
    },
  senderMessage: {
      alignSelf: 'flex-end',
      backgroundColor: '#ff8c00',
      borderRadius: 5,
      padding: 3,
      marginRight: 10,
    },
    responderMessage: {
      alignSelf: 'flex-start',
      backgroundColor: '#1e90ff',
      borderRadius:5,
      padding: 3,
      marginLeft: 10,
    },
    messageText: {
      color: '#fff',
    },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  messageContainer: {
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    justifyContent: 'center',
    marginRight:20,

    marginTop:25
  },
  timestamp: {
    fontSize: 12,
    color: '#ccc',
    alignSelf: 'flex-end',
    marginRight:10
  },
  notification: {
    backgroundColor: '#ffcc00',
    padding: 10,
    margin: 10,
    borderRadius: 5,
  },
  notificationText: {
    color: '#fffe',
    textAlign: 'center',
  },
  responderName:{
    color:'#ff8c00',
    marginLeft:70,
    marginBottom:5,
  },
  video:
  { width: 200, 
    height: 200,
    alignSelf: 'flex-end',
      backgroundColor: '#ff8c00',
      borderRadius: 5,
      padding: 3,
      marginRight: 10,

   }

});