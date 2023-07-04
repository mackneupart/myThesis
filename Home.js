import { Alert, Button, StyleSheet, Text, View } from "react-native";

export default function Home({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>Home Screen!</Text>
      <Text style={styles.textViews}>Text for testing</Text>
      <View>
        <Button
          title="Go to see map"
          onPress={() => navigation.navigate("Profile")}
        />
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
    marginTop: 20,
    fontSize: 30,
    color: "blue",
  },
});
