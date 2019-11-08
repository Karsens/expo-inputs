import React from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import { clearTextInput } from "../utils";

class Dictionary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: "",
      meaning: ""
    };
  }

  render() {
    const { value, state, setFormState, field } = this.props;
    // text

    const gotState = state[field] !== null && state[field] !== undefined;

    const currentValues2 = gotState
      ? state[field].split(", ")
      : value
      ? value.toString().split(", ")
      : [];
    const currentValues1 = currentValues2.filter(v => v !== "");
    const currentValues = currentValues1.map(v => {
      const vSplitted = v.split("=");
      return { symbol: vSplitted[0], meaning: vSplitted[1] };
    });

    // console.log(
    //   "state[field]",
    //   state[field],
    //   "cv2",
    //   currentValues2,
    //   "cv1",
    //   currentValues1,
    //   "cv",
    //   currentValues
    // );

    const renderLabels = (
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        {currentValues.map((v, index) => {
          const vShort = v.symbol + " " + v.meaning;

          return (
            <TouchableOpacity
              onPress={() => {
                const current = gotState ? state[field] : value;

                const vText = v.symbol + "=" + v.meaning;

                let removeState = current
                  .replace(", " + vText, "")
                  .replace(", ,", ",")
                  .replace(vText, "");

                const firstTwo = removeState.substring(0, 2);
                removeState =
                  firstTwo === ", "
                    ? removeState.substring(2, removeState.length)
                    : removeState;

                console.log(
                  "current = '" +
                    current +
                    "', removeState='" +
                    removeState +
                    "'"
                );

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
              <FontAwesome style={{ marginLeft: 10 }} name="remove" size={12} />
            </TouchableOpacity>
          );
        })}
      </View>
    );

    const renderPlus = (
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
          clearTextInput(this.textInput2);

          const current = gotState ? state[field] : value;
          let addedState =
            current + ", " + this.state.symbol + "=" + this.state.meaning;

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
    );

    const renderSymbolInput = (
      <TextInput
        underlineColorAndroid="transparent"
        defaultValue=""
        autoCorrect={false}
        placeholder="Symbol"
        onChangeText={x => this.setState({ symbol: x })}
        style={{
          width: 80,
          height: 44,
          padding: 8,
          borderRadius: 22,
          backgroundColor: "#DDD",
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0
        }}
        ref={ref => (this.textInput = ref)}
      />
    );

    const renderMeaningInput = (
      <TextInput
        underlineColorAndroid="transparent"
        defaultValue=""
        placeholder="Meaning"
        autoCorrect={false}
        onChangeText={x => this.setState({ meaning: x })}
        style={{
          width: 100,
          height: 44,
          padding: 8,
          backgroundColor: "#DDD"
        }}
        ref={ref => (this.textInput2 = ref)}
      />
    );

    const renderEqual = (
      <View
        style={{
          height: 44,
          backgroundColor: "#AAA",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>=</Text>
      </View>
    );

    return (
      <View>
        <View style={{ flexDirection: "row" }}>
          {renderSymbolInput}

          {renderEqual}

          {renderMeaningInput}

          {renderPlus}
        </View>

        {renderLabels}
      </View>
    );
  }
}
export default Dictionary;
