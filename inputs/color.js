import React from "react";
import {
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity
} from "react-native";

import { getColorByBgColor } from "../utils";
export default ({ value, state, setFormState, field }) => {
  const colors = "#1abc9c, #f1c40f, #f39c12, #2ecc71, #27ae60, #27ae60, #e67e22, #3498db, #2980b9, #e74c3c, #c0392b, #9b59b6, #9b59b6, #ecf0f1, #bdc3c7, #34495e, #2c3e50, #2c3e50, #7f8c8d".split(
    ", "
  );

  const isOk = color => /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color);

  const v =
    state[field] && isOk(state[field])
      ? state[field]
      : value
      ? value
      : "#ecf0f1";

  return (
    <View>
      <TextInput
        defaultValue={v}
        style={[
          styles.input,
          {
            backgroundColor: v,
            color: getColorByBgColor(v)
          }
        ]}
        onChangeText={x => isOk(x) && setFormState({ [field]: x })}
      />
      <ScrollView horizontal>
        {colors.map((color, index) => {
          return (
            <TouchableOpacity
              key={`key-${index}`}
              onPress={() => setFormState({ [field]: color })}
            >
              <View
                style={{
                  margin: 4,
                  width: 50,
                  height: 50,
                  borderColor: "black",
                  borderWidth: state[field] === color ? 2 : 0,
                  borderRadius: 25,
                  backgroundColor: color
                }}
              />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    width: 200,
    height: 44,
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#DDD"
  }
});
