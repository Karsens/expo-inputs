import React from "react";
import { Dimensions, View, StyleSheet, TextInput } from "react-native";
import FadeInTitle from "../fade.in.title.component";
const screen = Dimensions.get("screen");

export default ({ state, value, setFormState, field, title, onChange }) => {
  const currentValue =
    state[field] !== undefined && state[field] !== null ? state[field] : value;
  return (
    <View style={{ paddingVertical: 4 }}>
      <FadeInTitle title={title} show={!!currentValue} />
      <TextInput
        secureTextEntry
        placeholder={title}
        underlineColorAndroid="transparent"
        defaultValue={value && value.toString()}
        autoCorrect={false}
        onChangeText={x => {
          setFormState({ [field]: x });
          if (onChange) {
            onChange(x);
          }
        }}
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    paddingVertical: 0,
    width: screen.width,
    height: 30
  }
});
