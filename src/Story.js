import { StyleSheet, Text, View, ScrollView, Button } from "react-native";
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
      <Text style={styles.textHeader}>
        Title: {"\n"}
        {story.title}
      </Text>
      <Text style={styles.textViews}>Author: {story.author}</Text>
      <Text style={styles.textViews}>Address: {address}</Text>
      {isAudio ? (
        <View>
          <Text>AUDIO</Text>
          <Button
            onPress={() => {
              playAudio();
            }}
            title={isPlaying ? "Pause" : "Play"}
          />
          <Text>Duration: {formatDuration(audioDuration)}</Text>
        </View>
      ) : (
        <ScrollView>
          <Text style={styles.textViews}>Description: {story.description}</Text>
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
    marginTop: 20,
    fontSize: 40,
  },
  textViews: {
    fontFamily: "KaiseiTokumin-Regular",
    marginTop: 20,
    fontSize: 20,
  },
});
