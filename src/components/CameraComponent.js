import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Camera } from "expo-camera";

export default function CameraComponent() {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    console.log("camera accepted");
    return <View />;
  }
  if (hasPermission === false) {
    console.log("camera denied");
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <Camera style={{ flex: 1 }} type={type}>
        <View style={styles.cameraView}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={styles.cameraText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  cameraView: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "row",
  },
  cameraButton: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  cameraText: {
    fontSize: 18,
    color: "black",
  },
});
