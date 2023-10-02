import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { uploadPhoto } from "../config/Database";
import { Camera } from "expo-camera";

export default function AddPhoto() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleTakePhoto = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setCapturedImage(photo.uri);
      setIsPreviewing(true);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
    setIsPreviewing(false);
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <>
          <Camera
            style={styles.camera}
            ref={(ref) => setCameraRef(ref)}
            type={Camera.Constants.Type.back}
          />

          {!isPreviewing ? (
            <Button
              title="Take Photo"
              onPress={handleTakePhoto}
              disabled={!cameraRef}
            />
          ) : (
            <>
              <Button title="Retake" onPress={handleRetakePhoto} />
              <Button
                title="Save Photo"
                onPress={() => uploadPhoto(capturedImage)}
              />
            </>
          )}

          {capturedImage && (
            <View style={styles.previewContainer}>
              <Text>Captured Photo:</Text>
              <Image
                source={{ uri: capturedImage }}
                style={styles.previewImage}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  previewContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  previewImage: {
    width: 200,
    height: 200,
  },
});
