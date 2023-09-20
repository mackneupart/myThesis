import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "../Map";
import Profile from "../Profile";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import CustomTabBarButton from "./CustomTabBarButton";
import PopUpAdd from "./PopUpAdd";

const Tab = createBottomTabNavigator();

export default function NavigationTab({ handleUserLogout }) {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "lightgrey",
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          borderRadius: 10,
          height: 90,
          ...style.shadow,
        },
      }}>
      <Tab.Screen
        name="Map"
        component={Map}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", marginTop: 25 }}>
              <Image
                source={require("../assets/icons/map.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#8F5AFF" : "grey",
                }}
              />
              <Text
                style={{ color: focused ? "#8F5AFF" : "grey", fontSize: 18 }}>
                MAP
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={Map}
        options={{
          headerShown: false,

          tabBarIcon: ({ focused }) => (
            <Image
              source={require("../assets/icons/plus.png")}
              resizeMode="contain"
              style={{
                width: 60,
                height: 60,
                tintColor: "#8F5AFF",
              }}
            />
          ),
          tabBarButton: () => <PopUpAdd />, // You were missing parentheses here
        }}
      />

      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", marginTop: 25 }}>
              <Image
                source={require("../assets/icons/user.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#8F5AFF" : "grey",
                }}
              />
              <Text
                style={{ color: focused ? "#8F5AFF" : "grey", fontSize: 18 }}>
                PROFILE
              </Text>
            </View>
          ),
        }}>
        {(props) => <Profile {...props} handleUserLogout={handleUserLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
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
