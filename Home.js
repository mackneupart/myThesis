import { Button, StyleSheet, Text, View, Image, TextInput } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { useState } from "react";
import CustomButton from "./src/components/customButton";

export default function Home({ navigation }) {
  const [loaded] = useFonts({
    "FiraCode-Regular": require("./assets/fonts/FiraCode-Regular.ttf"),
    "FiraCode-Bold": require("./assets/fonts/FiraCode-Bold.ttf"),
    "FiraCode-SemiBold": require("./assets/fonts/FiraCode-SemiBold.ttf"),
    "KaiseiTokumin-Regular": require("./assets/fonts/KaiseiTokumin-Regular.ttf"),
    "KaiseiTokumin-Bold": require("./assets/fonts/KaiseiTokumin-Bold.ttf"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!loaded) {
    return <AppLoading />; // Render loading UI or a placeholder
  }

  const handleLogin = () => {
    // Here, you can implement your login logic
    // Typically, you would send the email and password to your server for authentication.
    // For this example, we'll just print them to the console.
    console.log("Email:", email);
    console.log("Password:", password);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Queer{"\n"} Fortællinger</Text>
      <Text style={styles.textViews}>
        A digital archive of queer stories {"\n"} made for and created by fellow
        queers
      </Text>
      <View>
        <Image
          source={require("./assets/icons/cph-map.png")} // Replace with the actual image path
          style={{ width: 200, height: 200 }} // Set the desired width and height
        />
      </View>
      <View>
        <Text style={styles.textViews}>
          Check out the map without logging in{" "}
          <Text
            style={{ textDecorationLine: "underline" }}
            onPress={() => navigation.navigate("Map")}>
            here
          </Text>
        </Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true} // To hide the entered text
        onChangeText={(text) => setPassword(text)}
        value={password}
      />

      <CustomButton
        text="Login"
        onPress={handleLogin}
        textColor="white"
        bgColor={"#8F5AFF"}
      />
      <Text style={styles.signup}>
        Dont have an account?{"\n"}
        <Text
          style={{ textDecorationLine: "underline" }}
          onPress={() => navigation.navigate("SignUp")}>
          sign up here
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    fontSize: 30,
  },
  textHeader: {
    fontFamily: "FiraCode-Bold",
    marginTop: 40,
    fontSize: 40,
    fontWeight: "bold",
    textAlign: "center",
    color: "#8F5AFF",
  },
  textViews: {
    fontFamily: "KaiseiTokumin-Regular",
    textAlign: "center",
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
  signup: {
    marginTop: 20,
    fontFamily: "KaiseiTokumin-Regular",
    textAlign: "center",
  },
});
