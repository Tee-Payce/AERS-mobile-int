import CustomButton from "@/components/CustomButton";
import { useGlobalContext } from "@/context/GlobalProvider";
import { Link, Redirect, router } from "expo-router";
import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-polyfill-globals/auto';



const App = () => {
  const {isLoading, isLoggedIn } = useGlobalContext();

  if(!isLoading && isLoggedIn) return <Redirect href='/find'/>

  return (
    <SafeAreaView style={styles.container}>
     
        <View style={styles.contentContainer}>
          <Text style={styles.title}>AERS
     
    </Text>
    <CustomButton
          title="continue to App"
          handlePress={() => router.push('/sign-in')}
          containerStyles={styles.customButtonContainer}
          textStyles={styles.customButtonText} isLoading={undefined}          />
          <Link href="/find" style={styles.link}>
            Jump to locate
          </Link>
    </View>
    </SafeAreaView>
  );
}
export default App

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#161622',
    flex: 1,
  },
 
  contentContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 36,
    textAlign: 'center',
    color: 'red',
    fontFamily: 'Poppins-ExtraBold',
  },
  customButtonContainer: {
    backgroundColor: '#FF9001',
    borderRadius: 12,
    minHeight: 62,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 28,
  },
  customButtonText: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
  },
  link: {
    color: 'blue',
    marginTop: 12,
  },
});