import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { getAllStories, getUser, getUserDetails } from "./config/Database";
import { useFocusEffect } from "@react-navigation/native";
import PopUpAdd from "./components/PopUpAdd";

export default function Map({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [stories, setStories] = useState([]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
      }
    };
    const fetchUserDetails = async () => {
      try {
        const user = await getUserDetails();
        setUsername(user.username);
      } catch (error) {
        setUsername(null); // Set username to null in case of an error
      }
    };
    fetchUserDetails();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { coords } = await Location.getCurrentPositionAsync();
        const { latitude, longitude } = coords;
        setCurrentLocation({ latitude, longitude });
      } catch (error) {
        console.log("Error getting location:", error);
      }
    };

    getCurrentLocation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const getStories = async () => {
        const stories = await getAllStories();
        setStories(stories);
      };
      getStories();
    }, [])
  );

  useEffect(() => {
    console.log("Current Location:", currentLocation);
  }, [currentLocation]);

  const handleMarkerPress = (story) => {
    navigation.navigate("Story", { story });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 55.676098,
          longitude: 12.568337,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {stories.map((story, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: story.coordinates[0],
              longitude: story.coordinates[1],
            }}
            pinColor={story.pinColor}
            title={story.title}>
            <Callout onPress={() => handleMarkerPress(story)}>
              <Text>{story.title}</Text>
            </Callout>
          </Marker>
        ))}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
            title="You are here"
          />
        )}
      </MapView>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Annotations</Text>
      </View>
      {username ? (
        <View style={styles.addButtonContainer}>
          <PopUpAdd />
        </View>
      ) : (
        <Text>failll</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontSize: 30,
  },

  textHeader: {
    marginTop: 20,
    fontSize: 30,
    color: "blue",
  },
  map: {
    marginTop: 80,
    ...StyleSheet.absoluteFillObject,
  },
  logoBox: {
    marginTop: 60,
    position: "absolute",
    backgroundColor: "lightgrey",
    height: 110,
    width: 320,
    borderRadius: 10,
  },
  logoText: {
    position: "absolute",
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "#8F5AFF",
    padding: 30,
  },
  addButtonContainer: {
    position: "absolute",
    bottom: 90,
    left: 0,
    right: 10,
    alignItems: "flex-end",
  },
});
