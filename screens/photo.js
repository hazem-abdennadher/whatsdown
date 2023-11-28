import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { pickImage } from "../utils";

export default function Photo() {
  const navigation = useNavigation();
  const [canceled, setCanceled] = useState(false);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async (e) => {
      const result = await pickImage();
      navigation.navigate("Contacts", { image: result.assets[0].uri });
      if (
        result.canceled ||
        !result.assets.length ||
        !result.assets[0].uri ||
        !result.assets[0].width ||
        !result.assets[0].height
      ) {
        setCanceled(true);
        setTimeout(() => {
          navigation.navigate("chats");
        }, 100);
      }
    });
    return () => unsubscribe();
  }, [navigation, canceled]);
  return <View />;
}
