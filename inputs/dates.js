import React from "react";
import {
  Animated,
  TouchableOpacity,
  ScrollView,
  Text,
  StyleSheet,
  View,
  DatePickerIOS
} from "react-native";
import { format, getTime } from "date-fns";

import { C } from "../constants";

const durations = [
  { seconds: 0, text: "0 min" },
  { seconds: 300, text: "5 min" },
  { seconds: 900, text: "15 min" },
  { seconds: 1800, text: "30 min" },
  { seconds: 3600, text: "1 hr" },
  { seconds: 7200, text: "2 hr" },
  { seconds: 14400, text: "4 hr" },
  { seconds: 28800, text: "8 hr" },
  { seconds: 43200, text: "12 hr" },
  { seconds: 86400, text: "1 d" },
  { seconds: 86400 * 2, text: "2 d" },
  { seconds: 86400 * 4, text: "4 d" },
  { seconds: 86400 * 7, text: "1 wk" },
  { seconds: 86400 * 14, text: "2 wk" },
  { seconds: 86400 * 21, text: "3 wk" },
  { seconds: 86400 * 30, text: "1 mo" },
  { seconds: 86400 * 60, text: "2 mo" }
];

const dateFormat = "ddd, DD MMM YYYY HH:mm";

class Dates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDatePickerStart: false,
      showDatePickerEnd: false,
      animationStart: new Animated.Value(0),
      animationEnd: new Animated.Value(0)
    };
  }

  toggle(which: string, to: boolean | undefined = undefined) {
    let showKey, animationKey;

    if (which === "start") {
      showKey = "showDatePickerStart";
      animationKey = "animationStart";
    } else {
      showKey = "showDatePickerEnd";
      animationKey = "animationEnd";
    }

    if (to === false && this.state[showKey] === false) return;

    const newShow = to ? to : !this.state[showKey];

    const set = () =>
      this.setState({
        [showKey]: newShow //Step 2
      });

    if (newShow === false) {
      // hide the component once the animation is about to be done
      setTimeout(() => set(), 200);
    } else {
      //show the component instantly, otherwise the animation can't be seen
      set();
    }

    const maxHeight = 200;
    //Step 1
    let initialValue = this.state[showKey] ? maxHeight : 0,
      finalValue = this.state[showKey] ? 0 : to === false ? 0 : maxHeight;

    this.state[animationKey].setValue(initialValue); //Step 3
    Animated.spring(
      //Step 4
      this.state[animationKey],
      {
        toValue: finalValue
      }
    ).start(() => {
      console.log("finish start");
    }); //Step 5
  }

  render() {
    const {
      state,
      field,
      setFormState,
      value,
      titles,
      mapFieldsToDB
    } = this.props;

    if (!mapFieldsToDB || !titles) {
      const error =
        "This field type requires you to specify mapFieldsToDB and titles";
      console.log(error);
      return <Text>{error}</Text>;
    }

    //#todo: fix this (mapfieldstodb doesn't work anymore like that...)
    const startKey = mapFieldsToDB.start;
    const startValue = state[startKey] ? state[startKey] : value[startKey]; // or state[startKey], right?
    const startTime = getTime(startValue);
    const startText = format(startValue, dateFormat);
    const endKey = mapFieldsToDB.end;
    const endValue = state[endKey] ? state[endKey] : value[endKey];
    const endTime = getTime(endValue);
    const endText = format(endValue, dateFormat);

    const currentDuration = Math.round((endTime - startTime) / 1000);
    return (
      <View>
        <View style={styles.field}>
          <TouchableOpacity
            onPress={() => {
              this.toggle("start");
              this.toggle("end", false);
            }}
          >
            <View style={styles.row}>
              <View>
                <Text>{titles.start}</Text>
              </View>
              <View>
                <Text>{startText}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {this.state.showDatePickerStart ? (
            <Animated.View
              style={[styles.date, { height: this.state.animationStart }]}
            >
              <DatePickerIOS
                minuteInterval={
                  currentDuration < 1800 ? 5 : currentDuration >= 7200 ? 30 : 15
                }
                mode={currentDuration >= 86400 * 2 ? "date" : "datetime"}
                minimumDate={new Date(Date.now())}
                date={startValue}
                onDateChange={date =>
                  setFormState({
                    [startKey]: date,
                    [endKey]: new Date(getTime(date) + currentDuration * 1000)
                  })
                }
              />
            </Animated.View>
          ) : null}
        </View>

        <View style={styles.field}>
          <TouchableOpacity
            onPress={() => {
              this.toggle("start", false);
              this.toggle("end");
            }}
          >
            <View style={styles.row}>
              <View>
                <Text>{titles.end}</Text>
              </View>
              <View>
                <Text>{endText}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {this.state.showDatePickerEnd ? (
            <Animated.View
              style={[styles.date, { height: this.state.animationEnd }]}
            >
              <DatePickerIOS
                minuteInterval={
                  currentDuration < 1800 ? 5 : currentDuration >= 7200 ? 30 : 15
                }
                mode={currentDuration >= 86400 * 2 ? "date" : "datetime"}
                minimumDate={new Date(Date.now())}
                date={endValue}
                onDateChange={date => {
                  if (getTime(date) < startTime) {
                    setFormState({
                      [startKey]: new Date(getTime(date) - 3600 * 1000)
                    });
                  }
                  setFormState({
                    [endKey]: date
                  });
                }}
              />
            </Animated.View>
          ) : null}
        </View>

        <View>
          <View style={styles.row}>
            <ScrollView horizontal style={{ flex: 1 }}>
              <View style={{ flexDirection: "row" }}>
                {durations.map((duration, index) => {
                  const selectedColor =
                    duration.seconds === currentDuration
                      ? "lightblue"
                      : undefined;
                  return (
                    <View
                      key={`duration-${index}`}
                      style={{
                        paddingHorizontal: 4,
                        marginHorizontal: 6,
                        paddingVertical: 3,
                        backgroundColor: selectedColor,
                        borderRadius: 5
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          const endState = new Date(
                            startTime + duration.seconds * 1000
                          );
                          console.log("endkey", endKey, "endstate", endState);

                          setFormState({
                            [endKey]: endState
                          });
                        }}
                      >
                        <Text style={{ color: C.BUTTON_COLOR }}>
                          {duration.text}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  field: {
    borderBottomWidth: 1,
    borderBottomColor: "#CCC"
  },

  row: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "100%",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 8
  },

  date: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 8
  }
});
export default Dates;
