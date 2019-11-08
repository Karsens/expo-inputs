import React from "react";
import { View, Text, TextInput } from "react-native";

class TextAreaInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPosition: [0, 0],
      selection: null,
      allowEditing: true
    };
  }

  render() {
    const { value, values, field, setFormState, state, title } = this.props;
    const currentValue = state[field] ? state[field] : value;

    return (
      <View style={{ width: "100%" }}>
        {currentValue ? <Text style={{ fontSize: 12 }}>{title}:</Text> : null}
        <TextInput
          placeholder={title}
          underlineColorAndroid="transparent"
          onChangeText={text => {
            this.setState({
              allowEditing: true
            });

            //if (text !== "") { // why???
            setFormState({ [field]: text });
            //}
          }}
          selection={this.state.selection}
          onSelectionChange={event =>
            this.setState({
              cursorPosition: event.nativeEvent.selection,
              selection: event.nativeEvent.selection,
              allowEditing: true
            })
          }
          onSubmitEditing={() => {
            const query = state[field];
            const cursorPosition = this.state.cursorPosition;

            let newText = query;

            const ar = newText && newText.split("");
            cursorPosition && ar && ar.splice(cursorPosition.start, 0, "\n");
            newText = ar && ar.join("");

            if (
              cursorPosition &&
              query &&
              cursorPosition.start === query.length &&
              query.endsWith("\n")
            ) {
              setFormState({ [field]: newText });
            } else if (this.state.allowEditing) {
              //if (newText !== "") {
              setFormState({ [field]: newText });
              // }

              this.setState({
                selection: {
                  start: cursorPosition && cursorPosition.start + 1,
                  end: cursorPosition && cursorPosition.end + 1
                },
                allowEditing: !this.state.allowEditing
              });
            }
          }}
          multiline={true}
          numberOfLines={10}
          blurOnSubmit={false}
          editable={true}
          defaultValue={value && value.toString()}
          style={{
            width: "100%",
            paddingVertical: 8,
            height: 150,
            textAlignVertical: "top"
          }}
        />
      </View>
    );
  }
}

export default TextAreaInput;
