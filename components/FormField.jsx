import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useState } from "react";
import { FontAwesome } from '@expo/vector-icons';

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
    <View  className={`space-y-2 ${otherStyles}`}>
    <Text className="text-base text-white font-pmedium">
        {title}
    </Text>
    <View className="border-2 border-black-200  w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput 
        className="flex-1 text-white font-psemibold text-base"
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#121233"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
        />
        {title === 'Password' && (
            <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
            <FontAwesome name={!showPassword ? 'eye-slash' : 'eye' } className="w-6 h-6" color='#323233' size={18}/>

        </TouchableOpacity>)}
    </View>
         
    </View>
  )
}

export default FormField

const styles = StyleSheet.create({})