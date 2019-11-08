import React from "react";

import * as IntentLauncher from "expo-intent-launcher";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as MediaLibrary from "expo-media-library";

import {
  Platform,
  Image,
  View,
  TouchableOpacity,
  Linking,
  Alert,
  Dimensions
} from "react-native";

import { FontAwesome } from "react-native-vector-icons";

//imageupload stuff
import uuid from "uuid";

import SuperActionSheet, { Option } from "react-native-super-actionsheet";

// relative

import { C } from "../constants";
import Button from "../button.component";
import { movePhotoFrom, appendIfBase64 } from "../utils";
import { ImageObject, ImageInputOptions, ImageSizeObject } from "../types";

const { width } = Dimensions.get("screen");

type Props = {
  navigation: {
    goBack: () => void,
    navigate: (options: Object) => void,
    setParams: (params: Object) => void,
    state: {
      params: {
        firebaseConfig: Object,
        options: ImageInputOptions,
        urlOrBase64: string,
        onChange: (output: ImageObject[]) => void
      }
    }
  }
};

type State = {
  urlOrBase64: string,
  options: Object[]
};

/**
 * Needed to go to a screen where the full picture is shown,
 * and where you can decide to take a picture or choose a pic from the library.
 */

class ImageScreen extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      options: null,
      urlOrBase64: null
    };

    this.pickImage = this.pickImage.bind(this);
    this.takePicture = this.takePicture.bind(this);
    this.pressEdit = this.pressEdit.bind(this);
  }

  BUTTONS = [
    {
      text: "Cancel",
      onPress: () => console.log("canceled")
    },
    {
      text: "Open Settings",
      onPress: () => {
        Platform.OS === "ios"
          ? Linking.openURL("app-settings:")
          : IntentLauncher.startActivityAsync(
              IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS
            );
      }
    }
  ];

  componentDidMount() {
    const { urlOrBase64 } = this.props.navigation.state.params;

    this.props.navigation.setParams({ pressEdit: this.pressEdit });

    if (!urlOrBase64) {
      this.pressEdit();
    }

    this.setState({
      urlOrBase64: this.props.navigation.state.params.urlOrBase64
    });

    this.getFirebase();
  }

  getFirebase = async () => {
    let firebase;
    if (Platform.OS !== "web") {
      firebase = await import("firebase");
      this.setState({ firebase: firebase });
    }

    if (firebase) {
      const { firebaseConfig, options } = this.props.navigation.state.params;

      if (options.uploadImages && firebaseConfig) {
        try {
          firebase.initializeApp(firebaseConfig);
        } catch (e) {
          // sometimes, if you have 2 image components in the form, this could be initialized twice, which will raise an error.
          console.log("catched initializeApp error: ", e);
        }
      }
    }
  };

  static navigationOptions = ({
    navigation: {
      state: { params }
    }
  }) => ({
    title: params?.title !== undefined ? params.title : "Select a picture",
    headerRight: params?.noEdit ? (
      undefined
    ) : (
      <Button onPress={() => params.pressEdit()} title="Edit" />
    )
  });

  uploadImageAsync = async uri => {
    const { firebase } = this.state;

    if (!firebase) {
      Alert.alert(
        "Error",
        "This doesn't work yet on the web. Download the app!"
      );
      return null;
    }

    console.log("URI:", uri);
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log("XHR ERROR"); //e); //NB: For e to log, turn on debugger!
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child(uuid.v4());
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    return await snapshot.ref.getDownloadURL();
  };

  pickImage = async () => {
    const { options } = this.props.navigation.state.params;

    const havePermission = await this.havePermission(Permissions.CAMERA_ROLL);

    if (havePermission) {
      //all good

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: options && options.defaultImageRatio,
        quality: options && options.quality,
        allowsEditing: (options && options.allowsEditing) || true,
        base64: true
      });

      if (!result.cancelled) {
        this.uploadAndReturn({ uri: result.uri, base64: result.base64 });
      }
    } else {
      Alert.alert(
        "Permission needed",
        "To select a picture, I need camera roll access",
        this.BUTTONS
      );
    }
  };

  async havePermission(type) {
    const have = await Permissions.getAsync(type);

    if (have.status !== "granted") {
      const asked = await Permissions.askAsync(type);

      if (asked.status === "granted") {
        return true;
      } else {
        console.log("no permission. ", asked.status);
        return false;
      }
    } else {
      return true;
    }
  }

  uploadAndReturn = async ({ uri, base64 }) => {
    const {
      goBack,
      state: {
        params: { options, onChange }
      }
    } = this.props.navigation;

    const movedUrl = await movePhotoFrom(uri);

    this.setState({ urlOrBase64: movedUrl }, async () => {
      const imageObjectArray: ImageObject[] = options.imageSizes.map(size => ({
        ...size,
        localUrl: movedUrl,
        remoteUrl: undefined,
        base64: undefined
      }));

      // preliminary feedback before uploading (it will show local image first)
      // maybe this is why it flickrs? #toPlan
      onChange(imageObjectArray); // local url

      goBack();

      Image.getSize(
        movedUrl,
        async (width, height) => {
          // #TODO: should I never make it bigger, or is that ok? seems inapropiate

          const resizedImagesPromises = options.imageSizes.map(async size => {
            const compressed = await ImageManipulator.manipulateAsync(
              movedUrl,
              [
                {
                  resize: { width: size.width, height: size.height }
                }
              ],
              {
                compress: 1,
                format: "jpeg",
                base64: true
              }
            );

            const movedCompressedUrl = await movePhotoFrom(compressed.uri);

            const remoteUrl =
              options.uploadImages && !size.doNotUpload
                ? await this.uploadImageAsync(compressed.uri)
                : undefined;

            return {
              width: size.width,
              height: size.height,
              key: size.key,
              localUrl: movedCompressedUrl,
              base64: compressed.base64,
              remoteUrl
            };
          });

          const resizedImageObjectArray = await Promise.all(
            resizedImagesPromises
          );

          onChange(resizedImageObjectArray);
        },
        error => console.log(error)
      );
    });
  };

  async takePicture() {
    const havePermission = await this.havePermission(Permissions.CAMERA);

    if (havePermission) {
      //all good
      this.props.navigation.navigate({
        routeName: "Camera",
        key: "Camera",
        params: { withUrl: this.uploadAndReturn }
      });
    } else {
      Alert.alert(
        "Permission needed",
        "To take a picture, I need camera access",
        this.BUTTONS
      );
    }
  }

  pressEdit() {
    //open modal to choose Delete photo (if available), Take photo or Choose photo

    let options: Option[] = [];

    const {
      goBack,
      state: {
        params: { urlOrBase64, onChange }
      }
    } = this.props.navigation;

    let n = 0;

    if (urlOrBase64) {
      options.push({
        index: n++,
        title: "Delete picture",
        destructive: true,
        onPress: () => {
          onChange([]);
          goBack();
        }
      });
    }

    options = options.concat([
      // doesn't work since Expo sdk 35
      // {
      //   index: n++,
      //   title: "Take picture",
      //   onPress: () => this.takePicture()
      // },
      {
        index: n++,
        title: "Choose picture",
        onPress: () => this.pickImage()
      },
      { index: n++, cancel: true, title: "Cancel" }
    ]);

    this.openActionSheet(options);
  }

  openActionSheet(options) {
    this.setState({ options }, () => this.ActionSheet.show());
  }

  async saveImage() {
    const { urlOrBase64 } = this.props.navigation.state.params;

    const havePermission = await this.havePermission(Permissions.CAMERA_ROLL);

    //#TODO: this shouldnt be possible with base64 you probably need summin else

    if (havePermission) {
      FileSystem.downloadAsync(
        urlOrBase64,
        FileSystem.documentDirectory + Date.now() + ".jpg"
      )
        .then(({ uri }) => {
          console.log("Finished downloading to ", uri);
          MediaLibrary.createAssetAsync(uri).catch(e => {
            console.log("err", e);
            Alert.alert("Failed to save image");
          });
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      Alert.alert(
        "Permission needed",
        "To download an image, I need camera roll access",
        this.BUTTONS
      );
    }
  }

  pressShare() {
    //open actionSheet to choose Copy or Save

    const options = [
      { index: 1, title: "Save picture", onPress: () => this.saveImage() },
      { index: 2, cancel: true, title: "Cancel" }
    ];

    return this.openActionSheet(options);
  }

  render() {
    const {
      navigation: {
        state: {
          params: { options }
        }
      }
    } = this.props;
    const { urlOrBase64 } = this.state;
    const rnActionSheet = (
      <SuperActionSheet
        reference={ref => (this.ActionSheet = ref)}
        data={this.state.options}
      />
    );

    const ratioHeight =
      (width / options.defaultImageRatio[0]) * options.defaultImageRatio[1];
    return urlOrBase64 ? (
      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <Image
          style={{
            height: ratioHeight,
            width,
            backgroundColor: "#DDD"
          }}
          resizeMode="contain"
          source={{ uri: appendIfBase64(urlOrBase64) }}
        />

        <TouchableOpacity
          style={{ margin: 5 }}
          onPress={() => this.pressShare()}
        >
          <FontAwesome name="share" color={C.BUTTON_COLOR} />
        </TouchableOpacity>

        {rnActionSheet}
      </View>
    ) : (
      <View>{rnActionSheet}</View>
    );
  }
}

export default ImageScreen;
