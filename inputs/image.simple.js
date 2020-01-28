import React from "react";
import { View, Text, Image, TouchableOpacity, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";

class SimpleImage extends React.Component {
  getPermissionAsync = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    return status === "granted";
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1]
    });

    if (!result.cancelled) {
      this.setForm(result.uri);
    }
  };

  setForm = x => {
    const {
      state,
      value,
      setFormState,
      field,
      title,
      options,
      onChange
    } = this.props;

    setFormState({ [field]: x });
    if (onChange) {
      onChange(x);
    }
  };

  chooseImage = async () => {
    const permission = await this.getPermissionAsync();

    if (permission || Platform.OS === "web") {
      this._pickImage();
    } else {
      console.log("Permis", permission);
    }
  };

  renderImageOrPlaceholder(uri) {
    const formFactor = { width: 100, height: 100, borderRadius: 50 };

    const defaultImage = uri ? (
      <View
        style={{
          ...formFactor,
          backgroundColor: "#CCC",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={{ uri }} style={formFactor} />
      </View>
    ) : (
      <View
        style={{
          ...formFactor,
          backgroundColor: "#CCC",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Text>Select Image</Text>
      </View>
    );

    return defaultImage;
  }

  render() {
    const { state, value, field, options } = this.props;

    const currentValue =
      state[field] !== undefined && state[field] !== null
        ? state[field]
        : value;
    return (
      <View
        style={{
          paddingVertical: 4,
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        {options?.component}
        <TouchableOpacity onPress={() => this.chooseImage()}>
          {this.renderImageOrPlaceholder(currentValue)}
        </TouchableOpacity>
      </View>
    );
  }
}

export default SimpleImage;
