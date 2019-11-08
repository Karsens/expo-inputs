import React from "react";
import { StyleSheet, TextInput } from "react-native";

export default ({ value, setFormState, field, title }) => {
  return (
    <TextInput
      placeholder={title}
      underlineColorAndroid="transparent"
      defaultValue={value && value.toString()}
      autoCorrect={false}
      keyboardType="number-pad"
      onChangeText={x => setFormState({ [field]: x })}
      style={styles.input}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 44,
    paddingVertical: 8
    // borderRadius: 22,
    // backgroundColor: "#DDD"
  }
});
