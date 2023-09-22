import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  getUserDetails,
  signOutUser,
  getStoriesForUser,
  deleteStory,
} from "./config/Database";
import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import CustomButton from "./components/customButton";

export default function Profile({ handleUserLogout, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [stories, setUserStories] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserDetails = async () => {
        const user = await getUserDetails();
        setUsername(user.username);
        setEmail(user.email);
      };

      const fetchUserStories = async () => {
        const userStories = await getStoriesForUser();
        setUserStories(userStories);
      };

      fetchUserDetails();
      fetchUserStories();
    }, [])
  );

  const handleLogout = () => {
    try {
      signOutUser();
      handleUserLogout();
    } catch (error) {
      console.log("logout error: " + error);
    }
  };

  const handleNavigation = (story) => {
    navigation.navigate("Story", { story });
  };

  const handleDelete = async (story) => {
    try {
      await deleteStory(story.storyID);
      // const userStories = await getStoriesForUser();
      // setUserStories(userStories);
    } catch (error) {
      console.log("Error deleting story: " + error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Fortællinger</Text>
      </View>

      <View style={styles.userDetails}>
        <Text style={styles.textHeader}>Hi, {username}!</Text>
        <Text style={styles.textViews}>Your email: {email}</Text>
        <CustomButton
          text="Logout"
          onPress={handleLogout}
          textColor="white"
          bgColor={"#8F5AFF"}
        />
      </View>
      <View style={styles.scrollContainer}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }} // Add some padding to the bottom
        >
          <Text style={styles.textHeader}>Contributions</Text>
          <View>
            {stories.map((story, index) => (
              <View key={`story-${index}`}>
                <TouchableOpacity style={{ width: 200 }}>
                  <Text
                    style={styles.textTitle}
                    onPress={() => handleNavigation(story)}>
                    {story.title}{" "}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text onPress={() => handleDelete(story)}>Delete</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#fff",
    fontSize: 40,
  },

  scrollContainer: {
    alignSelf: "center",
    flex: 1,
  },

  userDetails: {
    alignItems: "center",
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
    fontWeight: "bold",
    color: "#8F5AFF",
    padding: 30,
  },
  textHeader: {
    marginTop: 50,
    fontSize: 50,
  },
  textTitle: {
    marginTop: 20,
    fontSize: 30,
    borderColor: "#8F5AFF",
    borderWidth: 1,
  },
});
