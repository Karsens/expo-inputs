import React from "react";
import { Platform } from "react-native";
import * as FileSystem from "expo-file-system";

export const removeBracketsAndSpaces = str => str.replace(/[\s\[\]]/g, "");

export const getColorByBgColor = bgColor => {
  if (!bgColor) {
    return "#000";
  }
  return parseInt(bgColor.replace("#", ""), 16) > 0xffffff / 2
    ? "#000"
    : "#fff";
};

export const trim1 = (s: string) => {
  const removeFirstChar = s.substr(1);
  const removeLastChar = removeFirstChar.substr(0, removeFirstChar.length - 1);
  return removeLastChar;
};

export const clearTextInput = input => {
  if (input !== null) {
    input.clear();
    input._root && input._root.clear();
    if (Platform.OS === "ios") {
      input.setNativeProps({ text: " " });
      setTimeout(() => {
        input.setNativeProps({ text: "" });
      }, 5);
    }

    input.blur();
  }
};

export const movePhotoFrom = async fromUrl => {
  const to = `${FileSystem.documentDirectory}photos/${Date.now()}.jpg`;
  await FileSystem.moveAsync({
    from: fromUrl,
    to
  }).catch(e => console.log("Error: ", e));

  console.log("moved file from ", fromUrl, " to ", to);

  return to;
};

export const isBase64 = urlOrBase64 =>
  urlOrBase64
    ? !["http", "file", "cont"].includes(urlOrBase64.substring(0, 4))
    : false;

export const appendIfBase64 = (urlOrBase64: string) => {
  const base64Appendix = isBase64(urlOrBase64) ? "data:image/jpg;base64," : "";
  const completeUri = base64Appendix + urlOrBase64;
  return completeUri;
};
