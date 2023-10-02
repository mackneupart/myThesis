import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Button,
  Image,
} from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { Audio } from "expo-av";

export default function Story({ route }) {
  const { story } = route.params;
  const [address, setAddress] = useState("");
  const [isAudio, setIsAudio] = useState(false);
  const [audioDuration, setAudioDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [soundObject, setSoundObject] = useState(null);

  useEffect(() => {
    const reverseGeocode = async () => {
      const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
        latitude: story.coordinates[0],
        longitude: story.coordinates[1],
      });
      console.log(reverseGeocodeAddress);
      setAddress(
        reverseGeocodeAddress[0].name + ", " + reverseGeocodeAddress[0].city
      );
    };
    reverseGeocode();

    if (story.audioURL) {
      setIsAudio(true);
    }
  }, []);

  useEffect(() => {
    const loadAudio = async () => {
      try {
        const soundObject = new Audio.Sound();

        await soundObject.loadAsync({ uri: story.audioURL });
        // Set audio mode to play through the speaker
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playThroughEarpieceAndroid: false,
        });

        // Get the duration of the audio
        const status = await soundObject.getStatusAsync();
        setAudioDuration(status.durationMillis);
        setSoundObject(soundObject);

        // Detect when playback finishes
        soundObject.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            // Playback finished, reset state
            setIsPlaying(false);
          }
        });
      } catch (error) {
        console.error("Error loading audio:", error);
      }
    };

    if (isAudio) {
      loadAudio();
    }
    // Cleanup: Stop and unload audio when the component unmounts
    return () => {
      if (soundObject) {
        soundObject.stopAsync();
        soundObject.unloadAsync();
        setIsPlaying(false);
      }
    };
  }, [isAudio]); // Load audio when isAudio becomes true

  const playAudio = async () => {
    if (soundObject) {
      try {
        if (isPlaying) {
          // Pause playback and reset state
          await soundObject.pauseAsync();
          setIsPlaying(false);
        } else {
          // Start playback and update state
          await soundObject.replayAsync();
          setIsPlaying(true);
        }
      } catch (error) {
        console.error("Error toggling audio playback:", error);
      }
    }
  };

  function formatDuration(durationMillis) {
    const totalSeconds = durationMillis / 1000;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  }

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <Text style={styles.textHeader}>Title: {story.title}</Text>
        <Text style={styles.infoText}>Author: {story.author}</Text>
        <Text style={styles.infoText}>Address: {address}</Text>
      </View>
      {isAudio ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 50,
            }}>
            <Image source={require("./assets/icons/speaker.png")} />
            <Button
              onPress={() => {
                playAudio();
              }}
              title={isPlaying ? "Pause" : "Play"}
            />
          </View>
          <Text style={{ alignSelf: "center" }}>
            Duration: {formatDuration(audioDuration)}
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer}>
          <Text style={styles.textDescription}>{`"${story.description}"`}</Text>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontSize: 40,
  },
  textHeader: {
    fontFamily: "KaiseiTokumin-Regular",
    color: "#8F5AFF",
    fontSize: 30,
  },
  textDescription: {
    fontFamily: "KaiseiTokumin-Regular",
    fontSize: 20,
    fontStyle: "italic",
  },
  infoText: {
    fontFamily: "KaiseiTokumin-Regular",
    fontSize: 14,
  },
  infoContainer: {
    backgroundColor: "lightgrey",
    padding: 50,
    margin: 10,
  },
  scrollContainer: {
    margin: 10,
    paddingRight: 20,
    paddingLeft: 20,
    marginBottom: 20,
  },
});
