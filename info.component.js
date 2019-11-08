import React from "react";
import { Alert, TouchableOpacity } from "react-native";
import { FontAwesome } from "react-native-vector-icons";

export default ({ info }) => {
  return (
    <TouchableOpacity onPress={() => Alert.alert("", info)}>
      <FontAwesome size={16} name="info-circle" />
    </TouchableOpacity>
  );
};
