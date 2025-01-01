import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, isLoading, textStyles}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center
    ${containerStyles} ${isLoading ? 'opacity-50' : ''}`}
    disabled={isLoading}
    >
      
      <Text className={`text-white font-psemibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton

const styles = StyleSheet.create({})