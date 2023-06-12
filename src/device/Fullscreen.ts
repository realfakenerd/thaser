/**
 * Determines the full screen support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.fullscreen` from within any Scene.
 */
interface FullscreenDef {
  /**
   * Does the browser support the Full Screen API?
   */
  available: boolean;
  /**
   * Does the browser support access to the Keyboard during Full Screen mode?
   */
  keyboard: boolean;
  /**
   * If the browser supports the Full Screen API this holds the call you need to use to cancel it.
   */
  cancel: string;
  /**
   * If the browser supports the Full Screen API this holds the call you need to use to activate it.
   */
  request: string;
}

const Fullscreen: FullscreenDef = {
  available: false,
  keyboard: false,
  cancel: '',
  request: ''
};

function init() {
  if (typeof importScripts === 'function') return Fullscreen;

  let i;

  let suffix1 = 'Fullscreen';
  let suffix2 = 'FullScreen';

  const fs = [
    'request' + suffix1,
    'request' + suffix2,
    'webkitRequest' + suffix1,
    'webkitRequest' + suffix2,
    'msRequest' + suffix1,
    'msRequest' + suffix2,
    'mozRequest' + suffix2,
    'mozRequest' + suffix1
  ];

  for (i = 0; i < fs.length; i++) {
    if (document.documentElement[fs[i]]) {
      Fullscreen.available = true;
      Fullscreen.request = fs[i];
      break;
    }
  }

  let cfs = [
    'cancel' + suffix2,
    'exit' + suffix1,
    'webkitCancel' + suffix2,
    'webkitExit' + suffix1,
    'msCancel' + suffix2,
    'msExit' + suffix1,
    'mozCancel' + suffix2,
    'mozExit' + suffix1
  ];

  if (Fullscreen.available) {
    for (i = 0; i < cfs.length; i++) {
      if (document[cfs[i]]) {
        Fullscreen.cancel = cfs[i];
        break;
      }
    }
  }

  //  Keyboard Input?
  //  Safari 5.1 says it supports fullscreen keyboard, but is lying.
  if (
    window['Element'] &&
    Element['ALLOW_KEYBOARD_INPUT'] &&
    !/ Version\/5\.1(?:\.\d+)? Safari\//.test(navigator.userAgent)
  ) {
    Fullscreen.keyboard = true;
  }

  Object.defineProperty(Fullscreen, 'active', {
    get: function () {
      return !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
    }
  });

  return Fullscreen;
}

export default init();