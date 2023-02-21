/**
 * Determines the operating system of the device running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.os` from within any Scene.
 */
interface OSDef {
  /**
   * Is running on android?
   */
  android: boolean;
  /**
   * Is running on chromeOS?
   */
  chromeOS: boolean;
  /**
   * Is the game running under Apache Cordova?
   */
  cordova: boolean;
  /**
   * Is the game running under the Intel Crosswalk XDK?
   */
  crosswalk: boolean;
  /**
   * Is running on a desktop?
   */
  desktop: boolean;
  /**
   * Is the game running under Ejecta?
   */
  ejecta: boolean;
  /**
   * Is the game running under GitHub Electron?
   */
  electron: boolean;
  /**
   * Is running on iOS?
   */
  iOS: boolean;
  /**
   * Is running on iPad?
   */
  iPad: boolean;
  /**
   * Is running on iPhone?
   */
  iPhone: boolean;
  /**
   * Is running on an Amazon Kindle?
   */
  kindle: boolean;
  /**
   * Is running on linux?
   */
  linux: boolean;
  /**
   * Is running on macOS?
   */
  macOS: boolean;
  /**
   * Is the game running under Node.js?
   */
  node: boolean;
  /**
   * Is the game running under Node-Webkit?
   */
  nodeWebkit: boolean;
  /**
   * Set to true if running as a WebApp, i.e. within a WebView
   */
  webApp: boolean;
  /**
   * Is running on windows?
   */
  windows: boolean;
  /**
   * Is running on a Windows Phone?
   */
  windowsPhone: boolean;
  /**
   * If running in iOS this will contain the major version number.
   */
  iOSVersion: number;
  /**
   * PixelRatio of the host device?
   */
  pixelRatio: number;
}

const OS: OSDef = {
  android: false,
  chromeOS: false,
  cordova: false,
  crosswalk: false,
  desktop: false,
  ejecta: false,
  electron: false,
  iOS: false,
  iPad: false,
  iPhone: false,
  kindle: false,
  linux: false,
  macOS: false,
  node: false,
  nodeWebkit: false,
  webApp: false,
  windows: false,
  windowsPhone: false,
  iOSVersion: 0,
  pixelRatio: 0
};

function init() {
  //@ts-expect-error
  if (typeof importScripts === 'function') return OS;
  const ua = navigator.userAgent;

  if (/Windows/.test(ua)) {
    OS.windows = true;
  } else if (/Mac OS/.test(ua) && !/like Mac OS/.test(ua)) {
    //  Because iOS 13 identifies as Mac OS:
    if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
      OS.iOS = true;
      OS.iPad = true;

      navigator.appVersion.match(/Version\/(\d+)/);

      OS.iOSVersion = parseInt(RegExp.$1, 10);
    } else {
      OS.macOS = true;
    }
  } else if (/Android/.test(ua)) {
    OS.android = true;
  } else if (/Linux/.test(ua)) {
    OS.linux = true;
  } else if (/iP[ao]d|iPhone/i.test(ua)) {
    OS.iOS = true;

    navigator.appVersion.match(/OS (\d+)/);

    OS.iOSVersion = parseInt(RegExp.$1, 10);

    OS.iPhone = ua.toLowerCase().indexOf('iphone') !== -1;
    OS.iPad = ua.toLowerCase().indexOf('ipad') !== -1;
  } else if (
    /Kindle/.test(ua) ||
    /\bKF[A-Z][A-Z]+/.test(ua) ||
    /Silk.*Mobile Safari/.test(ua)
  ) {
    OS.kindle = true;

    // This will NOT detect early generations of Kindle Fire, I think there is no reliable way...
    // E.g. "Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_3; en-us; Silk/1.1.0-80) AppleWebKit/533.16 (KHTML, like Gecko) Version/5.0 Safari/533.16 Silk-Accelerated=true"
  } else if (/CrOS/.test(ua)) {
    OS.chromeOS = true;
  }

  if (/Windows Phone/i.test(ua) || /IEMobile/i.test(ua)) {
    OS.android = false;
    OS.iOS = false;
    OS.macOS = false;
    OS.windows = true;
    OS.windowsPhone = true;
  }

  const silk = /Silk/.test(ua);

  if (OS.windows || OS.macOS || (OS.linux && !silk) || OS.chromeOS) {
    OS.desktop = true;
  }

  //  Windows Phone / Table reset
  if (OS.windowsPhone || (/Windows NT/i.test(ua) && /Touch/i.test(ua))) {
    OS.desktop = false;
  }

  //  WebApp mode in iOS
  //@ts-expect-error
  if (navigator.standalone) {
    OS.webApp = true;
  }

  //@ts-expect-error
  if (typeof importScripts !== 'function') {
    //@ts-expect-error
    if (window.cordova !== undefined) OS.cordova = true;

    //@ts-expect-error
    if (window.ejecta !== undefined) OS.ejecta = true;
  }

  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    OS.node = true;
  }

  if (OS.node && typeof process.versions === 'object') {
    OS.nodeWebkit = !!process.versions['node-webkit'];

    OS.electron = !!process.versions.electron;
  }

  if (/Crosswalk/.test(ua)) OS.crosswalk = true;

  OS.pixelRatio = window['devicePixelRatio'] || 1;

  return OS;
}

export default init()