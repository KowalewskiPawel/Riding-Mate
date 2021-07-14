import * as React from "react";
import { View, Text, Button } from "react-native";
import { useState } from "react";
import { useEffect } from "react";
import firebase from "../config/firebase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

function LoginScreen() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<any>();

  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  async function onGoogleButtonPress() {
    const { idToken } = await firebase.GoogleSignin.signIn();

    const googleCredential =
      firebase.auth.GoogleAuthProvider.credential(idToken);

    return firebase.atuh().signInWithCredential(googleCredential);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  if (!user) {
    return (
      <View>
        <Text>Login</Text>
        <Button
          title="Google Sign-In"
          onPress={() =>
            onGoogleButtonPress().then(() =>
              console.log("Signed in with Google!")
            )
          }
        />
      </View>
    );
  }

  return (
    <View>
      <Text>Welcome {user.email}</Text>
    </View>
  );

  /*
  const user = auth().currentUser;

  if (!user) {
    return <Text>Please login</Text>;
  }
  return <Text>Welcome {user.email}</Text>;
  */
}

export default LoginScreen;
