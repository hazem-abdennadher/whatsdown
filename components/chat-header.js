import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import Avatar from "./avatar";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../context/context-wrapper";
import Constants from "expo-constants";
import { Feather } from "@expo/vector-icons"; // Import Feather icon set from react-native-vector-icons

export default function ChatHeader({ setSearchQuery, searchQuery }) {
  const route = useRoute();
  const navigation = useNavigation();
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const {
    theme: { colors },
  } = useGlobalContext();

  const handleBackPress = () => {
    navigation.goBack(); // Navigate back when the back button is pressed
  };
  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible); // Toggle search input visibility
  };

  const handleSearchInputChange = (text) => {
    setSearchQuery(text); // Handle search query changes
    // Implement logic to filter messages based on searchQuery
    // Pass the searchQuery to the ChatBubble component to highlight or filter messages
  };
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: colors.foreground,
        shadowOpacity: 0,
        elevation: 0,
        paddingHorizontal: 10,
        paddingVertical: 20,
        justifyContent: "space-between",
        paddingTop: Constants.statusBarHeight + 20,
        position: "relative",
      }}
    >
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="chevron-left" size={30} color={colors.white} />
        </TouchableOpacity>

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
      <TouchableOpacity onPress={toggleSearch}>
        {/* Search Icon */}
        <Feather name="search" size={24} color={colors.white} />
      </TouchableOpacity>

      {isSearchVisible && (
        <View
          style={{
            position: "absolute",
            top: Constants.statusBarHeight + 20,
            right: 0,
            left: 0,
            zIndex: 1,
            backgroundColor: colors.foreground,
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          <TouchableOpacity onPress={toggleSearch}>
            {/* Close Icon */}
            <Feather name="x" size={24} color={colors.white} />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: colors.white,
              borderRadius: 5,
              flex: 1,
              marginLeft: 10,
              padding: 5,
            }}
          >
            <TextInput
              style={{
                backgroundColor: colors.white,
              }}
              placeholder="Search messages"
              value={searchQuery}
              onChangeText={handleSearchInputChange}
            />
          </View>
        </View>
      )}
    </View>
  );
}
