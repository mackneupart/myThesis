import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { Audio } from "expo-av";
import { useState } from "react";
import { saveAudioStory, uploadAudioFile } from "../config/Database";

export default function AudioRecording() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");
  const [realRecording, setRealRecording] = useState(null);

  async function startRecording() {
    try {
      const permission = await Audio.requestPermissionsAsync();

      if (permission.status === "granted") {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          playsInSilentModeIOS: true,
        });

        const { recording } = await Audio.Recording.createAsync(
          Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
        );
        setIsRecording(true);

        setRecording(recording);
      } else {
        setMessage(
          "Please grant permission to the app to access the microphone"
        );
      }
    } catch (err) {
      console.error("Recording error", err);
    }
  }

  async function stopRecording() {
    await recording.stopAndUnloadAsync();
    setIsRecording(false);
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    const updatedRecording = {
      sound: sound,
      duration: getDurationFormatted(status.durationMillis),
      file: recording.getURI(),
    };
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playThroughEarpieceAndroid: false,
    });

    setRealRecording(updatedRecording);
  }

  function getDurationFormatted(millis) {
    const minutes = millis / 1000 / 60;
    const minutesDisplay = Math.floor(minutes);
    const seconds = Math.round((minutes - minutesDisplay) * 60);
    const secondsDisplay = seconds < 10 ? `0${seconds}` : seconds;
    return `${minutesDisplay}:${secondsDisplay}`;
  }

  handleUpload = async (audio) => {
    console.log(audio);
    const story = {
      title: "test",
      file: audio.file,
      coordinates: {
        latitude: 0,
        longitude: 0,
      },
    };
    try {
      await saveAudioStory(story);
    } catch (error) {
      console.log("error" + error);
    }
  };

  function getRecording() {
    return (
      <View style={styles.recording}>
        <Text style={styles.fill}>
          Recording {1} - {realRecording.duration}
        </Text>
        <Button
          onPress={() => realRecording.sound.replayAsync()}
          title="Play"></Button>
        <Button
          onPress={() => handleUpload(realRecording)}
          title="Upload"></Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>{message}</Text>
      <View style={styles.audiobutton}>
        <Button
          title={isRecording ? "Stop Recording" : "Start Recording"}
          onPress={isRecording ? stopRecording : startRecording}
        />
      </View>
      {realRecording && getRecording()}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  audiobutton: {
    backgroundColor: "lightgrey",
    borderWidth: 1,
    borderRadius: 100,
    padding: 10,
  },
  recording: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
