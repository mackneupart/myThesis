import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Map from "../pages/Map";
import Profile from "../pages/Profile";
import Feed from "../pages/Feed";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import Info from "../pages/Info";

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
        name="Feed"
        component={Feed}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", marginTop: 25 }}>
              <Image
                source={require("../assets/icons/story.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#8F5AFF" : "grey",
                }}
              />
              <Text
                style={{ color: focused ? "#8F5AFF" : "grey", fontSize: 14 }}>
                FEED
              </Text>
            </View>
          ),
        }}
      />
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
                style={{ color: focused ? "#8F5AFF" : "grey", fontSize: 14 }}>
                MAP
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={Info}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", marginTop: 25 }}>
              <Image
                source={require("../assets/icons/info.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#8F5AFF" : "grey",
                }}
              />
              <Text
                style={{ color: focused ? "#8F5AFF" : "grey", fontSize: 14 }}>
                INFO
              </Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: "center", marginTop: 25 }}>
              <Image
                source={require("../assets/icons/profile.png")}
                resizeMode="contain"
                style={{
                  width: 30,
                  height: 30,
                  tintColor: focused ? "#8F5AFF" : "grey",
                }}
              />
              <Text
                style={{ color: focused ? "#8F5AFF" : "grey", fontSize: 14 }}>
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
