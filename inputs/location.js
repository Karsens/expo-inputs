import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import Menu from "../menu.component";
import { FontAwesome } from "react-native-vector-icons";

export default ({
  value,
  state,
  setFormState,
  title,
  navigation,
  googlePlacesConfig
}) => {
  const location =
    state.address !== undefined
      ? {
          address: state.address,
          city: state.city,
          country: state.country,
          latitude: state.latitude,
          longitude: state.longitude,
          mapsurl: state.mapsurl,
          global: state.global
        }
      : value;

  const onChange = newLocation => {
    setFormState({ ...newLocation });
  };

  const emptyLocation = {
    address: "",
    city: "",
    country: "",
    latitude: 0,
    longitude: 0,
    locationIsEmpty: true,
    mapsurl: "",
    global: true
  };

  const menu = [
    {
      id: 1,
      show: true,
      component:
        location && location.address ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1
            }}
          >
            <Text>{location.address}</Text>

            {location && location.address ? (
              <TouchableOpacity
                onPress={() => {
                  console.log("set state to ", emptyLocation);
                  setFormState(emptyLocation);
                }}
              >
                <FontAwesome name="trash-o" />
              </TouchableOpacity>
            ) : (
              undefined
            )}
          </View>
        ) : (
          <View
            style={{
              justifyContent: "center",
              flex: 1
            }}
          >
            <Text style={{ color: "#CCC" }}>{title}</Text>
          </View>
        ),

      // icon: "map-marker", // globe could also
      onPress: () =>
        navigation.navigate({
          routeName: "Location",
          key: "Location",
          params: { location, onChange, googlePlacesConfig }
        })
    }
  ];

  return <Menu backgroundColor="transparent" data={menu} />;
};
