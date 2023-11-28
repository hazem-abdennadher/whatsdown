import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useGlobalContext } from "../context/context-wrapper";
import { useNavigation } from "@react-navigation/native";
export default function ContactsFloatingIcon() {
  const {
    theme: { colors },
  } = useGlobalContext();
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("Contacts")}
      style={{
        position: "absolute",
        right: 20,
        bottom: 20,
        borderRadius: 60,
        width: 60,
        height: 60,
        backgroundColor: colors.foreground,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MaterialCommunityIcons
        name="android-messages"
        size={30}
        color={"white"}
        style={{
          transform: [{ scaleX: -1 }],
        }}
      />
    </TouchableOpacity>
  );
}
