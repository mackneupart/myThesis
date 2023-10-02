import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { getAllStories, getAllAudioStories } from "./config/Database";
import React, { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function Feed({ navigation }) {
  const [stories, setStories] = useState([]);
  const [audioStories, setAudioStories] = useState([]);
  const [locationInfo, setLocationInfo] = useState([]);
  const [locationInfoAudio, setLocationInfoAudio] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const getStories = async () => {
      const stories = await getAllStories();
      setStories(stories);
    };
    getStories();
    //fetch all audio stories from the database
    const getAudiostories = async () => {
      const audioStories = await getAllAudioStories();
      setAudioStories(audioStories);
    };
    getAudiostories();
  }, []);
  useEffect(() => {
    const fetchLocationInfo = async () => {
      const locationInfo = await Promise.all(
        stories.map(async (story) => {
          const address = await fetchReverseGeocode(
            story.coordinates[0],
            story.coordinates[1]
          );
          return { story, address };
        })
      );
      setLocationInfo(locationInfo);
    };

    fetchLocationInfo();
  }, [stories]);

  useEffect(() => {
    const fetchLocationInfoAudio = async () => {
      const locationInfoAudio = await Promise.all(
        audioStories.map(async (story) => {
          const address = await fetchReverseGeocode(
            story.coordinates[0],
            story.coordinates[1]
          );
          return { story, address };
        })
      );
      setLocationInfoAudio(locationInfoAudio);
    };

    fetchLocationInfoAudio();
  }, [audioStories]);

  const fetchReverseGeocode = async (latitude, longitude) => {
    const reverseGeocodeAddress = await Location.reverseGeocodeAsync({
      latitude: latitude,
      longitude: longitude,
    });
    const formattedAddress = reverseGeocodeAddress[0]?.city || "Unknown";
    return formattedAddress;
  };

  const handleNavigation = (story) => {
    navigation.navigate("Story", { story });
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Fetch new data or update your stories here
    const newStories = await getAllStories();
    setStories(newStories);
    setRefreshing(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Annotations</Text>
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 100,
            alignItems: "flex-start",
            marginLeft: 20,
          }} // Add some padding to the bottom
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <Text style={styles.textHeader}>New Stories</Text>
          <View>
            {locationInfo.map((item, index) => (
              <TouchableOpacity
                key={`story-${index}`}
                onPress={() => handleNavigation(item.story)}>
                <View style={styles.storyContainer}>
                  <Text style={styles.textTitle}>{item.story.title} </Text>
                  <Text>Location: {item.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.textHeader}>Audio Stories</Text>
          <View>
            {locationInfoAudio.map((item, index) => (
              <TouchableOpacity
                key={`story-${index}`}
                onPress={() => handleNavigation(item.story)}>
                <View style={styles.storyContainer}>
                  <Text style={styles.textTitle}>{item.story.title} </Text>
                  <Text>Location: {item.address}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    fontSize: 40,
  },

  logoBox: {
    backgroundColor: "lightgrey",
    height: 110,
    marginTop: 60,
    width: 320,
    borderRadius: 10,
  },
  logoText: {
    marginTop: 10,
    fontSize: 25,
    fontFamily: "FiraCode-Bold",
    fontWeight: "bold",
    color: "#8F5AFF",
    padding: 30,
  },
  textHeader: {
    marginTop: 30,
    fontSize: 40,
    fontFamily: "KaiseiTokumin-Regular",
  },
  textTitle: {
    fontSize: 25,
    fontFamily: "KaiseiTokumin-Regular",
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 20,
  },
  storyContainer: {
    justifyContent: "center",
    width: 300,
    height: 80,
    padding: 10,
    backgroundColor: "white",
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#000", // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow offset (x, y)
    shadowOpacity: 0.4, // Shadow opacity
    shadowRadius: 4, // Shadow radius
  },
});
