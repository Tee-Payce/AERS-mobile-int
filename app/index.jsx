import {  Text, View } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { Link, Redirect, router } from 'expo-router'
import "../global.css";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-web';
import CustomButton from '../components/CustomButton';

const App = () => {
  return (
    <SafeAreaView className="bg-primary h-full" >
    <ScrollView contentContainerStyle={{height: '100%'}}>
    <View className="w-full justify-center items-center min-h-[85vh] px-4">
      <Text className='text-3xl text-center text-red-500 font-pextrabold'>AERS
    </Text>
    <StatusBar style='auto'/> 
    <CustomButton
      title="continue to App"
      handlePress={() => router.push('/sign-up')}
      containerStyles="bg-secondary rounded-xl min-h-[62px] justify-center items-center w-full mt-7"
      textStyles="text-white font-psemibold text-lg"
    />
    <Link href="/home" options={{ headerShown: false }} style={{color: 'blue'}}>Go to home</Link>
    </View>
    </ScrollView>
    <StatusBar backgroundColor='#161622' style='light'/>
    </SafeAreaView>
  )
}

export default App

