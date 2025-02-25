import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CustomButton = ({ title, handlePress, containerStyles, isLoading, textStyles}) => {
  return (
    <TouchableOpacity 
    onPress={handlePress}
    activeOpacity={0.7}
    style={[
        styles.button,
        containerStyles,
        isLoading && { opacity: 0.5 },
      ]}    disabled={isLoading}
    >
      
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>
    </TouchableOpacity>
  )
}

export default CustomButton


const styles = StyleSheet.create({
  button: {
    backgroundColor: '#ff8c00',
    borderRadius: 10,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});