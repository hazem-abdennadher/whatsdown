import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useAssets } from "expo-asset";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./screens/sign-in";
import ContextWrapper, { useGlobalContext } from "./context/context-wrapper";
import Profile from "./screens/profile";
import Home from "./screens/home";
import Contacts from "./screens/contacts";
import Chat from "./screens/chat";
import ChatHeader from "./components/chat-header";
import ChatScreen from "./screens/chat-screen";

const stack = createStackNavigator();
function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {
    theme: { colors },
  } = useGlobalContext();
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        setCurrentUser(user);
      }
    });
    return () => unsubscribe();
  }, []);
  if (loading) return <Text>Loading...</Text>;
  return (
    <NavigationContainer>
      {!currentUser ? (
        <stack.Navigator
          screenOptions={{
            headerShown: false,
          }}
        >
          <stack.Screen name="SignIn" component={SignIn} />
        </stack.Navigator>
      ) : (
        <stack.Navigator
          screenOptions={{
            headerShown: true,
          }}
        >
          {!currentUser.displayName && (
            <stack.Screen
              name="Profile"
              options={{
                headerStyle: {
                  backgroundColor: colors.foreground,
                  shadowOpacity: 0,
                  elevation: 0,
                },
                headerTintColor: colors.white,
                headerShown: true,
              }}
              component={Profile}
            />
          )}
          <stack.Screen
            name="Home"
            options={{
              title: "Whatsdown",
              headerStyle: {
                backgroundColor: colors.foreground,
                shadowOpacity: 0,
                elevation: 0,
              },
              headerTintColor: colors.white,
              headerShown: true,
            }}
            component={Home}
          />
          <stack.Screen
            name="Contacts"
            options={{
              title: "Select Contact",
              headerStyle: {
                backgroundColor: colors.foreground,
                shadowOpacity: 0,
                elevation: 0,
              },
              headerTintColor: colors.white,
              headerShown: true,
            }}
            component={Contacts}
          />
          <stack.Screen
            name="chat"
            options={{
              headerShown: false,
            }}
            component={ChatScreen}
          />
        </stack.Navigator>
      )}
    </NavigationContainer>
  );
}

function Main() {
  const [assets] = useAssets([
    require("./assets/chatbg.png"),
    require("./assets/welcome-img.png"),
    require("./assets/user-icon.png"),
  ]);
  if (!assets) {
    return <Text>Loading....</Text>;
  }
  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
}
export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
