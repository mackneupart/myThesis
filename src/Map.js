import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import data from "../data.json";
import * as Location from "expo-location";

export default function Map({ navigation }) {
  const [currentLocation, setCurrentLocation] = useState(null);

  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Location permission denied");
      }
    };

    requestLocationPermission();
  }, []);

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

  const Halmtorvet = {
    latitude: 55.6699,
    longitude: 12.5595,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const handlePress = () => {
    alert("You pressed the marker!");
  };
  const handleMarkerPress = (marker) => {
    navigation.navigate("About", { marker });
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 55.676098,
          longitude: 12.568337,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        {data.map((marker, index) => (
          <Marker
            key={index}
            coordinate={marker.coordinates}
            pinColor={marker.pinColor}
            title={marker.name}>
            <Callout onPress={() => handleMarkerPress(marker)}>
              <Text>{marker.name}</Text>
            </Callout>
          </Marker>
        ))}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
            title="You are here"
          />
        )}
      </MapView>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Fortællinger</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    fontSize: 30,
  },
  textHeader: {
    marginTop: 20,
    fontSize: 30,
    color: "blue",
  },
  map: {
    marginTop: 80,
    ...StyleSheet.absoluteFillObject,
  },
  logoBox: {
    position: "absolute",
    backgroundColor: "lightgrey",
    height: 110,
    marginTop: 60,
    width: 320,
    borderRadius: 10,
  },
  logoText: {
    position: "absolute",
    marginTop: 10,
    fontSize: 25,
    fontWeight: "bold",
    color: "#8F5AFF",
    padding: 30,
  },
});
