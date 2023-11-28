import { useEffect, useState } from "react";

import * as Contacts from "expo-contacts";

export default function useContacts() {
  const [contacts, setContacts] = useState([]);
  useEffect(() => {
    (async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status === "granted") {
        const { data } = await Contacts.getContactsAsync({
          fields: [Contacts.Fields.Emails],
        });
        if (data.length > 0) {
          setContacts(
            data
              .filter(
                (contact) =>
                  contact.firstName &&
                  contact.emails &&
                  contact.emails[0] &&
                  contact.emails[0].email
              )
              .map(mapConactToUser)
          );
        }
      }
    })();
  }, []);

  return contacts;
}

function mapConactToUser(contact) {
  return {
    contactName:
      contact.firstName && contact.lastName
        ? `${contact.firstName} ${contact.lastName}`
        : contact.firstName || contact.lastName || contact.name,
    email: contact.emails[0].email,
  };
}
