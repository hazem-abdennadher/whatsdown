import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { useGlobalContext } from "../context/context-wrapper";
import { Grid, Row, Col } from "react-native-easy-grid";
import Avatar from "./avatar";
export default function ContactListItem({
  style,
  type,
  description,
  user,
  time,
  image,
  room,
}) {
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useGlobalContext();
  return (
    <TouchableOpacity
      style={{
        height: 80,
        ...style,
      }}
      onPress={() => navigation.navigate("chat", { user, room, image })}
    >
      <Grid
        style={{
          maxHeight: 80,
        }}
      >
        <Col
          style={{
            width: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Avatar size={type === "contact" ? 40 : 65} user={user} />
        </Col>
        <Col style={{ marginLeft: 10 }}>
          <Row style={{ alignItems: "center" }}>
            <Col>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}
              >
                {user.displayName || user.contactName}
              </Text>
            </Col>
            {time && (
              <Col style={{ alignItems: "flex-end" }}>
                <Text style={{ color: colors.secondaryText, fontSize: 12 }}>
                  {new Date(time.seconds * 1000).toLocaleDateString()}
                </Text>
              </Col>
            )}
          </Row>
          {description && (
            <Row>
              <Text style={{ color: colors.secondaryText, fontSize: 14 }}>
                {description}
              </Text>
            </Row>
          )}
        </Col>
      </Grid>
    </TouchableOpacity>
  );
}
