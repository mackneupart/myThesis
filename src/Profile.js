import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
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
import ConfirmationModal from "./components/ConfirmationModal"; // Import the ConfirmationModal component

export default function Profile({ handleUserLogout, navigation }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [stories, setUserStories] = useState([]);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

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

  const handleDelete = (story) => {
    setSelectedStory(story);
    setIsModalVisible(true);
  };
  const handleConfirmDelete = async () => {
    try {
      if (selectedStory) {
        await deleteStory(selectedStory.storyID);
        const userStories = await getStoriesForUser();
        setUserStories(userStories);
      }
    } catch (error) {
      console.log("Error deleting story: " + error);
    } finally {
      setIsModalVisible(false); // Close the modal
    }
  };
  const handleCancelDelete = () => {
    setSelectedStory(null); // Clear the selected story
    setIsModalVisible(false); // Close the modal
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Annotations</Text>
      </View>

      <View style={styles.userDetails}>
        <Text style={styles.textHeader}>Hi, {username}!</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require("./assets/icons/profile.png")}
            style={styles.profileImage}
          />
        </View>

        <Text style={styles.textViews}>Your email: {email}</Text>
        <CustomButton
          text="Logout"
          onPress={handleLogout}
          textColor="white"
          bgColor={"#8F5AFF"}
          style={styles.customButton} // Add a customButton style here
        />
      </View>
      <View style={styles.scrollContainer}>
        <Text style={styles.textHeader}>Contributions</Text>
        <View>
          {stories.map((story, index) => (
            <TouchableOpacity
              key={`story-${index}`}
              onPress={() => handleNavigation(story)}>
              <View style={styles.storyContainer}>
                <Text style={styles.textTitle}>{story.title} </Text>
                <TouchableOpacity
                  onPress={() => handleDelete(story)}
                  style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ConfirmationModal
        visible={isModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        text="Are you sure you want to delete this story?"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "whitesmoke",
    fontSize: 40,
    marginBottom: 120,
  },

  scrollContainer: {
    // alignSelf: "center",
    // flex: 1,
  },
  imageContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "lightgrey",
    marginBottom: 10,
  },
  profileImage: { width: 100, height: 100 },

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
    marginTop: 40,
    fontSize: 30,
    marginBottom: 10,
    alignSelf: "center",
  },
  textTitle: {
    marginTop: 20,
    fontSize: 20,
  },
  storyContainer: {
    flexDirection: "row",
    alignSelf: "center",
    justifyContent: "space-between",
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
  deleteButton: {
    alignSelf: "center",
    backgroundColor: "lightgrey",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#8F5AFF",
  },
  customButton: {
    fontSize: 100,
    padding: 10,
    borderRadius: 10,
    minWidth: 90,
    marginTop: 10,
  },
});
