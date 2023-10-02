import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";
import { saveStory, saveAudioStory } from "../config/Database";
import AudioRecording from "./AudioRecording";
import { ReemKufiInk_400Regular } from "@expo-google-fonts/dev";

export default function PopUpAdd() {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [textLocation, setTextLocation] = useState("");
  const [isTextChecked, setIsTextChecked] = useState(true);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [receivedAudioFile, setReceivedAudioFile] = useState(null);

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
  }, [currentLocation]);

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
      settitle("");
      setDescription("");
      setTextLocation("");
      setIsPopupVisible(false);
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

  const dismissKeyboard = () => {
    // Handle the "Done" button press
    Keyboard.dismiss(); // Close the keyboard
  };

  const openPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };
  const handleTextRadio = () => {
    setIsTextChecked(true);
    setIsAudioChecked(false);
  };
  const handleAudioRadio = () => {
    setIsTextChecked(false);
    setIsAudioChecked(true);
  };

  const handleAudioRecording = (audioData) => {
    setReceivedAudioFile(audioData);
  };

  const handleAudioSubmit = async () => {
    const coordinates = [latitude, longitude];
    const audioURL = receivedAudioFile;
    console.log(audioURL);
    const story = {
      title: title,
      audioURL: audioURL,
      coordinates: coordinates,
    };
    console.log(story.title, story.audioURL, story.coordinates);
    try {
      await saveAudioStory(story);
      settitle("");
      setTextLocation("");
      setIsPopupVisible(false);
    } catch (error) {
      alert("Something went wrong with saving the story");
      console.log(error + " Error saving audio story");
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={openPopup} style={styles.imagecontainer}>
        <Image
          source={require("../assets/icons/plus.png")}
          resizeMode="contain"
          style={styles.image}
        />
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isPopupVisible}
        onRequestClose={closePopup}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.radioButtons}>
              <View style={styles.radioContainer}>
                <View style={styles.radioText}>
                  <Text>Text story:</Text>
                </View>
                <TouchableOpacity onPress={() => handleTextRadio()}>
                  <View style={styles.radio}>
                    {isTextChecked ? <Text>X</Text> : null}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.radioContainer}>
                <View style={styles.radioText}>
                  <Text>audio story:</Text>
                </View>

                <TouchableOpacity onPress={() => handleAudioRadio()}>
                  <View style={styles.radio}>
                    {isAudioChecked ? <Text>X</Text> : null}
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <Text>Title:</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter title"
              onChangeText={(text) => settitle(text)}
              value={title}
            />
            {isTextChecked ? (
              <View>
                <TextInput
                  style={styles.inputStory}
                  placeholder="Enter your story"
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                  multiline={true}
                  returnKeyType="done"
                  onSubmitEditing={() => {
                    console.log("Submit button pressed");
                    Keyboard.dismiss();
                  }}
                />
              </View>
            ) : (
              <AudioRecording handleAudioRecording={handleAudioRecording} />
            )}

            <Text>Address {"(street name, city)"}:</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter location"
              onChangeText={(text) => setTextLocation(text)}
            />

            {/* <TouchableOpacity onPress={useCurrentLocation}>
              <Text>Use current location</Text>
            </TouchableOpacity>

            <Text>latitude: {latitude}</Text>
            <Text>longitude: {longitude}</Text> */}
            <View style={styles.buttonContainer}>
              {isTextChecked ? (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleAudioSubmit}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closePopup}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    backgroundColor: "#8F5AFF",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagecontainer: {
    top: -30,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 60,
    height: 60,
    tintColor: "#8F5AFF",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 20,
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
  inputStory: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    width: 200,
    height: 100,
  },
  radioButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  radioContainer: {
    flexDirection: "row",
    marginLeft: 10,
  },
  radio: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.4,
    height: 16,
    width: 16,
    borderRadius: 100,
  },
});
