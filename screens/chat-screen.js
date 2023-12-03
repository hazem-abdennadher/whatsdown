import React, { useCallback, useContext, useEffect, useState } from "react";

import "react-native-get-random-values";

import { nanoid } from "nanoid";
import { View, FlatList, StyleSheet } from "react-native";
import ChatBubble from "../components/chat-bubble"; // Import your custom ChatBubble component
import ChatInput from "../components/chat-input"; // Import your custom ChatInput component
import { useRoute } from "@react-navigation/native";

import { auth, db } from "../firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "@firebase/firestore";

import { pickImage, uploadImage } from "../utils";
import ImageView from "react-native-image-viewing";
import { useGlobalContext } from "../context/context-wrapper";

const randomId = nanoid();

const ChatScreen = () => {
  const {
    theme: { colors },
  } = useGlobalContext();
  const [roomHash, setRoomHash] = useState("");
  const [messages, setMessages] = useState([]);

  const { currentUser } = auth;
  const route = useRoute();
  const room = route.params.room;
  const selectedImage = route.params.image;
  const userB = route.params.user;

  const senderUser = currentUser.photoURL
    ? {
        name: currentUser.displayName,
        _id: currentUser.uid,
        avatar: currentUser.photoURL,
      }
    : { name: currentUser.displayName, _id: currentUser.uid };

  const roomId = room ? room.id : randomId;

  const roomRef = doc(db, "rooms", roomId);
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");

  useEffect(() => {
    (async () => {
      if (!room) {
        const currUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email,
        };
        if (currentUser.photoURL) {
          currUserData.photoURL = currentUser.photoURL;
        }
        const userBData = {
          displayName: userB.contactName || userB.displayName || "",
          email: userB.email,
        };
        if (userB.photoURL) {
          userBData.photoURL = userB.photoURL;
        }
        const roomData = {
          participants: [currUserData, userBData],
          participantsArray: [currentUser.email, userB.email],
        };
        try {
          await setDoc(roomRef, roomData);
        } catch (error) {
          console.log(error);
        }
      }
      const emailHash = `${currentUser.email}:${userB.email}`;
      setRoomHash(emailHash);
      if (selectedImage) {
        await sendImage(selectedImage, emailHash);
      }
    })();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(roomMessagesRef, (querySnapshot) => {
      const messagesFirestore = querySnapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      appendMessages(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) => [...messages, ...previousMessages]);
    },
    [messages]
  );

  async function onSend(messages = []) {
    const writes = messages.map((m) => addDoc(roomMessagesRef, m));
    const lastMessage = messages[messages.length - 1];
    writes.push(updateDoc(roomRef, { lastMessage }));
    await Promise.all(writes);
  }

  async function sendImage(uri, roomPath) {
    const { url, fileName } = await uploadImage(
      uri,
      `images/rooms/${roomPath || roomHash}`
    );
    const message = {
      _id: fileName,
      text: "",
      createdAt: new Date(),
      user: senderUser,
      image: url,
    };
    const lastMessage = { ...message, text: "Image" };
    await Promise.all([
      addDoc(roomMessagesRef, message),
      updateDoc(roomRef, { lastMessage }),
    ]);
  }

  async function handlePhotoPicker() {
    const result = await pickImage();
    if (!result.cancelled) {
      await sendImage(result.uri);
    }
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ChatBubble
            message={item}
            isMyMessage={item.user._id === currentUser.uid}
          />
        )}
        inverted // To display messages from bottom to top
      />
      <ChatInput
        onSend={onSend}
        userId={currentUser.uid}
        handlePhotoPicker={handlePhotoPicker}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end", // To keep the chat input at the bottom
  },
});

export default ChatScreen;
