import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function Info() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBox}>
        <Text style={styles.logoText}>Queer Annotations</Text>
      </View>
      <ScrollView>
        <Text style={styles.textViews}>
          Queer Annotations is a mobile application developed by Mack Neupart as
          a thesis project for the master programme in Software Design.
          {"\n"}
          {"\n"}
          Queer annotations is a user-generated platform meaning users are
          essential for the platform to work as intended. Users are able to
          write or audio-record stories, memories or anecdotes which depict any
          aspect of queer-life, the annotations will furthermore be required to
          be associated with a specific location.
          {"\n"}
          {"\n"}
          Both users and non-logged in users can see the map and open the
          stories at their exact location. This feature is meant for the content
          to be experienced at the location they are associated with - to
          investigate the understanding and creation of places.
        </Text>
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
  logoBox: {
    marginTop: 60,
    backgroundColor: "lightgrey",
    height: 110,
    width: 320,
    borderRadius: 10,
  },
  logoText: {
    position: "absolute",
    marginTop: 10,
    fontFamily: "FiraCode-Bold",
    fontSize: 25,
    fontWeight: "bold",
    color: "#8F5AFF",
    padding: 30,
  },
  textHeader: {
    marginTop: 20,
    fontSize: 50,
  },
  textViews: {
    marginTop: 20,
    fontSize: 20,
    fontFamily: "KaiseiTokumin-Regular",
    padding: 20,
    backgroundColor: "lightgrey",
    marginRight: 30,
    marginLeft: 30,
    marginBottom: 130,
  },
});
