import React from "react";
import { Dimensions, StyleSheet, TextInput } from "react-native";
var screen = Dimensions.get("window");

export default ({ value, setFormState, field, title }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={title}
      underlineColorAndroid="transparent"
      defaultValue={value && value.toString()}
      autoCorrect={false}
      keyboardType="phone-pad"
      onChangeText={x => setFormState({ [field]: x })}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: screen.width,
    height: 44,
    paddingVertical: 8
    // borderRadius: 22,
    // backgroundColor: "#DDD"
  }
});
