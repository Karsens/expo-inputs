import React from "react";
import { Platform, Picker, Text, View } from "react-native";
import ModalSelector from "react-native-modal-selector";
import { FontAwesome } from "react-native-vector-icons";

export default ({ state, field, setFormState, value, values }) => {
  const selectedValue = state[field] !== null ? state[field] : value;

  const selectedObject = values && values.find(v => v.value === selectedValue);

  const selectedText = selectedObject
    ? selectedObject.label
    : "No selection made";

  return Platform.OS === "ios" ? (
    <ModalSelector
      style={{ width: "90%" }}
      data={values || []}
      animationType="fade"
      onChange={option => {
        setFormState({ [field]: option.value });
      }}
      backdropPressToClose={true}
    >
      <View
        style={{
          width: "100%",
          backgroundColor: "#DDD",
          borderRadius: 20,
          marginVertical: 10,
          paddingHorizontal: 15,
          height: 40,
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row"
        }}
      >
        <Text style={{ fontSize: 16 }}>{selectedText}</Text>
        <FontAwesome
          name="caret-down"
          style={{ margin: 10, marginRight: 0 }}
          color="#404040"
          size={16}
        />
      </View>
    </ModalSelector>
  ) : (
    <Picker
      style={{ height: 50, width: "100%" }}
      selectedValue={selectedValue}
      onValueChange={v => {
        setFormState({ [field]: v });
      }}
    >
      {values &&
        values.map(v => (
          <Picker.Item key={`key-${v.label}`} label={v.label} value={v.value} />
        ))}
    </Picker>
  );
};
