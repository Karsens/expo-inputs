import React from "react";
import DatePicker from "react-native-datepicker";

class DatePickerClass extends React.Component {
  state = {
    date: new Date(Date.now())
  };

  render() {
    const { state, field, setFormState, value } = this.props;
    //specific for this datepicker:
    const { mode } = this.props;
    console.log("value is", value, "state is", state[field]);
    const date =
      state[field] !== null && state[field] !== undefined
        ? state[field]
        : value
        ? value
        : this.state.date;

    return (
      <DatePicker
        style={{ width: 200 }}
        date={date}
        mode={mode ? mode : "datetime"}
        placeholder="select date"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: "absolute",
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            borderRadius: 20,
            backgroundColor: "#CCC",
            borderWidth: 0
          }
          // ... You can check the source to find the other keys.
        }}
        onDateChange={date => {
          setFormState({ [field]: new Date(date) });
        }}
      />
    );
  }
}

export default DatePickerClass;
