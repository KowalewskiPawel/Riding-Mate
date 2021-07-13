import "react-native-gesture-handler";
import React, { useRef, useState, useEffect } from "react";

import {
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  StatusBar,
  Keyboard,
  StyleSheet,
  View,
  Text,
} from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";
import moment from "moment";

import firebase from "../config/firebase";
import { getRegion } from "../helpers/map";

interface locationCoords {
  latitude: null | number;
  longitude: null | number;
}

export default function MapScreen() {
  const [messageText, setMessageText] = useState<any>(null);
  const [sendButtonActive, setSendButtonActive] = useState<boolean>(false);
  const [location, setLocation] = useState<locationCoords>({
    latitude: null,
    longitude: null,
  });
  const [messages, setMessages] = useState<any>([]);

  const map = useRef<any>();
  const marker = useRef<any>();

  const getLocation = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});

      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      map.current.animateToRegion(
        getRegion(location.coords.latitude, location.coords.longitude, 16000)
      );
    }
  };

  const onChangeText = (messageText: string) => {
    setMessageText(messageText);
    setSendButtonActive(messageText.length > 0);
  };

  const onSendPress = () => {
    if (sendButtonActive) {
      firebase
        .database()
        .ref("message")
        .push({
          text: messageText,
          latitude: location.latitude,
          longitude: location.longitude,
          timestamp: new Date(),
        })
        .then(() => {
          setMessageText(null);

          ToastAndroid.show("Your message has been sent!", ToastAndroid.SHORT);

          Keyboard.dismiss();
        })
        .catch((err: any) => {
          console.error(err);
        });
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    inputWrapper: {
      width: "100%",
      position: "absolute",
      padding: 10,
      top: StatusBar.currentHeight,
      left: 0,
      zIndex: 100,
    },
    input: {
      height: 46,
      paddingVertical: 10,
      paddingRight: 50,
      paddingLeft: 10,
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 6,
      backgroundColor: "#fff",
    },
    sendButton: {
      position: "absolute",
      top: 17,
      right: 20,
      opacity: 0.4,
    },
    sendButtonActive: {
      opacity: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
  });

  useEffect(() => {
    getLocation();
  }, []);

  useEffect(() => {
    getLocation();

    firebase
      .database()
      .ref("message")
      .limitToLast(10)
      .on("child_added", (data: any) => {
        let tempMessages = [...messages, data.val()];

        setMessages(tempMessages);
        let { latitude, longitude } = [...tempMessages].pop();

        map.current.animateToRegion(getRegion(latitude, longitude, 160000));

        if (marker.current !== undefined) {
          setTimeout(() => {
            marker.current.showCallout();
          }, 100);
        }
      });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          placeholder="Type your message here"
          onChangeText={(messageText) => onChangeText(messageText)}
          value={messageText}
        />
        <View
          style={{
            ...styles.sendButton,
            ...(sendButtonActive ? styles.sendButtonActive : {}),
          }}
        >
          <TouchableOpacity onPress={onSendPress}>
            <MaterialIcons name="send" size={32} color="#fe4027" />
          </TouchableOpacity>
        </View>
      </View>
      <MapView
        ref={map}
        style={styles.map}
        initialRegion={getRegion(48.860831, 2.341129, 160000)}
      >
        {messages.map((message: any, index: number) => {
          let { latitude, longitude, text, timestamp } = message;

          return (
            <Marker
              ref={marker}
              key={index}
              identifier={"marker_" + index}
              coordinate={{ latitude, longitude }}
            >
              <Callout>
                <View>
                  <Text>{text}</Text>
                  <Text style={{ color: "#999" }}>
                    {moment(timestamp).fromNow()}
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}
