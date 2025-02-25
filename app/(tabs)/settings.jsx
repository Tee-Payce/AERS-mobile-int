import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

import { uploadVideo } from '@/lib/appwrite';
import { useSearchParams } from 'expo-router/build/hooks';

const Settings = () => {
  const params = useSearchParams();
  const urlUserId = params.get('userId');

 

  return (
    <View style={{ flex: 1 }}>
    <Text>Settings</Text>
    </View>
  );
}

export default Settings;

const styles = StyleSheet.create({})