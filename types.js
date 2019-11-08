export type Firebase = {
  apiKey: string,
  authDomain: string,
  databaseURL: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string
};

export type GooglePlaces = {
  key: string
};

export type Value = {
  label: string,
  value: string | number
};

export type ImageSizeObject = {
  //width & height in pixels
  width: number,
  height: number,
  doNotUpload?: boolean,
  //if true, it doesnt upload and ignores options.uploadImages
  key: string
  // key under which image should be returned;
  // will be appended with 'RemoteUrl', 'LocalUrl' and 'Base64'
};

export type ImageObject = ImageSizeObject & {
  localUrl: string,
  base64: string,
  remoteUrl: string
};

// type FieldName = string;
export type ImageInputOptions = {
  imageSizes: ImageSizeObject[],
  // Can setup multiple sizes for the image to be transformed to.

  defaultImageRatio?: [number, number],
  // define aspect ratio (x,y).
  // it'll be square on iOS anyway because there's just one option: square
  // on Android, there's no default aspect ratio, so this will be used if given
  quality?: number, // if defined, image will be resized according to quality <0-1>
  allowsEditing?: boolean, // if false, editing not allowed. (default = true)
  uploadImages: boolean, // if true, images will be uploaded
  howToGetPicture: string, // can be either "library", "photo", or "both" (default)

  renderType: string // can be either "cover" or "default" (default)
};
