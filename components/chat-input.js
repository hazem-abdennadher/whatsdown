import React, { useEffect, useState } from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import Ionicons from your package
import { useGlobalContext } from "../context/context-wrapper";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import * as DocumentPicker from "expo-document-picker";
import { uploadDocument } from "../utils";

const ChatInput = ({
  onSend,
  userId,
  handlePhotoPicker,
  setIsWriting,
  handleDocumentPicker,
}) => {
  const [messageText, setMessageText] = useState("");
  const {
    theme: { colors },
  } = useGlobalContext();

  const handleSend = async () => {
    if (messageText.trim() !== "" && onSend) {
      const message = {
        text: messageText.trim(),
        createdAt: new Date(), // Add timestamp to the message
        _id: nanoid(),
        user: {
          _id: userId, // User ID from Firebase
        },
        // Add any other necessary properties like sender info, _id, etc.
      };

      try {
        await onSend([message]); // Send the message using the provided onSend function
        setMessageText(""); // Clear input after sending
      } catch (error) {
        console.error("Error sending message:", error);
        // Handle error if needed
      }
    }
  };

  useEffect(() => {
    if (messageText.length > 0) {
      setIsWriting(true);
    } else {
      setIsWriting(false);
    }
  }, [messageText]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={{
          ...styles.sendButton,
          backgroundColor: colors.primary,
          marginRight: 8,
        }}
        onPress={handleDocumentPicker}
      >
        <Ionicons name="document" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ ...styles.sendButton, backgroundColor: colors.primary }}
        onPress={handlePhotoPicker}
      >
        <Ionicons name="camera" size={24} color="white" />
      </TouchableOpacity>
      <TextInput
        placeholder="Type a message..."
        value={messageText}
        onChangeText={(text) => setMessageText(text)}
        style={styles.input}
        multiline
      />
      <TouchableOpacity
        style={{ ...styles.sendButton, backgroundColor: colors.primary }}
        onPress={handleSend}
      >
        <Ionicons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginHorizontal: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,

    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatInput;
