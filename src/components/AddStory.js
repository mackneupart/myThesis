import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { useState, useEffect } from "react";
import CustomButton from "./customButton";
import * as Location from "expo-location";
import { saveStory } from "../config/Database";
import { useNavigation } from "@react-navigation/native"; // Import useNavigation

export default function AddStory({ onClose }) {
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [textLocation, setTextLocation] = useState("");

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

  useEffect(() => {
    console.log("Current Location:", currentLocation);
    // if (currentLocation !== null) {
    //   setLatitude(currentLocation.latitude);
    //   setLongitude(currentLocation.longitude);
    // }
  }, [currentLocation]);

  const dismissKeyboard = () => {
    // Handle the "Done" button press
    Keyboard.dismiss(); // Close the keyboard
  };

  useEffect(() => {
    const geoCodeLocation = async () => {
      try {
        const location = await Location.geocodeAsync(textLocation);
        if (location && location.length > 0) {
          const { latitude, longitude } = location[0];
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
          // Do something with latitude and longitude
          setLatitude(latitude);
          setLongitude(longitude);
        } else {
          console.log("Location not found");
        }
      } catch (error) {
        console.error("Error geocoding address:", error);
      }
    };
    geoCodeLocation();
  }, [textLocation]);

  const handleSubmit = async () => {
    const coordinates = [latitude, longitude];
    const story = {
      title: title,
      description: description,
      coordinates: coordinates,
    };
    console.log(story.title, story.description, story.coordinates);
    try {
      await saveStory(story);
      onClose();
    } catch (error) {
      alert("Something went wrong with saving the story");
      console.log(error + " Error saving story");
    }
  };

  const useCurrentLocation = () => {
    if (currentLocation !== null) {
      setLatitude(currentLocation.latitude);
      setLongitude(currentLocation.longitude);
      setCurrentLocation({ latitude, longitude });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text style={styles.textHeader}>Add your story to the map!</Text>
        <Text>Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter title"
          onChangeText={(text) => settitle(text)}
          value={title}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your story"
          onChangeText={(text) => setDescription(text)}
          value={description}
          multiline={true}
        />
        <Text>Location:</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter location"
          onChangeText={(text) => setTextLocation(text)}
        />

        <TouchableOpacity onPress={useCurrentLocation}>
          <Text>Use current location</Text>
        </TouchableOpacity>

        <Text>latitude: {latitude}</Text>
        <Text>longitude: {longitude}</Text>

        <CustomButton
          text="Submit"
          onPress={handleSubmit}
          textColor="white"
          bgColor={"#8F5AFF"}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textHeader: {
    fontSize: 20,
    marginBottom: 40,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: 200,
  },
});