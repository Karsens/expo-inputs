/**
 * **Before:**
- [x] Improve caching. Try to save base64 in redux. [this](https://stackoverflow.com/questions/54760743/react-native-expo-convert-url-image-to-base64)
- [x] Image Leckr-Input should return local url, remote url, and base64 for small (100x100), medium (300x300) and big (1200x1200)
- [x] Define responsibility of all different image fields
- [x] Define types/params of image fields
- [x] Image should be able to have custom aspect ratio, not just square:boolean... -_-
- [x] Rename onchange, its too vague
- [x] It should be an option. whether to show it like an image or a coverImage (or later, differently)
- [x] Put both coverImage and image in this `imageField`. 
- [x] Just import expo everywhere, with an extra check if it exists, so it can be used from peerDependencies, so it doesn't have to be given as a variable.
- [x] Type `onChange` right: `ImageObject[]`, where `ImageObject` is `{ width, height, ratio, localUrl, base64, remoteUrl }` or so.

**Tuesday 30 april 2019**
- [x] Image should be able to have custom sizes, and only upload the necessary ones
- [x] Make uploading optional
- [x] Add base64 support
- [x] Upload `3.0.0`
- [x] Make function of mapFieldsToDB
- [x] turn off uploading for Dunbar
- [x] Add documentation for images mapFieldsToDB
- [x] Add support for mapFieldsToDB-function in `react-native-data-forms`.
- [x] Simplify `image.input.tsx` to adhere new typings
- [x] Remove support for things without mapFieldsToDB
- [x] Test UI of both options on iOS
- [x] Fix coverImage alignment
- [x] Fix coverImage margin
- [x] put `isBase64 = (base64OrUrl: string) => boolean` in util
- [x] put `appendIfBase64` in util too
- [x] Fix seeing base64 stuff in `image.screen` too
- [x] Update codebase Dunbar to adhere base64 format

- [ ] Figure out at which types we currently use mapFieldsToDB 
- [ ] Decide who is responsible for the mapping, and when it should happen. Could it be done in `data-forms`? Or better in the `leckr-input` itself? Don't do it twice! Also, do it as late as possible, right?
- [ ] Fix this, and document how it works now
- [ ] Fix saving of the image
- [ ] Make sure other mapFieldsToDB things still work too
- [ ] Add base64 pics everywhere, see if home screen becomes really fast
- [ ] Test Android
- [ ] Deploy on expo, test on compiled versions on Android + iOS
- [ ] Test it all

#improvement
The moment the image is sent back it's still the uncompressed one. it flickers because it compresses and switches it. fix this. it doesn't need to show the compressed one...it just needs to send it.

#later
- [ ] Make sure that cropping (and a 1:1 ratio) can be enforced, if needed
- [ ] Make options to instantly go to either library or camera
- [ ] Put the uploading in a util function, since I could wanna do it later.
- [ ] Separate UI and logic so that it's easier to add more (external) UI

 */

import React from "react";
import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Text,
  Image,
  Dimensions
} from "react-native";

import { FontAwesome } from "react-native-vector-icons";
import { ImageObject, ImageInputOptions } from "../types";
import { appendIfBase64 } from "../utils";

const { width } = Dimensions.get("screen");

const IMAGE_THUMB_SIZE = 90;

/**
 * #todo this really needs better typing, this is unworkable unless you're on top of it.
 */
type Props = {
  value: any,
  state: any,
  setFormState: any,
  navigation: any,

  field: any,

  firebaseConfig: any,
  // Firebase Config Object, if upload is enabled

  options: ImageInputOptions,
  mapFieldsToDB: (newArray: ImageObject[]) => Object
};

/**
 * Either a coverImage input or a normal image input.
 */
class ImageInput extends React.Component<Props> {
  // nb: it mounts a lot, so I probably made an architectural mistake
  componentDidMount() {
    console.log("_________MountedImageInput___________");
  }

  onChange = (newImageObjectArray: ImageObject[]) => {
    const { field, setFormState, mapFieldsToDB } = this.props;

    const objectLengths = newImageObjectArray.map(imageObject => ({
      localUrl: imageObject.localUrl,
      base64: imageObject.base64 && imageObject.base64.length
    }));
    console.log("onChange was called", objectLengths);

    // const DB = mapFieldsToDB(newImageObjectArray);

    setFormState({ [field]: newImageObjectArray });
  };

  renderImageOrPlaceholder(imageBase64OrUrl: string, isNotUploaded) {
    const { options } = this.props;

    const completeUri = imageBase64OrUrl && appendIfBase64(imageBase64OrUrl);
    const showCoverImage = options.renderType === "cover";

    const imageWidth = showCoverImage ? width : IMAGE_THUMB_SIZE;
    const ratio = this.props.options.defaultImageRatio;
    const heightThroughRatio = (imageWidth / ratio[0]) * ratio[1];

    const formFactor = {
      width: imageWidth,
      height: heightThroughRatio,
      borderRadius: showCoverImage ? 0 : imageWidth / 2
    };

    const defaultImage = imageBase64OrUrl ? (
      <View
        style={{
          ...formFactor,
          backgroundColor: "#CCC",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image source={{ uri: completeUri }} style={formFactor} />

        {isNotUploaded ? (
          <View style={{ position: "absolute" }}>
            <ActivityIndicator />
          </View>
        ) : null}
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

    const coverImage = imageBase64OrUrl ? (
      <View
        style={{
          ...formFactor,
          backgroundColor: "#CCC",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Image
          source={{ uri: completeUri }}
          style={formFactor}
          resizeMode="cover"
        />

        {isNotUploaded ? (
          <View style={{ position: "absolute" }}>
            <ActivityIndicator />
          </View>
        ) : null}
      </View>
    ) : (
      <View
        style={{
          width: "100%",
          height: 50,
          backgroundColor: "white",
          paddingHorizontal: 15,
          paddingVertical: 10,
          justifyContent: "center"
        }}
      >
        <FontAwesome name="camera" size={16} />
      </View>
    );

    return showCoverImage ? coverImage : defaultImage;
  }

  render() {
    const {
      value,
      state,
      navigation,
      firebaseConfig,
      options,
      field
    } = this.props;

    if (options.uploadImages && !firebaseConfig) {
      const error =
        "This input-type only works with expo, and if you're uploading, you also need firebaseConfig";
      console.log(error, "firebaseconfig?", !!firebaseConfig);
      return <Text>{error}</Text>;
    }

    //how to get currentUrl and isNotUploaded?
    // console.log(value, "state=", state);
    const isNotUploaded = options.uploadImages && !state._imagesAreUploaded; //#todo not implemented yet

    //#todo make removing the image work again too.
    //NB: imageState has a different type than the value.
    const imageState: ImageObject[] = state[field];
    const latestImage: ImageObject =
      imageState && imageState[imageState.length - 1];
    const imageOrBase64: string = latestImage && latestImage.base64;

    const stateBase64OrValue = imageOrBase64 || value;
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();

            setTimeout(() => {
              navigation.navigate({
                key: "Image",
                routeName: "Image",
                params: {
                  urlOrBase64: stateBase64OrValue,
                  onChange: this.onChange,
                  firebaseConfig,
                  options
                }
              });
            }, 100); //timeout needed because keyboard needs to be dismissed, it goes wrong with asynchronicity
          }}
        >
          {this.renderImageOrPlaceholder(stateBase64OrValue, isNotUploaded)}
        </TouchableOpacity>
      </View>
    );
  }
}

export default ImageInput;
