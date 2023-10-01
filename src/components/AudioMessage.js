import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { saveAudioStory, uploadAudioFile } from "../config/Database";

export default function AudioRecording() {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [message, setMessage] = useState("");

  const handlePlay = async () => {};
  const handleUpload = async () => {};

  function getRecording() {
    return (
      <View style={styles.recording}>
        <Text style={styles.fill}>Recording goes here</Text>
        <Button onPress={() => handlePlay()} title="Play"></Button>
        <Button onPress={() => handleUpload()} title="Upload"></Button>
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
      {recording && getRecording()}
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
