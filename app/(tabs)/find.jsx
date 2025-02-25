import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Alert, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Client, Databases, Query } from 'react-native-appwrite';
import { config } from '../../lib/appwrite';
import CustomButton from '../../components/CustomButton';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useGlobalContext } from '../../context/GlobalProvider';

//api key AIzaSyAto3LQyz0EUXw2PC2yENPhrV4lblIjc38

// Initialize the Appwrite Client
const client = new Client();
client.setEndpoint(config.endpoint).setProject(config.projectId);
const databases = new Databases(client);

const Find = () => {
  const [responders, setResponders] = useState([]);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [visibleResponder, setVisibleResponder] = useState(null);
  const [navigationPath, setNavigationPath] = useState(null);

  const { user } = useGlobalContext();
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  };

  const fetchResponders = async (responderClass) => {
    if (!location) {
      Alert.alert('Error', 'Location not available yet.');
      return;
    }

    try {
      const classResponse = await databases.listDocuments(
        config.databaseId,
        config.classCollectionId,
        [Query.equal('class', responderClass)]
      );

      if (classResponse.documents.length === 0) {
        Alert.alert('Error', `No incident class found for ${responderClass}`);
        return;
      }

      const classId = classResponse.documents[0].$id;

      const response = await databases.listDocuments(
        config.databaseId,
        config.responderCollectionId,
        [Query.equal('incidentClass', classId)]
      );

      if (response.documents.length === 0) {
        Alert.alert('No Responders Found', `No responders found for ${responderClass}.`);
      } else {
        const respondersWithDistance = response.documents.map((responder) => {
          const distance = responder.location
            ? calculateDistance(
                location.latitude,
                location.longitude,
                responder.location[1],
                responder.location[0]
              )
            : null;
          return { ...responder, distance };
        });

        setResponders(respondersWithDistance);
      }
    } catch (error) {
      console.error('Error fetching responders:', error.message || error);
      Alert.alert('Error', 'Unable to fetch responders. Please try again later.');
    }
  };

  const renderResponder = ({ item }) => (
    <View style={styles.responderContainer}>
      <Text style={styles.responderName}>Name: {item.name}</Text>
      <Text>Contact: {item.contact_number}</Text>
      <Text>Email: {item.email}</Text>
      {item.location && (
        <Text>Location: {item.location[0]}, {item.location[1]}</Text>
      )}
      {item.distance && (
        <Text>Distance: {item.distance.toFixed(2)} km</Text>
      )}
      <View style={styles.nav}>
        <Text onPress={() => setVisibleResponder(item)}>
          <FontAwesome size={22} name='search' color='#ff8c00' /> Find
        </Text>
        <Text
          onPress={() => {
            if (!location || !item.location) {
              Alert.alert('Error', 'Location data unavailable for navigation.');
              return;
            }
            setNavigationPath([
              { latitude: location.latitude, longitude: location.longitude },
              { latitude: item.location[1], longitude: item.location[0] },
            ]);
          }}
        >
          <FontAwesome name="location-arrow" size={22} color="#161622" /> Navigate
        </Text>
        <Text>
          <FontAwesome name='phone' size={22} color='#ff8c00' /> Contact
        </Text>
        <Text
          onPress={() => {
            if (!user) {
              Alert.alert('Error', 'User not logged in. Please log in to continue.');
              return;
            }
            console.log('user', user.$id);
            console.log('responder',item.$id)
            const chatId = `${user.$id}_${item.$id}`;
            router.push({
              pathname: `/messages/${chatId}`,
              params: { userId: user.$id, responderId: item.$id},
            });
            console.log('chat',chatId)
          }}
        >
          <FontAwesome name='comments-o' size={22} color='#161622' /> Chat
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          <FontAwesome size={24} name="map-marker" color='#ff8c00' /> Find Emergency Responders
        </Text>
        <View style={styles.buttonContainer}>
          <CustomButton
            containerStyles={styles.button}
            title="Police"
            handlePress={() => fetchResponders('fire')}
          />
          <CustomButton
            containerStyles={styles.button}
            title="Fire"
            handlePress={() => fetchResponders('police')}
          />
          <CustomButton
            containerStyles={styles.button}
            title="Ambulance"
            handlePress={() => fetchResponders('ambulance')}
          />
        </View>
      </View>
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Your Location"
            pinColor="blue"
          />
          {visibleResponder && visibleResponder.location && (
            <Marker
              key={visibleResponder.$id}
              coordinate={{
                latitude: visibleResponder.location[1],
                longitude: visibleResponder.location[0],
              }}
              title={visibleResponder.name}
              description={`Contact: ${visibleResponder.contact_number}`}
            />
          )}
          {navigationPath && (
            <Polyline
              coordinates={navigationPath}
              strokeColor="blue"
              strokeWidth={3}
            />
          )}
        </MapView>
      )}
      <FlatList
        data={responders}
        renderItem={renderResponder}
        keyExtractor={(item) => item.$id}
      />
      {/* <TouchableOpacity onPress={()=>{router.push('/sign-in')}}>
       <Text> Go back to login </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Find;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { justifyContent: 'center', alignItems: 'center', marginBottom: 10, marginTop: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#ff8c00' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 },
  button: { backgroundColor: '#161622', borderRadius: 3, minHeight: 22, width: '33%', padding: 5, justifyContent: 'center', alignItems: 'center' },
  nav: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  map: { width: '100%', height: 300, marginBottom: 20 },
  responderContainer: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  responderName: { fontWeight: 'bold' },
});
