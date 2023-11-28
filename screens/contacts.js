import { View, Text, FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import useContacts from "../hooks/useContacts";
import { useGlobalContext } from "../context/context-wrapper";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import ContactListItem from "../components/contact-list-item";
import { useRoute } from "@react-navigation/native";

export default function Contacts() {
  const contacts = useContacts();
  const route = useRoute();
  const image = route.params && route.params.image;
  return (
    <FlatList
      style={{ flex: 1, padding: 10 }}
      data={contacts}
      keyExtractor={(_, i) => i}
      renderItem={({ item }) => <ContactPreview contact={item} image={image} />}
    />
  );
}

function ContactPreview({ contact, image }) {
  const { unfiltredRooms } = useGlobalContext();
  const [user, setUser] = useState(contact);
  useEffect(() => {
    const q = query(
      collection(db, "rooms"),
      where("email", "==", contact.email)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.docs.length > 0) {
        const userDoc = snapshot.docs[0].data();
        setUser((prevUser) => ({
          ...prevUser,
          userDoc,
        }));
      }
    });
    return () => unsubscribe();
  }, [unfiltredRooms]);

  return (
    <ContactListItem
      style={{ marginTop: 10 }}
      type={"contact"}
      user={user}
      image={image}
      room={unfiltredRooms.find((room) =>
        room.participantsArray.includes(contact.email)
      )}
    />
  );
}
