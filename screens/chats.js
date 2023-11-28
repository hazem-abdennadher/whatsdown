import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useGlobalContext } from "../context/context-wrapper";
import ContactsFloatingIcon from "../components/contacts-floating-icon";
import ContactListItem from "../components/contact-list-item";
import useContacts from "../hooks/useContacts";

export default function Chats() {
  const { currentUser } = auth;
  const { rooms, setRooms, setUnfiltredRooms } = useGlobalContext();
  const contacts = useContacts();

  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser.email)
  );
  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      const parsedChats = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
        userB: doc
          .data()
          .participants.find((p) => p.email !== currentUser.email),
      }));
      setUnfiltredRooms(parsedChats);
      setRooms(parsedChats.filter((doc) => doc.lastMessage));
    });
    return () => unsubscribe();
  }, []);
  function getUserB(user, contacts) {
    const userContact = contacts.find((contact) => {
      return contact.email === user.email;
    });
    if (userContact && userContact.contactName) {
      return {
        ...user,
        contactName: userContact.contactName,
      };
    }
    return user;
  }

  return (
    <View
      style={{
        flex: 1,
        padding: 5,
        paddingRight: 10,
      }}
    >
      {rooms.map((room) => (
        <ContactListItem
          type="chat"
          description={room.lastMessage.text}
          key={room.id}
          room={room}
          time={room.lastMessage.createdAt}
          user={getUserB(room.userB, contacts)}
        />
      ))}
      <ContactsFloatingIcon />
    </View>
  );
}
