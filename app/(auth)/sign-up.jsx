import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';

const SignUp = () => {
  const [form, setForm] = useState({
    
    username: '',
    fullName: '',
    email: '',
    password: ''
  });
  const [retypePassword, setRetypePassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!form.username || !form.fullName || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all the fields!');
      return;
    }
  
    if (form.password !== retypePassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
  
    setIsSubmitting(true);
  
    try {
      await createUser(form.username, form.fullName, form.email, form.password);
      router.push('/find');
    } catch (error) {
      Alert.alert('Error', error.message || 'Something went wrong.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>
            Sign Up <FontAwesome size={28} name="sign-in" color="#FF9001" />
          </Text>

          <FormField
                      title="Username"
                      value={form.username}
                      handleChangeText={(e) => setForm({ ...form, username: e })}
                      otherStyles={styles.inputField} placeholder={undefined}          />
          <FormField
                      title="Full Name"
                      value={form.fullName}
                      handleChangeText={(e) => setForm({ ...form, fullName: e })}
                      otherStyles={styles.inputField} placeholder={undefined}          />
          <FormField
                      title="Email"
                      value={form.email}
                      handleChangeText={(e) => setForm({ ...form, email: e })}
                      otherStyles={styles.inputField}
                      keyboardType="email-address" placeholder={undefined}          />
          <FormField
                      title="Password"
                      value={form.password}
                      handleChangeText={(e) => setForm({ ...form, password: e })}
                      otherStyles={styles.inputField}
                      secureTextEntry placeholder={undefined}          />
          <FormField
                      title="Retype Password"
                      value={retypePassword}
                      handleChangeText={(e) => setRetypePassword(e)}
                      otherStyles={styles.inputField}
                      secureTextEntry placeholder={undefined}          />
          <CustomButton
                      title="Sign Up"
                      handlePress={submit}
                      containerStyles={styles.button}
                      isLoading={isSubmitting} textStyles={undefined}          />
          <Link href="/sign-in" style={styles.link}>
            Already have an account? Sign In
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
  },
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '-50%',
    paddingHorizontal: 16,
    marginTop: 15,
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
});
