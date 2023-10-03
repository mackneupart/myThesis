import { useEffect, useState, useRoute } from "react";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import { uploadPhoto } from "../config/Database";
import { Camera } from "expo-camera";
import CustomButton from "./customButton";

export default function CameraComponent({ route, navigation }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
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
    }
  };

  const handleRetakePhoto = () => {
    setCapturedImage(null);
  };

  const handleSavePhoto = async () => {
    if (capturedImage) {
      // Upload the photo and get the URL
      const imageURL = await uploadPhoto(capturedImage);

      // Update the image URL and image state
      route.params.updateImage(capturedImage);
      route.params.updateImageURL(imageURL);
    }

    route.params.updatePopupVisibility(true);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {hasPermission === null ? (
        <Text>Requesting camera permission...</Text>
      ) : hasPermission === false ? (
        <Text>No access to camera</Text>
      ) : (
        <>
          {!capturedImage ? (
            <View>
              <Camera
                style={styles.camera}
                ref={(ref) => setCameraRef(ref)}
                type={Camera.Constants.Type.back}></Camera>
              <CustomButton
                text="take photo"
                onPress={handleTakePhoto}
                textColor="white"
                bgColor={"#8F5AFF"}
              />
            </View>
          ) : (
            <>
              <Image
                source={{ uri: capturedImage }}
                style={styles.previewImage}
              />
              <View style={styles.buttonContainer}>
                <CustomButton
                  text="retake"
                  onPress={handleRetakePhoto}
                  textColor="white"
                  bgColor={"#8F5AFF"}
                />
                <CustomButton
                  text="save"
                  onPress={handleSavePhoto}
                  textColor="white"
                  bgColor={"#8F5AFF"}
                />
              </View>
            </>
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
  previewImage: {
    width: 300,
    height: 300,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
