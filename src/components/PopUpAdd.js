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
import { saveStory, saveAudioStory, uploadPhoto } from "../config/Database";
import AudioRecording from "./AudioRecording";

export default function PopUpAdd({ navigation }) {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [title, settitle] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [textLocation, setTextLocation] = useState("");
  const [location, setLocation] = useState(null);
  const [isTextChecked, setIsTextChecked] = useState(true);
  const [isAudioChecked, setIsAudioChecked] = useState(false);
  const [receivedAudioFile, setReceivedAudioFile] = useState(null);
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  // useEffect(() => {
  //   const getCurrentLocation = async () => {
  //     try {
  //       const { coords } = await Location.getCurrentPositionAsync();
  //       const { latitude, longitude } = coords;
  //       setCurrentLocation({ latitude, longitude });
  //     } catch (error) {
  //       console.log("Error getting location:", error);
  //     }
  //   };
  //   getCurrentLocation();
  // }, []);

  // useEffect(() => {
  //   console.log("Current Location:", currentLocation);
  // }, [currentLocation]);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const imageURL = await uploadPhoto(image);
        setImageURL(imageURL);
      } catch (error) {
        console.log("ERROR fetching imageURL " + error);
      }

      fetchImage();
    };
  }, [image]);

  useEffect(() => {
    if (location) {
      const getNaturalLocation = async () => {
        const geocode = await Location.reverseGeocodeAsync(location);

        if (geocode.length > 0) {
          const formattedAddress = `${geocode[0].street}, ${geocode[0].city}`;
          setTextLocation(formattedAddress);
        }

        return "Unknown Location";
      };
      getNaturalLocation();
    }
  }, [location]);

  const handleSubmit = async () => {
    const coordinates = [location.latitude, location.longitude];
    const story = {
      title: title,
      description: description,
      coordinates: coordinates,
      image: imageURL,
    };
    console.log(story.title, story.description, story.coordinates);
    try {
      await saveStory(story);
      settitle("");
      setDescription("");
      setTextLocation("");
      setImageURL(null);
      setIsPopupVisible(false);
    } catch (error) {
      alert("Something went wrong with saving the story");
      console.log(error + " Error saving story");
    }
  };

  // const useCurrentLocation = () => {
  //   if (currentLocation !== null) {
  //     setLatitude(currentLocation.latitude);
  //     setLongitude(currentLocation.longitude);
  //     setCurrentLocation({ latitude, longitude });
  //   }
  // };

  const openPopup = () => {
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    settitle("");
    setDescription("");
    setTextLocation("");
    setImageURL(null);
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

  const handleNavigationCamera = () => {
    navigation.navigate("CameraComponent", {
      updatePopupVisibility: setIsPopupVisible,
      updateImage: setImage,
      updateImageURL: setImageURL,
    });
    setIsPopupVisible(false);
  };
  const handleNavigationMap = () => {
    navigation.navigate("AddLocationMap", {
      updatePopupVisibility: setIsPopupVisible,
      updateLocation: setLocation,
    });
    setIsPopupVisible(false);
  };

  const handleAudioSubmit = async () => {
    const coordinates = [location.latitude, location.longitude];
    const audioURL = receivedAudioFile;
    const story = {
      title: title,
      audioURL: audioURL,
      coordinates: coordinates,
      image: imageURL,
    };
    console.log(story.title, story.audioURL, story.coordinates);
    try {
      await saveAudioStory(story);
      settitle("");
      setTextLocation("");
      setImage(null);
      setImageURL(null);
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
                <View>
                  <Text style={styles.radioText}>Text story:</Text>
                </View>
                <TouchableOpacity onPress={() => handleTextRadio()}>
                  <View style={styles.radio}>
                    {isTextChecked ? <Text>X</Text> : null}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.radioContainer}>
                <View>
                  <Text style={styles.radioText}>audio story:</Text>
                </View>

                <TouchableOpacity onPress={() => handleAudioRadio()}>
                  <View style={styles.radio}>
                    {isAudioChecked ? <Text>X</Text> : null}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  handleNavigationCamera();
                }}>
                <Image
                  source={require("../assets/icons/cameraplus.png")}
                  style={{
                    height: 50,
                    width: 50,
                    marginTop: 10,
                    marginBottom: 10,
                    tintColor: "#8F5AFF",
                  }}
                />
                {imageURL && (
                  <Text
                    style={{ color: "blue", marginBottom: 20, maxWidth: 200 }}>
                    {imageURL.split("/")[imageURL.split("/").length - 1]}
                  </Text>
                )}
              </TouchableOpacity>
              <TextInput
                style={styles.input}
                placeholder="Enter title"
                onChangeText={(text) => settitle(text)}
                value={title}
              />
            </View>
            {isTextChecked ? (
              <View>
                <TextInput
                  style={styles.inputStory}
                  placeholder="Enter your story"
                  onChangeText={(text) => setDescription(text)}
                  value={description}
                  multiline={true}
                  returnKeyType="done"
                  onKeyPress={({ nativeEvent }) => {
                    if (
                      nativeEvent.key === "Enter" ||
                      nativeEvent.key === "Done"
                    ) {
                      // Handle the "Done" key press
                      setDescription(""); // Clear the input or perform any other action
                      Keyboard.dismiss(); // Dismiss the keyboard
                    }
                  }}
                />
              </View>
            ) : (
              <View style={styles.recording}>
                <AudioRecording handleAudioRecording={handleAudioRecording} />
              </View>
            )}

            <TouchableOpacity onPress={handleNavigationMap}>
              <Text
                style={{
                  fontSize: 18,
                  color: "#8F5AFF",
                  fontWeight: "bold",
                }}>
                Add location
              </Text>
            </TouchableOpacity>
            <View style={{ marginBottom: 40 }}>
              <Text>Address {"(street name, city)"}:</Text>
              {textLocation && (
                <Text style={{ color: "blue" }}>{textLocation}</Text>
              )}
            </View>

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

  recording: {
    marginBottom: 30,
  },
});
