import Browser from './Browser';

/**
 * Determines the input support of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.input` from within any Scene.
 */
interface InputDef {
  wheelEvent: string;
  /**
   * The newest type of Wheel/Scroll event supported: 'wheel', 'mousewheel', 'DOMMouseScroll'
   */
  wheelType: string | null;
  /**
   * Is navigator.getGamepads available?
   */
  gamepads: boolean;
  /**
   * Is mspointer available?
   */
  mspointer: boolean;
  /**
   * Is touch available?
   */
  touch: boolean;
}

const Input: InputDef = {
  wheelType: null,
  gamepads: false,
  mspointer: false,
  touch: false,
  wheelEvent: ''
};

function init() {
  //@ts-expect-error
  if (typeof importScripts === 'function') return Input;

  if (
    'ontouchstart' in document.documentElement ||
    (navigator.maxTouchPoints && navigator.maxTouchPoints >= 1)
  ) {
    Input.touch = true;
  }

  //@ts-expect-error
  if (navigator.msPointerEnabled || navigator.pointerEnabled) {
    Input.mspointer = true;
  }

  //@ts-expect-error
  if (navigator.getGamepads) {
    Input.gamepads = true;
  }

  // See https://developer.mozilla.org/en-US/docs/Web/Events/wheel
  if ('onwheel' in window || (Browser.ie && 'WheelEvent' in window)) {
    // DOM3 Wheel Event: FF 17+, IE 9+, Chrome 31+, Safari 7+

    Input.wheelEvent = 'wheel';
  } else if ('onmousewheel' in window) {
    // Non-FF legacy: IE 6-9, Chrome 1-31, Safari 5-7.

    Input.wheelEvent = 'mousewheel';
  } else if (Browser.firefox && 'MouseScrollEvent' in window) {
    // FF prior to 17. This should probably be scrubbed.
    Input.wheelEvent = 'DOMMouseScroll';
  }

  return Input;
}

export default init()