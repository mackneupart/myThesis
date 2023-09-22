import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import { getAllStories } from "./config/Database";
import { useFocusEffect } from "@react-navigation/native";

export default function Map({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
      }
    };

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
        <Text style={styles.logoText}>Queer Fortællinger</Text>
      </View>
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
    position: "absolute",
    backgroundColor: "lightgrey",
    height: 110,
    marginTop: 60,
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
});
