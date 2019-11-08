import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { connectActionSheet } from "@expo/react-native-action-sheet";

// Object { date, month }

const days = [
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31
];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

@connectActionSheet
class Birthday extends React.Component {
  render() {
    const { title, state, field, setFormState, value, values } = this.props;

    const gotState = state[field] !== undefined && state[field] !== null;
    const birthday = gotState ? state[field] : value;

    return (
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={{
            margin: 20
          }}
          onPress={() => {
            const options: String[] = months;

            const indexAction = buttonIndex => {
              // Do something here depending on the button index selected
              if (buttonIndex < options.length) {
                // assumes cancel is last button.

                setFormState({
                  [field]: { month: buttonIndex + 1, date: birthday.date }
                });
              }
            };

            const destructiveButtonIndex = undefined;
            const cancelButtonIndex = options.length;

            this.props.showActionSheetWithOptions(
              {
                options: options.concat(["Cancel"]),
                cancelButtonIndex,
                title: "Choose the month",
                destructiveButtonIndex
              },
              indexAction
            );
          }}
        >
          <Text style={styles.text}>
            {months[birthday.month - 1] || "Month"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            margin: 20
          }}
          onPress={() => {
            const options: String[] = days.map(d => String(d));

            const indexAction = buttonIndex => {
              // Do something here depending on the button index selected
              if (buttonIndex < options.length) {
                // assumes cancel is last button.

                setFormState({
                  [field]: { month: birthday.month, date: days[buttonIndex] }
                });
              }
            };

            const destructiveButtonIndex = undefined;
            const cancelButtonIndex = options.length;

            this.props.showActionSheetWithOptions(
              {
                options: options.concat(["Cancel"]),
                cancelButtonIndex,
                title: "Choose the date",
                destructiveButtonIndex
              },
              indexAction
            );
          }}
        >
          <Text style={styles.text}>{birthday.date || "Date"}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  text: {
    fontSize: 18
  }
});
export default Birthday;
