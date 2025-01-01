import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { View, Text, Image } from "react-native";
import {icons} from '../../constants'

const TabIcon = ({ icon, color, name, focused}) => {
    return(
        <View className="items-center justify-center gap-2">
            <Image
                source={icon}
                resizeMode='contain'
                tintColor={color}
                className="w-6 h-6"
            />
            <Text className={`${focused ? 'font-psemibold': 'font-pregular'} text-xs`}>
                {name}
            </Text>
        </View>
    )
}

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#161622", // Modern dark background color
          
          borderTopWidth: 1,
          borderTopColor: '#232533',
          height:84,

        },
        tabBarActiveTintColor: "#ff8c00", // Rich orange for active icons
        tabBarInactiveTintColor: "#ffffff", // White for inactive icons
        tabBarLabelStyle: {
          fontSize: 12, // Adjust font size
        },
      }}
    >
    
        <Tabs.Screen
        name="report"
        options={{
          title: 'Report',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="ambulance" color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="wrench" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="user-circle" color={color} />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout