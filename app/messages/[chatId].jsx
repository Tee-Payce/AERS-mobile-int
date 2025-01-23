
import { useSearchParams } from 'expo-router/build/hooks'
import { useRouter } from 'expo-router/build/hooks'
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Client, Databases, Query, Realtime, ID } from 'react-native-appwrite';
import { config } from '../../lib/appwrite';
import { View, Text, FlatList, TextInput, Button, ScrollView, StyleSheet } from 'react-native';
import FormField from '../../components/FormField'
import { FontAwesome } from '@expo/vector-icons';


const Chat = () => {
  const params = useSearchParams();
  const chatId = params.get('chatId'); // Use `get` to retrieve query parameters
  const urlUserId = params.get('userId');
  const urlResponderId = params.get('responderId');
  const [form, setForm] = useState({
   messageBody:''
  });

  console.log('chat', chatId)
  console.log('user', urlUserId)
  console.log('responder',urlResponderId)
  return (
    <SafeAreaView style={styles.container}>
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
    <View >
      <Text style={styles.title}>Chat: {chatId}</Text>
      <Text style={styles.title}>User: {urlUserId}</Text>
      <Text style={styles.title}>Responder: {urlResponderId}</Text>
      <View style={styles.inputContainer}>
            
            
            <FormField
                      title=""
                      value={form.messageBody}
                      handleChangeText={(e) => setForm({ ...form, messageBody: e })}
                      otherStyles={styles.inputField} placeholder="Type your message"      
                          />
       
         <FontAwesome style={styles.sendButton} size={36} name='paper-plane' color='#ff8c00'/>
          </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    paddingHorizontal: 16,
    marginTop: 24,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    marginTop: 20,
  },
  messageList: {
    padding: 10,
  },
  message: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  userMessage: {
    backgroundColor: '#cce5ff',
    alignSelf: 'flex-end',
  },
  responderMessage: {
    backgroundColor: '#e2e3e5',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    height:-12,
    color:'#fffce',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  inputField: {
    flex: 1,
    
   
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton:{
    marginRight:20,
    justifyContent: 'center',
    marginTop:20
  }
});