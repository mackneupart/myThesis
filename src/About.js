import { Marker } from "react-native-maps";
import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function About({ route }) {
  const { marker } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.textHeader}>{marker.name}!</Text>
      <ScrollView>
        <Text style={styles.textViews}>{marker.description}</Text>
      </ScrollView>
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
