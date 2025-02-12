import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';

const Settings = () => {
  console.log(Camera);
  console.log(Audio);
  return (
    <View>
      <Text>Settings</Text>
    </View>
  )
}

export default Settings

const styles = StyleSheet.create({})