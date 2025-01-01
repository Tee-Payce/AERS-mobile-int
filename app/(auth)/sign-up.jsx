import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import FormField from '../../components/FormField'
import { useState } from "react";
import CustomButton from '../../components/CustomButton'
const SignUp = () => {
  const [form, setform] = useState({
    email:'',
    password:''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = ()=>{

  }
  return (
    <SafeAreaView className="bg-primary h-full" >
    <ScrollView contentContainerStyle={{height: '100%'}}>
    <View className="w-full text-white justify-center items-center min-h-[85vh] px-1 my-6">
    <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
      Sign Up <FontAwesome size={28} name="sign-in" color='#323255' />
    </Text>
    <FormField
      title="Email"
      value={form.email}
      handleChangeText={(e) => setform({...form, email:e})}
      otherStyles="mt-7 w-full"
      keyboardType="email-address"
    />
     <FormField
      title="Password"
      value={form.password}
      handleChangeText={(e) => setform({...form, password:e})}
      otherStyles="mt-7 w-full"
     
    />
    <CustomButton 
      title="sign up"
      handlePress={submit}
      containerStyles="mt-7 w-full"
      isLoading={isSubmitting}
    />
    </View>
    </ScrollView>
    </SafeAreaView> 
  )
}

export default SignUp

const styles = StyleSheet.create({})