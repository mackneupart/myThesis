import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";

export default function CustomTabBarButton({ children, onPress }) {
  return (
    <TouchableOpacity
      style={{
        top: -30,
        justifyContent: "center",
        alignItems: "center",
        ...style.shadow,
      }}
      onPress={onPress}>
      <View
        style={{
          width: 60,
          height: 60,
          borderRadius: 35,
          backgroundColor: "white",
        }}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

const style = StyleSheet.create({
  shadow: {
    shadowColor: "darkgrey",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
