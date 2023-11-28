import { Text } from "react-native";
import { useGlobalContext } from "../context/context-wrapper";
import Chat from "./chat";
import Photo from "./photo";
import { Ionicons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Chats from "./chats";
const Tab = createMaterialTopTabNavigator();

export default function Home() {
  const {
    theme: { colors },
  } = useGlobalContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        return {
          tabBarLabel: () => {
            if (route.name === "photo") {
              return <Ionicons name="camera" size={20} color={colors.white} />;
            }
            return (
              <Text style={{ color: colors.white }}>
                {route.name.toUpperCase()}
              </Text>
            );
          },
          tabBarShowIcon: true,
          tabBarLabelStyle: {
            color: colors.white,
          },
          tabBarStyle: {
            backgroundColor: colors.foreground,
          },
          tabBarIndicatorStyle: {
            backgroundColor: colors.white,
          },
        };
      }}
      initialRouteName="chats"
    >
      <Tab.Screen name="photo" component={Photo} />
      <Tab.Screen name="chats" component={Chats} />
    </Tab.Navigator>
  );
}
