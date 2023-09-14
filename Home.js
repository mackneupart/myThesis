import { Button, StyleSheet, Text, View, Image } from "react-native";
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

export default function Home({ navigation }) {
  const [loaded] = useFonts({
    "FiraCode-Regular": require("./assets/fonts/FiraCode-Regular.ttf"),
    "FiraCode-Bold": require("./assets/fonts/FiraCode-Bold.ttf"),
    "FiraCode-SemiBold": require("./assets/fonts/FiraCode-SemiBold.ttf"),
    "KaiseiTokumin-Regular": require("./assets/fonts/KaiseiTokumin-Regular.ttf"),
    "KaiseiTokumin-Bold": require("./assets/fonts/KaiseiTokumin-Bold.ttf"),
  });

  if (!loaded) {
    return <AppLoading />; // Render loading UI or a placeholder
  }
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
          style={{ width: 300, height: 300 }} // Set the desired width and height
        />
      </View>
      <View>
        <Text style={styles.textViews}>
          Check out the map without logging in
          <Button
            style={styles.textViews}
            title="hrere"
            onPress={() => navigation.navigate("Profile")}
          />
        </Text>
      </View>
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
});
