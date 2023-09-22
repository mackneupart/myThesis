import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export default function Story({ route }) {
  const { story } = route.params;
  const [address, setAddress] = useState("");

  useEffect(() => {
    const reverseGeocode = async () => {
      const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
        latitude: story.coordinates[0],
        longitude: story.coordinates[1],
      });
      console.log(reverseGeocodeAddress);
      setAddress(reverseGeocodeAddress[0].name);
    };
    reverseGeocode();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Title: {story.title}</Text>
      <Text style={styles.textViews}>Address: {address}</Text>
      <Text style={styles.textViews}>Description: {story.description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    fontSize: 40,
  },
  textHeader: {
    marginTop: 20,
    fontSize: 50,
    color: "blue",
  },
  textViews: {
    marginTop: 20,
    fontSize: 30,
  },
});
