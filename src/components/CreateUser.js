import { Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export default function CreateUser() {
  const [user, setUser] = useState({ username: "", email: "", password: "" });

  function addUser() {
    const userDb = collection(db, "users");
    addDoc(userDb, {
      username: user.username,
      email: user.email,
      password: user.password,
    });
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="username"
        value={user.username}
        onChangeText={(text) => setUser({ ...user, username: text })}
      />

      <Pressable onPress={addUser}>
        <Text>Create user</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
  },
});
