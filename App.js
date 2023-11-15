import { StyleSheet, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Login from "./src/pages/Login";
import Map from "./src/pages/Map";
import SignUp from "./src/pages/SignUp";
import NavigationTab from "./src/components/NavigationTab"; // Import the NavigationTab component
import { getUser } from "./src/config/Database";
import { useEffect, useState } from "react";
import Story from "./src/pages/Story";
import CameraComponent from "./src/components/CameraComponent";
import AddLocationMap from "./src/components/AddLocationMap";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      console.log("user: " + user);
      if (user !== undefined) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false); // Set loading state to false once user data is fetched
    };
    fetchUser();
  }, []);

  const handleUserLogin = () => {
    setIsLoggedIn(true);
  };

  const handleUserLogout = () => {
    setIsLoggedIn(false);
    console.log("handleLogout was called");
  };

  if (isLoading) {
    // Show loading indicator or placeholder while fetching user data
    return <ActivityIndicator />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="navigation" options={{ headerShown: false }}>
              {(props) => (
                <NavigationTab {...props} handleUserLogout={handleUserLogout} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Story"
              component={Story}
              options={{ title: "Story" }}
            />
            <Stack.Screen
              name="Map"
              component={Map}
              options={{ title: "Map", headerShown: false }}
            />
            <Stack.Screen
              name="CameraComponent"
              component={CameraComponent}
              options={{ title: "CameraComponent" }}
            />
            <Stack.Screen
              name="AddLocationMap"
              component={AddLocationMap}
              options={{ title: "AddLocationMap" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" options={{ headerShown: false }}>
              {(props) => (
                <Login {...props} handleUserLogin={handleUserLogin} />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Map"
              component={Map}
              options={{ title: "Map", headerShown: true }}
              headerShown={false}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUp}
              options={{ title: "SignUp", headerShown: false }}
              headerShown={false}
            />
            <Stack.Screen
              name="Story"
              component={Story}
              options={{ title: "Story" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    marginTop: 20,
    fontSize: 30,
  },
  textHeader: {
    marginTop: 20,
    fontSize: 30,
    color: "blue",
  },
});
