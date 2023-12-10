import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Linking,
} from "react-native";
import ImageView from "react-native-image-viewing";
import { Feather } from "@expo/vector-icons"; // Import the Feather icon set from react-native-vector-icons

const ChatBubble = ({ message, isMyMessage, searchQuery }) => {
  const bubbleStyle = isMyMessage ? styles.myMessage : styles.otherMessage;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");
  const renderMessageContent = () => {
    if (message.text) {
      return renderSearchHighlight(message.text);
    } else if (message.image) {
      return (
        <View style={{ borderRadius: 15, padding: 2 }}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setSeletedImageView(message.image);
            }}
          >
            <Image
              resizeMode="contain"
              style={{
                width: 200,
                height: 200,
                padding: 6,
                borderRadius: 15,
                resizeMode: "cover",
              }}
              source={{ uri: message.image }}
            />
            {selectedImageView ? (
              <ImageView
                imageIndex={0}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                images={[{ uri: selectedImageView }]}
              />
            ) : null}
          </TouchableOpacity>
        </View>
      );
    } else if (message.documentURL) {
      return (
        <TouchableOpacity
          onPress={() => {
            // Use Linking to open the document URL
            Linking.openURL(message.documentURL);
          }}
          style={styles.documentButton}
        >
          <Feather
            name="download"
            size={20}
            color="black"
            style={styles.icon}
          />
          <Text style={styles.documentText}>Download Document</Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  const getMessageTypeIndicator = () => {
    if (message.text) {
      return null; // Text message has no indicator
    } else if (message.image) {
      return <Feather name="image" size={20} color="#4CAF50" />;
    } else if (message.documentURL) {
      return <Feather name="file-text" size={20} color="#4CAF50" />;
    }
    return null;
  };

  const renderSearchHighlight = (text) => {
    if (searchQuery && text.toLowerCase().includes(searchQuery.toLowerCase())) {
      const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
      return (
        <Text>
          {parts.map((part, index) => (
            <Text
              key={index}
              style={
                part.toLowerCase() === searchQuery.toLowerCase()
                  ? { backgroundColor: "#FFFF00" } // Highlight the search term
                  : {}
              }
            >
              {part}
            </Text>
          ))}
        </Text>
      );
    }
    return <Text>{text}</Text>;
  };

  return (
    <View style={[styles.container, bubbleStyle]}>
      <View style={styles.messageTypeIndicator}>
        {getMessageTypeIndicator()}
      </View>

      {renderMessageContent()}
      <Text style={styles.timestamp}>
        {formatMessageTime(message.createdAt)}
      </Text>
    </View>
  );
};

const formatMessageTime = (time) => {
  const messageDate = new Date(time);
  const currentDate = new Date();

  const sameYear = messageDate.getFullYear() === currentDate.getFullYear();
  const sameMonth = messageDate.getMonth() === currentDate.getMonth();
  const sameDay = messageDate.getDate() === currentDate.getDate();

  if (sameYear && sameMonth && sameDay) {
    return `${messageDate.getHours()}:${String(
      messageDate.getMinutes()
    ).padStart(2, "0")}`;
  } else {
    return `${messageDate.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
    })} ${messageDate.getHours()}:${String(messageDate.getMinutes()).padStart(
      2,
      "0"
    )}`;
  }
};

const styles = StyleSheet.create({
  container: {
    maxWidth: "80%",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 4,
    position: "relative",
  },
  myMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  otherMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA",
  },
  messageText: {
    fontSize: 16,
    color: "black",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    resizeMode: "cover",
  },
  timestamp: {
    fontSize: 12,
    color: "gray",
    marginTop: 4,
    textAlign: "right",
  },
  documentButton: {
    padding: 10,
    borderRadius: 10,
    maxWidth: 250,
    flexDirection: "row",
    alignItems: "center",
  },
  documentText: {
    color: "black",
    marginLeft: 5,
  },
  icon: {
    paddingRight: 5,
  },
  messageTypeIndicator: {
    position: "absolute",
    bottom: 5,
    left: 5,
  },
});
export default ChatBubble;
