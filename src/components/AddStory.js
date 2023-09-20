import { View, Text, StyleSheet } from "react-native";

export default function AddStory() {
  return (
    <View style={styles.container}>
      <Text>AddStory</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center", // Center the modal vertically
    alignItems: "flex-end", // Center the modal horizontally
  },
});
