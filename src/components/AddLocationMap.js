import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import CustomButton from "./customButton";

export default function AddLocationMap({ navigation, route }) {
  const [currentLocation, setCurrentLocation] = useState(undefined);
  const [naturalLocation, setNaturalLocation] = useState("");

  const handleSetLocation = async () => {
    console.log("Location set");
    if (currentLocation) {
      console.log(currentLocation);

      // Fetch the natural location
      const naturalLocation = await getNaturalLocation(currentLocation);

      route.params.updateLocation(naturalLocation);
      route.params.updatePopupVisibility(true);
      console.log("LOCATION: " + naturalLocation);
      navigation.goBack();
    } else {
      console.log("Current location is undefined.");
    }
  };
  const handleMarkerDrag = (e) => {
    // Update the currentLocation state with the new coordinates
    setCurrentLocation(e.nativeEvent.coordinate);
  };
  const getNaturalLocation = async (location) => {
    const geocode = await Location.reverseGeocodeAsync(location);

    if (geocode.length > 0) {
      const formattedAddress = `${geocode[0].street}, ${geocode[0].city}`;
      setNaturalLocation(formattedAddress);
      return formattedAddress;
    }

    return "Unknown Location";
  };
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 55.676098,
          longitude: 12.568337,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={
            currentLocation || { latitude: 55.676098, longitude: 12.568337 }
          }
          pinColor="blue"
          title="Press and hold to place marker"
          draggable={true}
          onDragEnd={handleMarkerDrag}
        />
        <CustomButton
          text="Set Location"
          onPress={handleSetLocation}
          textColor="white"
          bgColor="#8F5AFF"
          style={styles.setLocationButton}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  setLocationButton: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    maxWidth: 200,
  },
});
