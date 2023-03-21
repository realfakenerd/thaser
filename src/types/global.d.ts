import { prototype } from 'eventemitter3';

/* Defining a type for a function that takes a parent, key, value, and any number of other arguments. */
declare type DataEachCallback = (
  parent: any,
  key: string,
  value: any,
  ...args: any[]
) => void;

interface Window {
  FORCE_WEBGL: boolean;
  FORCE_CANVAS: boolean;

  mozURL: any;
  msURL: any;
}

interface Screen {
  mozOrientation: string;
  msOrientation: string;
  webkitOrientation: string;

  lockOrientation: any;
  mozLockOrientation: any;
  msLockOrientation: any;
  webkitLockOrientation: any;
}

interface Document {
  mozFullScreenElement: Element;
  msFullscreenElement: Element;
  webkitFullscreenElement: Element;
}

interface Navigator {
  getUserMedia: any;
  webkitGetUserMedia: any;
  mozGetUserMedia: any;
  msGetUserMedia: any;
  oGetUserMedia: any;
}
