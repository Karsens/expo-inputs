import React from "react";
import { Text, View, StyleSheet } from "react-native";
import Info from "./info.component";

const FieldComponent = ({ inputField, inputProps, state, key }) => {
  const {
    field,
    type,
    info,
    title,
    description,
    descriptionComponent,
    startSection,
    startSectionDescription,
    options,
    errorMessage
  } = inputProps;

  let mainView = null;

  const noTitleNeeded =
    !type ||
    type === "text" ||
    type === "textArea" ||
    type === "dates" ||
    type === "textInput" ||
    type === "numbers" ||
    type === "location" ||
    type === "phone";

  const isCoverImage =
    type === "image" && options && options.renderType === "cover";

  const noRowNeeded = type === "dates" || isCoverImage || type === "anything";

  const maxWidth =
    type === "boolean" ? { width: info ? "60%" : "80%" } : undefined;

  const inputFieldCorrectWidth = info ? (
    <View style={{ width: type === "boolean" ? "20%" : "90%" }}>
      {inputField}
    </View>
  ) : (
    inputField
  );

  mainView = (
    <View style={styles.field}>
      {noRowNeeded ? (
        inputField
      ) : (
        <View style={styles.row}>
          {noTitleNeeded ? null : (
            <Text style={[styles.title, maxWidth]}>{title}</Text>
          )}

          {inputFieldCorrectWidth}

          {info ? <Info info={info} /> : null}
        </View>
      )}

      {description ? (
        <View style={styles.row}>
          <Text>{description}</Text>
        </View>
      ) : (
        undefined
      )}

      {descriptionComponent ? descriptionComponent : null}
      {state[field + "Error"] ? (
        <View style={styles.row}>
          <Text style={{ color: "red" }}>{errorMessage}</Text>
        </View>
      ) : null}
    </View>
  );

  //section has startSection: string and startSectionDescription
  const section = startSection ? (
    <View style={styles.section}>
      {startSection.length > 0 ? (
        <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 20 }}>
          {startSection}
        </Text>
      ) : null}
      {startSectionDescription ? <Text>{startSectionDescription}</Text> : null}
    </View>
  ) : (
    undefined
  );

  return (
    <View key={key}>
      {section}
      {mainView}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingVertical: 10
  },

  field: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    paddingVertical: 3
  },

  title: {
    fontWeight: "normal"
  }
});

export default FieldComponent;
