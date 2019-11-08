import React from "react";
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  View
} from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { clearTextInput } from "../utils";

class Categories extends React.Component {
  constructor(props) {
    super(props);

    this.state = { new: "" };
  }

  render() {
    const { state, field, setFormState, value } = this.props;

    const currentValues2 =
      state[field] !== null
        ? state[field].split(", ")
        : value
        ? value.toString().split(", ")
        : [];
    const currentValues =
      currentValues2 && currentValues2.filter(v => v !== "");

    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            underlineColorAndroid="transparent"
            defaultValue=""
            autoCorrect={false}
            onChangeText={x => this.setState({ new: x })}
            style={[
              styles.input,
              { borderTopRightRadius: 0, borderBottomRightRadius: 0 }
            ]}
            ref={ref => (this.textInput = ref)}
          />
          <TouchableOpacity
            style={{
              backgroundColor: "#AAA",
              borderTopRightRadius: 20,
              borderBottomRightRadius: 20,
              justifyContent: "center",
              alignItems: "center",
              width: 30
            }}
            onPress={() => {
              clearTextInput(this.textInput);

              const current = state[field] !== null ? state[field] : value;
              let addedState = current + ", " + this.state.new;

              const firstTwo = addedState.substring(0, 2);
              addedState =
                firstTwo === ", "
                  ? addedState.substring(2, addedState.length)
                  : addedState;

              setFormState({ [field]: addedState });
            }}
          >
            <Text style={{ fontSize: 24 }}>+</Text>
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {currentValues &&
            currentValues.map((currentValue, index) => {
              const vShort =
                currentValue && currentValue.length > 30
                  ? currentValue.substring(0, 14) +
                    ".." +
                    currentValue.substring(
                      currentValue.length - 14,
                      currentValue.length
                    )
                  : currentValue;

              return (
                <TouchableOpacity
                  onPress={() => {
                    const current =
                      state[field] !== null ? state[field] : value;

                    let removeState = current
                      .replace(", " + currentValue, "")
                      .replace(", ,", ",")
                      .replace(currentValue, "");

                    const firstTwo = removeState.substring(0, 2);
                    removeState =
                      firstTwo === ", "
                        ? removeState.substring(2, removeState.length)
                        : removeState;

                    setFormState({ [field]: removeState });
                  }}
                  key={`index-${index}`}
                  style={{
                    backgroundColor: "#CCC",
                    borderRadius: 15,
                    height: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 3,
                    paddingVertical: 3,
                    paddingHorizontal: 10,
                    flexDirection: "row"
                  }}
                >
                  <Text>{vShort}</Text>
                  <FontAwesome
                    style={{ marginLeft: 10 }}
                    name="remove"
                    size={12}
                  />
                </TouchableOpacity>
              );
            })}
        </View>
      </View>
    );
  }
}

export default Categories;

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 10,
    paddingVertical: 3
  },

  b: {
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 20
  },

  u: {
    textDecorationLine: "underline"
  },

  title: {
    fontWeight: "bold"
  },
  kav: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "royalblue"
  },
  input: {
    width: 200,
    height: 44,
    padding: 8,
    borderRadius: 22,
    backgroundColor: "#DDD"
  }
});
