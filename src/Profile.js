import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import {
  getUser,
  getUserDetails,
  signOutUser,
  getStoriesForUser,
} from "./config/Database";
import { useEffect, useState } from "react";
import CustomButton from "./components/customButton";

export default function Profile({ handleUserLogout }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [stories, setUserStories] = useState([]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      setUsername(user.username);
      setEmail(user.email);
    };

    const fetchUserStories = async () => {
      const userStories = await getStoriesForUser();
      setUserStories(userStories);
      console.log(userStories);
    };
    fetchUserDetails();
    fetchUserStories();
  }, []);

  const handleLogout = () => {
    try {
      signOutUser();
      handleUserLogout();
    } catch (error) {
      console.log("logout error: " + error);
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
      <ScrollView style={styles.scrollContainer}>
        <Text style={styles.textHeader}>Contributions</Text>
        <View>
          {stories.map((story) => (
            <>
              <Text style={styles.textViews}>{story.title}</Text>
              <Text style={styles}>
                {story.description}, {story.coordinates[0]}
                {"\n"}
                {story.coordinates[1]}
              </Text>
            </>
          ))}
        </View>
      </ScrollView>
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
  textViews: {
    marginTop: 20,
    fontSize: 30,
  },
});
