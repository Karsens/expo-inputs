/**
 * #later
 * Leckr-inputs & React-Native-Data-Forms (5h=>3h+):
- [x] Add react-native-super-actionsheet
- [x] New prop only needs to be used on iOS, on Android everything's fine.
- [x] Cant click selectOne on Android
- [x] Adding photo crashes on Android
- [x] Removing last letter TextArea not working
- [x] Deleting picture not working
- [x] Local pictures keep loading. LoadingIndicator check should be based on boolean uploaded that's set, not on whether or not the image is from a local source.
- [x] Add way to add Custom View to form that does something else, accepts any component and just renders it
- [x] ActionSheet values don't have to be numbers per sé. Should fix current settings.
- [x] Don't add `undefined` to dictionary
- [x] Dictionary deletion not working
- [ ] First dictionary must be emoji, build in validation for this when adding it.
- [ ] Add selectMultiple type inside another screen called `selectMultipleScreen`
- [ ] Add optional limit to selectMultiple/selectMultipleScreen/dictionary
- [ ] Taking picture on Android doesn't load picture. No crash, just not working.  Errors:
```
[Error: Directory 'file:///data/data/host.exp.exponent/files/ExperienceData/%2540wwoessi%252FDunbar1/photos' could not be created.] Directory exists
```
and
```
Firebase: Firebase App named '[DEFAULT]' already exists (app/duplicate-app).
```

#idea --> adapt UI of iOS Contact app edit screen. It's amazing!  
it also has cool features like contact sharing etc, but that's someting else. 
the input types themselves are just relaly good.

 *  */

import React from "react";

import * as Utils from "./utils";

//components
import Button from "./button.component";
import FadeInTitle from "./fade.in.title.component";
import Menu from "./menu.component";

//screens
import ImageScreen from "./screens/image.screen";
import CameraScreen from "./screens/camera.screen";
import LocationScreen from "./screens/location.screen";

//inputs
import DatePicker from "./inputs/date.picker";
import Dates from "./inputs/dates";
import Birthday from "./inputs/birthday";

import TextArea from "./inputs/text.area";
import Color from "./inputs/color";
import BooleanInput from "./inputs/boolean.input";
import SelectOne from "./inputs/select.one";
import ActionSheet from "./inputs/actionsheet";
import SelectMultiple from "./inputs/select.multiple";
import Categories from "./inputs/categories";
import Dictionary from "./inputs/dictionary";
import LocationInput from "./inputs/location";
import ImageInput from "./inputs/image.input";
import SimpleImage from "./inputs/image.simple";
import TextInput from "./inputs/text.input";
import Numbers from "./inputs/numbers";
import Phone from "./inputs/phone";
import Anything from "./inputs/anything";

import FieldComponent from "./field.component";

const screens = {
  Location: {
    screen: LocationScreen
  },

  Image: {
    screen: ImageScreen
  },

  Camera: {
    screen: CameraScreen,
    navigationOptions: { header: null }
  }
};

// here default props are given to input components, besides all props it gets from data-form and the field-object.
const inputs = ({ firebaseConfig, googlePlacesConfig, navigation }) => ({
  text: TextInput,
  date: DatePicker,
  dates: Dates,
  textArea: TextArea,
  color: Color,
  boolean: BooleanInput,
  selectOne: SelectOne,
  actionSheet: ActionSheet,
  selectMultiple: SelectMultiple,
  categories: Categories,
  dictionary: Dictionary,
  anything: Anything,
  birthday: Birthday,

  // NB: this extra layer is dangerous
  location: props => (
    <LocationInput
      googlePlacesConfig={googlePlacesConfig}
      navigation={navigation}
      {...props}
    />
  ),
  image: props => (
    <ImageInput
      firebaseConfig={firebaseConfig}
      navigation={navigation}
      {...props}
    />
  ),
  simpleImage: SimpleImage,
  numbers: Numbers,
  phone: Phone
});

const components = {
  Button,
  FadeInTitle,
  Menu
};

export { components, screens, inputs, FieldComponent, Utils };
