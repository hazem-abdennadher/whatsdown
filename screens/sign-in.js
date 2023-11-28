import {
  Image,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { useGlobalContext } from "../context/context-wrapper";
import { FirebaseSignIn, FirebaseSignUp } from "../firebase";

export default function SignIn() {
  const {
    theme: { colors },
  } = useGlobalContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("signin");

  async function handlePress() {
    try {
      if (mode === "signup") {
        await FirebaseSignUp(email, password);
      } else {
        await FirebaseSignIn(email, password);
      }
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.white,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          color: colors.foreground,
          fontSize: 24,
          marginBottom: 20,
        }}
      >
        Welcome to Whatsdown
      </Text>
      <Image
        source={require("../assets/welcome-img.png")}
        style={{
          width: 180,
          height: 180,
          resizeMode: "cover",
        }}
      />
      <View
        style={{
          marginTop: 20,
        }}
      >
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 200,
          }}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          style={{
            borderBottomColor: colors.primary,
            borderBottomWidth: 2,
            width: 200,
            marginTop: 20,
          }}
        />
        <View style={{ marginTop: 20 }}>
          <Button
            title={mode === "signup" ? "Sign Up" : "Sign In"}
            color={colors.primary}
            disabled={!email || !password}
            onPress={handlePress}
          />
        </View>
        <TouchableOpacity
          style={{ marginTop: 20 }}
          onPress={() => setMode(mode === "signup" ? "signin" : "signup")}
        >
          <Text style={{ color: colors.secondaryText }}>
            {mode === "signup"
              ? "Already have an account? Sign In"
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
