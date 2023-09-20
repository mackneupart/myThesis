import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import CustomButton from "./components/customButton";
import { registerUser } from "./config/Database";

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repPassword, setRepPassword] = useState("");

  const handleSignUp = async () => {
    console.log(email);
    console.log(password);
    // Implement your sign-up logic here.
    // You can send the user's data (username, email, password) to your server for registration.
    try {
      const success = await registerUser(email, password, username);
      if (success) {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.brandContainer}>
        <Text style={styles.brand}>Queer{"\n"}Fortællinger</Text>
      </View>
      <Text style={styles.textHeader}>Register now!</Text>
      <Text style={styles.textViews}>
        Read and discover stories of queers {"\n"}and contribute with your
        experiences
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your username"
        onChangeText={(text) => setUsername(text)}
        value={username}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        onChangeText={(text) => setRepPassword(text)}
        value={password}
      />

      <CustomButton
        text="Create account"
        onPress={handleSignUp}
        textColor="white"
        bgColor={"#8F5AFF"}
      />
      <Text style={styles.signup}>
        Already have an account?{"\n"}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => navigation.navigate("Login")}>
          Login
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: 50,
  },
  textHeader: {
    fontFamily: "KaiseiTokumin-Bold",
    textAlign: "center",
    fontSize: 30,
    marginBottom: 10,
  },
  textViews: {
    fontFamily: "KaiseiTokumin-Regular",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 15,
    padding: 10,
    width: "80%",
    marginBottom: 15,
    fontSize: 16,
  },
  brandContainer: {
    alignSelf: "flex-start", // Align to the left
    backgroundColor: "#D9D9D9", // Grey background color
    borderRadius: 999, // A large value to create an oval shape
    padding: 30,
    marginBottom: 50,
    width: 300,
  },
  brand: {
    color: "#8F5AFF", // Purple text color
    fontSize: 30,
    fontFamily: "FiraCode-Regular",
  },
});
