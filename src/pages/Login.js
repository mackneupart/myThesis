import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";
import { useEffect, useState } from "react";
import CustomButton from "../components/customButton";
import { signInUser, getUser } from "../config/Database";

export default function Login({ handleUserLogin, navigation }) {
  const [loaded] = useFonts({
    "FiraCode-Regular": require("../assets/fonts/FiraCode-Regular.ttf"),
    "FiraCode-Bold": require("../assets/fonts/FiraCode-Bold.ttf"),
    "FiraCode-SemiBold": require("../assets/fonts/FiraCode-SemiBold.ttf"),
    "KaiseiTokumin-Regular": require("../assets/fonts/KaiseiTokumin-Regular.ttf"),
    "KaiseiTokumin-Bold": require("../assets/fonts/KaiseiTokumin-Bold.ttf"),
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUser = () => {
      const email = getUser();
      if (email) {
        setEmail(email);
      }
    };
    fetchUser();
  }, []);

  if (!loaded) {
    return <AppLoading />; // Render loading UI or a placeholder
  }

  const handleLogin = async () => {
    try {
      const success = await signInUser(email, password);
      if (success) {
        console.log("user is signed in");
        // setIsLoggedIn(true);
        handleUserLogin();
        // navigation.navigate("Profile");
      } else {
        console.log("user is not signed in");
        // setIsLoggedIn(false);
      }
    } catch (error) {
      console.log("login error: " + error);
    }
    setEmail("");
    setPassword("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Queer{"\n"} Annotations</Text>
      <Text style={styles.textViews}>
        A digital archive of queer stories {"\n"} made for and created by fellow
        queers
      </Text>
      {/* <View>
        <Image
          source={require("./assets/icons/cph-map.png")} // Replace with the actual image path
          style={{ width: 200, height: 200 }} // Set the desired width and height
        />
      </View> */}

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

      <View>
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
      {/* )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
    alignItems: "center",
    justifyContent: "center",
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
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 10,
    width: 200,
    marginBottom: 15,
    fontSize: 16,
  },
  signup: {
    marginTop: 20,
    fontFamily: "KaiseiTokumin-Regular",
    textAlign: "center",
    marginBottom: 200,
  },
});
