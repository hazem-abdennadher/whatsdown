import { View, Text } from "react-native";
import React from "react";
import Avatar from "./avatar";
import { useRoute } from "@react-navigation/native";
import { useGlobalContext } from "../context/context-wrapper";

export default function ChatHeader() {
  const route = useRoute();
  const {
    theme: { colors },
  } = useGlobalContext();
  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      <Avatar size={30} user={route.params.user} />
      <View
        style={{
          marginLeft: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: colors.white,
          }}
        >
          {route.params.user.contactName || route.params.user.displayName}
        </Text>
      </View>
    </View>
  );
}
