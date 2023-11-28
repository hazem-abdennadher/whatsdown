// @refresh reset
import { View, Text, ImageBackground } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { useRoute } from "@react-navigation/native";
import "react-native-get-random-values";
import { nanoid } from "nanoid";
import { useGlobalContext } from "../context/context-wrapper";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { GiftedChat } from "react-native-gifted-chat";
const randomId = nanoid();
export default function Chat() {
  const {
    theme: { colors },
  } = useGlobalContext();
  const [roomHash, setRoomHash] = useState("");
  const [messages, setMessages] = useState([]);
  const { currentUser } = auth;
  const route = useRoute();
  const room = route.params && route.params.room;
  const selectedImage = route.params && route.params.image;
  const userB = route.params && route.params.user;

  const SenderUser = currentUser.photoURL
    ? {
        _id: currentUser.uid,
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      }
    : {
        _id: currentUser.uid,
        name: currentUser.displayName,
      };

  const roomId = room ? room.id : randomId;
  const roomRef = doc(db, "rooms", roomId);
  const roomMessagesRef = collection(db, "rooms", roomId, "messages");

  useEffect(() => {
    (async () => {
      console.log("room", room);
      if (!room) {
        const currentUserData = {
          displayName: currentUser.displayName,
          email: currentUser.email,
        };
        if (currentUser.photoURL) {
          currentUserData.photoURL = currentUser.photoURL;
        }
        const userBData = {
          displayName: userB.contactName || userB.displayName || "unknown",
          email: userB.email,
        };
        if (userB.photoURL) {
          userBData.photoURL = userB.photoURL;
        }
        const roomData = {
          participants: [currentUserData, userBData],
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
    })();
  }, []);
  useEffect(() => {
    const unsubscribe = onSnapshot(roomMessagesRef, (snapshot) => {
      const messagesFirestore = snapshot
        .docChanges()
        .filter(({ type }) => type === "added")
        .map(({ doc }) => {
          const message = doc.data();
          return { ...message, createdAt: message.createdAt.toDate() };
        });
      appendMessage(messagesFirestore);
    });
    return () => unsubscribe();
  }, []);

  const appendMessage = useCallback(
    (messages) => {
      setMessages((previousMessages) =>
        GiftedChat.append(previousMessages, messages)
      );
    },
    [messages]
  );

  const onSend = (messages = []) => {
    const writes = messages.map((m) => addDoc(roomMessagesRef, m));
    const lastMessage = messages[messages.length - 1];
    writes.push(updateDoc(roomRef, { lastMessage }));
    Promise.all(writes);
  };

  return (
    <ImageBackground
      resizeMode="cover"
      source={require("../assets/chatbg.png")}
      style={{
        flex: 1,
      }}
    >
      <GiftedChat
        onSend={onSend}
        messages={messages}
        user={SenderUser}
        renderAvatar={null}
      />
    </ImageBackground>
  );
}
