import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";

import {
  getAllStories,
  getUserDetails,
  getAllAudioStories,
} from "./config/Database";
import { useFocusEffect } from "@react-navigation/native";
import PopUpAdd from "./components/PopUpAdd";

export default function Map({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [stories, setStories] = useState([]);
  const [audioStories, setAudioStories] = useState([]);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
      }
    };
    if (currentLocation !== null) {
      const fetchUserDetails = async () => {
        try {
          const user = await getUserDetails();
          setUsername(user.username);
        } catch (error) {
          setUsername(null); // Set username to null in case of an error
        }
      };
      fetchUserDetails();
    }
    requestLocationPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      let subscription = null; // Initialize the subscription variable

      const watchLocation = async () => {
        //watch the user's location
        subscription = Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.BestForNavigation,
            distanceInterval: 5,
            timeInterval: 1000,
          },
          (location) => {
            //sets the current posistion to the user's location
            const { coords } = location;
            const { latitude, longitude } = coords;
            setCurrentLocation({ latitude, longitude }); //set current locaiton
          }
        );

        return () => {
          // Cleanup: Remove the subscription when the component is not in focus
          subscription.remove();
          console.log("stopped");
        };
      };

      watchLocation();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      //Fetch all stories from the database
      const getStories = async () => {
        const stories = await getAllStories();
        setStories(stories);
      };
      getStories();

      //fetch all audio stories from the database
      const getAudiostories = async () => {
        const audioStories = await getAllAudioStories();
        setAudioStories(audioStories);
      };
      getAudiostories();
    }, [])
  );

  useEffect(() => {
    console.log("Current Location:", currentLocation);
  }, [currentLocation]);

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadiusKm = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180); // Latitude difference in radians
    const dLon = (lon2 - lon1) * (Math.PI / 180); // Longitude difference in radians

    // Haversine formula
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadiusKm * c; // Distance in kilometers

    return distance;
  }
  const handleMarkerPress = (story) => {
    const distance = calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      story.coordinates[0],
      story.coordinates[1]
    );
    if (distance < 0.1) {
      navigation.navigate("Story", { story });
    } else {
      alert("You are too far away from the story to read it.");
    }
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
            pinColor="red"
            title={story.title}>
            <Callout onPress={() => handleMarkerPress(story)}>
              <Text>{story.title}</Text>
            </Callout>
          </Marker>
        ))}
        {audioStories.map((audioStory, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: audioStory.coordinates[0],
              longitude: audioStory.coordinates[1],
            }}
            pinColor="green"
            title={audioStory.title}>
            <Callout onPress={() => handleMarkerPress(audioStory)}>
              <Text>{audioStory.title}</Text>
            </Callout>
          </Marker>
        ))}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
            title="You are here">
            <Image
              source={require("./assets/icons/person.png")} // Replace with the actual path to your custom icon
              style={{ width: 40, height: 60 }} // Customize the size of the icon
            />
          </Marker>
        )}
      </MapView>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Annotations</Text>
      </View>
      {username && (
        <View style={styles.addButtonContainer}>
          <PopUpAdd navigation={navigation} />
        </View>
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
    // marginTop: 80,
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
    fontFamily: "FiraCode-Bold",
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
