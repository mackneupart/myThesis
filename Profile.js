import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { getUser, getUserDetails } from "./src/config/Database";
import { useEffect, useState } from "react";

export default function About() {
  const [user, setUser] = useState({ username: "", email: "" });
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      const user = await getUserDetails();
      setUsername(user.username);
      setEmail(user.email);
    };
    fetchUserDetails();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Profil! {username}</Text>
      <Text style={styles.textHeader}>Profil! {email}</Text>
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
