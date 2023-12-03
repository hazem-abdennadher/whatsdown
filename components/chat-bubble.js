import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import ImageView from "react-native-image-viewing";

const ChatBubble = ({ message, isMyMessage }) => {
  const bubbleStyle = isMyMessage ? styles.myMessage : styles.otherMessage;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageView, setSeletedImageView] = useState("");

  const renderMessageContent = () => {
    if (message.text) {
      return <Text style={styles.messageText}>{message.text}</Text>;
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
    }
    return null;
  };

  return (
    <View style={[styles.container, bubbleStyle]}>
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
});

export default ChatBubble;
