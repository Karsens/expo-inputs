import React from "react";
import { Dimensions, TouchableOpacity, Text, View } from "react-native";
// import { FontAwesome } from "react-native-vector-icons";
import ActionSheet from "react-native-super-actionsheet";

const { width } = Dimensions.get("screen");

export default ({
  onChange,
  title,
  state,
  field,
  setFormState,
  value,
  values
}) => {
  const gotState = state[field] !== undefined && state[field] !== null;
  const selectedIndex = gotState ? state[field] : value;
  const selectedObject =
    values && values.filter(v => v.value === selectedIndex)[0];

  const selectedText = selectedObject
    ? selectedObject.label
    : "No selection made";

  let n = 0;

  //index, title, onpress
  const buttons = values.map(({ value, label }, index) => ({
    index,
    title: label,
    onPress: () => {
      setFormState({ [field]: value });
      onChange?.(value);
    }
  }));

  buttons.push({
    index: buttons.length,
    title: "Cancel",
    cancel: true
  });

  //console.log("buttons???", buttons);

  return (
    <View>
      <TouchableOpacity
        style={{
          justifyContent: "center",
          width: width - 40,
          height: 44,
          alignItems: "flex-start"
        }}
        onPress={() => this[field].show()}
      >
        <Text>{selectedText}</Text>
      </TouchableOpacity>
      <ActionSheet reference={ref => (this[field] = ref)} data={buttons} />
    </View>
  );
};
