import OS from "./OS";

/**
 * Determines the browser type and version running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.browser` from within any Scene.
 */
interface BrowserDef {
  /**
   * Set to true if running in Chrome.
   */
  chrome: boolean;
  /**
   * Set to true if running in Microsoft Edge browser.
   */
  edge: boolean;
  /**
   * Set to true if running in Firefox.
   */
  firefox: boolean;
  /**
   * Set to true if running in Internet Explorer 11 or less (not Edge).
   */
  ie: boolean;
  /**
   * Set to true if running in Mobile Safari.
   */
  mobileSafari: boolean;
  /**
   * Set to true if running in Opera.
   */
  opera: boolean;
  /**
   * Set to true if running in Safari.
   */
  safari: boolean;
  /**
   * Set to true if running in the Silk browser (as used on the Amazon Kindle)
   */
  silk: boolean;
  /**
   * Set to true if running a Trident version of Internet Explorer (IE11+)
   */
  trident: boolean;
  /**
   * If running in Chrome this will contain the major version number.
   */
  chromeVersion: number;
  /**
   * If running in Firefox this will contain the major version number.
   */
  firefoxVersion: number;
  /**
   * If running in Internet Explorer this will contain the major version number. Beyond IE10 you should use Browser.trident and Browser.tridentVersion.
   */
  ieVersion: number;
  /**
   * If running in Safari this will contain the major version number.
   */
  safariVersion: number;
  /**
   * If running in Internet Explorer 11 this will contain the major version number. See {@link http://msdn.microsoft.com/en-us/library/ie/ms537503(v=vs.85).aspx}
   */
  tridentVersion: number;
}

const Browser: BrowserDef = {
  chrome: false,
  edge: false,
  firefox: false,
  ie: false,
  mobileSafari: false,
  opera: false,
  safari: false,
  silk: false,
  trident: false,
  chromeVersion: 0,
  firefoxVersion: 0,
  ieVersion: 0,
  safariVersion: 0,
  tridentVersion: 0
};

function init() {
  const ua = navigator.userAgent;

  if (/Edge\/\d+/.test(ua)) {
    Browser.edge = true;
  } else if (/Chrome\/(\d+)/.test(ua) && !OS.windowsPhone) {
    Browser.chrome = true;
    Browser.chromeVersion = parseInt(RegExp.$1, 10);
  } else if (/Firefox\D+(\d+)/.test(ua)) {
    Browser.firefox = true;
    Browser.firefoxVersion = parseInt(RegExp.$1, 10);
  } else if (/AppleWebKit/.test(ua) && OS.iOS) {
    Browser.mobileSafari = true;
  } else if (/MSIE (\d+\.\d+);/.test(ua)) {
    Browser.ie = true;
    Browser.ieVersion = parseInt(RegExp.$1, 10);
  } else if (/Opera/.test(ua)) {
    Browser.opera = true;
  } else if (/Safari/.test(ua) && !OS.windowsPhone) {
    Browser.safari = true;
  } else if (/Trident\/(\d+\.\d+)(.*)rv:(\d+\.\d+)/.test(ua)) {
    Browser.ie = true;
    Browser.trident = true;
    Browser.tridentVersion = parseInt(RegExp.$1, 10);
    Browser.ieVersion = parseInt(RegExp.$3, 10);
  }

  //  Silk gets its own if clause because its ua also contains 'Safari'
  if (/Silk/.test(ua)) {
    Browser.silk = true;
  }

  return Browser;
}

export default init();