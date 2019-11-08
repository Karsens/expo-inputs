import React from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { MaterialIcons } from "react-native-vector-icons";
import { trim1 } from "../utils";
import { Value } from "../types";

const objectArrayFromString = (string: string) =>
  string
    ? string
        .split(",")
        .filter((a: string) => a !== null)
        .map((s: string) => trim1(s))
        .map((s: string) => ({ label: s, value: s }))
    : [];

const stringFromObjectArray = (a: Value[]) =>
  a ? a.map((v: Value) => `[${v.value}]`).join(",") : "";

class SelectMultipleComponent extends React.Component {
  render() {
    const { state, field, setFormState, value, values } = this.props;

    const objectified = objectArrayFromString(value);
    const current = state[field]
      ? objectArrayFromString(state[field])
      : objectified;
    return (
      <View style={{ width: "100%", backgroundColor: "white" }}>
        {values &&
          values.map((value, index) => {
            const selected =
              current.filter(c => c.label === value)[0] !== undefined;
            const newState = selected
              ? current.filter(c => c.label !== value)
              : [...current, { label: value, value }];

            const formState = stringFromObjectArray(newState);

            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setFormState({ [field]: formState });
                }}
                style={{
                  height: 50,
                  borderBottomColor: "#CCC",
                  borderBottomWidth: 1,
                  alignItems: "center",
                  flexDirection: "row"
                }}
              >
                <MaterialIcons
                  style={{ margin: 10 }}
                  size={24}
                  name={selected ? "check-box" : "check-box-outline-blank"}
                />
                <Text style={{ fontSize: 16 }}>{value}</Text>
              </TouchableOpacity>
            );
          })}
      </View>
    );
  }
}

export default SelectMultipleComponent;
