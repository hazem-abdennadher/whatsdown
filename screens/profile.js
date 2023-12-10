import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import Constants from "expo-constants";
import { useGlobalContext } from "../context/context-wrapper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { askForPermission, pickImage, uploadImage } from "../utils";
import { auth, db } from "../firebase";
import { updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
export default function Profile() {
  const navigation = useNavigation();
  const {
    theme: { colors },
  } = useGlobalContext();

  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user.displayName);
  const [selectedImage, setSelectedImage] = useState(user.photoURL);
  const [permissionStatus, setPermissionStatus] = useState(null); // ["granted", "denied", "undetermined"
  const handlePress = async () => {
    let photoURL = null;
    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        "profile-pictures",
        user.uid
      );
      photoURL = url;
    }
    const userData = {
      displayName,
      email: user.email,
    };
    if (photoURL) {
      userData.photoURL = photoURL;
    }

    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, "users", user.uid), {
        ...userData,
        uid: user.uid,
      }),
    ]);
    alert("updated");
    navigation.navigate("Home");
  };
  const hanldeProfilePicture = async () => {
    const result = await pickImage();
    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

  if (!permissionStatus) return <Text>Requesting permission</Text>;
  if (permissionStatus !== "granted") return <Text>Permission denied</Text>;
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: Constants.statusBarHeight + 20,
          padding: 20,
        }}
      >
        <Text
          style={{
            fontSize: 22,
            color: colors.foreground,
          }}
        >
          Profile Info
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: colors.text,
            marginTop: 20,
          }}
        >
          Please provide your name and an optional profile picture
        </Text>
        <TouchableOpacity
          style={{
            marginTop: 20,
            borderRadius: 120,
            width: 120,
            height: 120,
            backgroundColor: colors.background,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={hanldeProfilePicture}
        >
          {!selectedImage ? (
            <MaterialCommunityIcons
              name="camera-plus"
              color={colors.iconGray}
              size={45}
            />
          ) : (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 120,
              }}
            />
          )}
        </TouchableOpacity>
        <TextInput
          placeholder="Your Name"
          style={{
            marginTop: 20,
            width: "100%",
            borderBottomWidth: 2,
            borderBottomColor: colors.primary,
            color: colors.text,
          }}
          value={displayName}
          onChangeText={(text) => setDisplayName(text)}
        />
        <View
          style={{
            marginTop: 20,
            width: "100%",
            alignItems: "flex-end",
          }}
        >
          <Button
            title="Save"
            color={colors.primary}
            disabled={!displayName}
            onPress={handlePress}
          />
        </View>
      </View>
    </React.Fragment>
  );
}
