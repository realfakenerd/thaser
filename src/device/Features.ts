import { CanvasPool } from '@thaser/display';
import Browser from './Browser';
import OS from './OS';

/**
 * Determines the features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.features` from within any Scene.
 */
interface FeaturesDef {
  /**
   * True if canvas supports a 'copy' bitblt onto itself when the source and destination regions overlap.
   */
  canvasBitBltShift: boolean | null;
  /**
   * Is canvas available?
   */
  canvas: boolean;
  /**
   * Is file available?
   */
  file: boolean;
  /**
   * Is fileSystem available?
   */
  fileSystem: boolean;
  /**
   * Does the device support the getUserMedia API?
   */
  getUserMedia: boolean;
  /**
   * Is the device big or little endian? (only detected if the browser supports TypedArrays)
   */
  littleEndian: boolean;
  /**
   * Is localStorage available?
   */
  localStorage: boolean;
  /**
   * Is Pointer Lock available?
   */
  pointerLock: boolean;
  /**
   * Does the device context support 32bit pixel manipulation using array buffer views?
   */
  support32bit: boolean;
  /**
   * Does the device support the Vibration API?
   */
  vibration: boolean;
  /**
   * Is webGL available?
   */
  webGL: boolean;
  /**
   * Is worker available?
   */
  worker: boolean;
}

const Features: FeaturesDef = {
  canvasBitBltShift: null,
  canvas: false,
  file: false,
  fileSystem: false,
  getUserMedia: false,
  littleEndian: false,
  localStorage: false,
  pointerLock: false,
  support32bit: false,
  vibration: false,
  webGL: false,
  worker: false
};

function checkIsLittleEndian() {
  const a = new ArrayBuffer(4);
  const b = new Uint8Array(a);
  const c = new Uint32Array(a);

  b[0] = 0xa1;
  b[1] = 0xb2;
  b[2] = 0xc3;
  b[3] = 0xd4;

  if (c[0] === 0xd4c3b2a1) return true;
  if (c[0] === 0xa1b2c3d4) return false;
  else return null;
}

function init() {
  // @ts-ignore
  if (typeof importScripts === 'function') return Features;

  Features.canvas = !!window['CanvasRenderingContext2D'];

  try {
    Features.localStorage = !!localStorage.getItem;
  } catch (error) {
    Features.localStorage = false;
  }

  Features.file =
    !!window['File'] &&
    !!window['FileReader'] &&
    !!window['FileList'] &&
    !!window['Blob'];

  //@ts-ignore
  Features.fileSystem = !!window['requestFileSystem'];

  let isUint8 = false;

  function testWebGL(this: any) {
    if (window['WebGLRenderingContext']) {
      try {
        const canvas = CanvasPool.createWebGL(this);

        const ctx =
          canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

        const canvas2D = CanvasPool.create2D(this);

        const ctx2D = canvas2D.getContext('2d')!;

        //  Can't be done on a webgl context
        const image = ctx2D.createImageData(1, 1);

        //  Test to see if ImageData uses CanvasPixelArray or Uint8ClampedArray.
        //  @author Matt DesLauriers (@mattdesl)
        isUint8 = image.data instanceof Uint8ClampedArray;

        CanvasPool.remove(canvas);
        CanvasPool.remove(canvas2D);

        return !!ctx;
      } catch (e) {
        return false;
      }
    }

    return false;
  }

  Features.webGL = testWebGL();

  Features.worker = !!window['Worker'];

  Features.pointerLock =
    'pointerLockElement' in document ||
    'mozPointerLockElement' in document ||
    'webkitPointerLockElement' in document;

  //@ts-ignore
  navigator.getUserMedia =
    //@ts-ignore
    navigator.getUserMedia ||
    //@ts-ignore
    navigator.webkitGetUserMedia ||
    //@ts-ignore
    navigator.mozGetUserMedia ||
    //@ts-ignore
    navigator.msGetUserMedia ||
    //@ts-ignore
    navigator.oGetUserMedia;

  //@ts-ignore
  window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

  Features.getUserMedia =
    //@ts-ignore
    Features.getUserMedia && !!navigator.getUserMedia && !!window.URL;

  // Older versions of firefox (< 21) apparently claim support but user media does not actually work
  if (Browser.firefox && Browser.firefoxVersion < 21) {
    Features.getUserMedia = false;
  }

  // Excludes iOS versions as they generally wrap UIWebView (eg. Safari WebKit) and it
  // is safer to not try and use the fast copy-over method.
  if (!OS.iOS && (Browser.ie || Browser.firefox || Browser.chrome)) {
    Features.canvasBitBltShift = true;
  }

  // Known not to work
  if (Browser.safari || Browser.mobileSafari) {
    Features.canvasBitBltShift = false;
  }

  navigator.vibrate =
    navigator.vibrate ||
    //@ts-ignore
    navigator.webkitVibrate ||
    //@ts-ignore
    navigator.mozVibrate ||
    //@ts-ignore
    navigator.msVibrate;

  //@ts-ignore
  if (navigator.vibrate) {
    Features.vibration = true;
  }

  if (
    typeof ArrayBuffer !== 'undefined' &&
    typeof Uint8Array !== 'undefined' &&
    typeof Uint32Array !== 'undefined'
  ) {
    //@ts-ignore
    Features.littleEndian = checkIsLittleEndian();
  }

  Features.support32bit =
    typeof ArrayBuffer !== 'undefined' &&
    typeof Uint8ClampedArray !== 'undefined' &&
    typeof Int32Array !== 'undefined' &&
    Features.littleEndian !== null &&
    isUint8;

  return Features;
}

export default init();
