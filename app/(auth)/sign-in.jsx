import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { signIn } from '../../lib/appwrite'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'

const SignIn = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields!!')
      return; // Stop execution
    }
    setIsSubmitting(true)
    console.log("Submitting Sign-In with credentials:", form.email, form.password)

    try {
      await signIn(form.email, form.password)
      console.log("Navigating to App")
      router.push('/find')
      console.log("Navigation complete")
      // Navigate to the home page
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Sign In <FontAwesome size={28} name="sign-in" color="#FF9001" />
          </Text>

          <FormField
                      title="Email"
                      value={form.email}
                      handleChangeText={(e) => setForm({ ...form, email: e })}
                      otherStyles={styles.inputField}
                      keyboardType="email-address" placeholder={undefined}  />
          <FormField
                      title="Password"
                      value={form.password}
                      handleChangeText={(e) => setForm({ ...form, password: e })}
                      otherStyles={styles.inputField}
                      secureTextEntry placeholder={undefined}  />

          <CustomButton
                      title="Sign In"
                      handlePress={submit}
                      containerStyles={styles.button}
                      isLoading={isSubmitting} textStyles={undefined}/>
          <Link href="/sign-up" style={styles.link}>
            Don't have an account? Sign Up
          </Link>
          <Link href="/find" style={styles.link}>
            HOME
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

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
  inputField: {
    marginTop: 28,
    width: '100%',
  },
  button: {
    marginTop: 28,
    width: '100%',
  },
  link: {
    fontSize: 18,
    color: '#FF9001',
    marginTop: 12,
    textAlign: 'center',
  },
})
