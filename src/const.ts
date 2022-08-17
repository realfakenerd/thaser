import { BlendModes, ScaleModes } from './renderer';

/** Global constants. */
const CONST = {
  /** BASE Phaser Release Version */
  VERSION: '3.60.0-beta.9',

  BlendModes,
  ScaleModes,

  /**
   *  This setting will auto-detect if the browser is capable of suppporting WebGL.
   * If it is, it will use the WebGL Renderer. If not, it will fall back to the Canvas Renderer.
   */
  AUTO: 0,

  /**
   * Forces Phaser to only use the Canvas Renderer, regardless if the browser supports
   * WebGL or not.
   */
  CANVAS: 1,

  /**
   * Forces Phaser to use the WebGL Renderer. If the browser does not support it, there is
   * no fallback to Canvas with this setting, so you should trap it and display a suitable
   * message to the user.
   */
  WEBGL: 2,

  /**
   * A Headless Renderer doesn't create either a Canvas or WebGL Renderer. However, it still
   * absolutely relies on the DOM being present and available. This mode is meant for unit testing,
   * not for running Phaser on the server, which is something you really shouldn't do.
   */
  HEADLESS: 3,

  /**
   * In Phaser the value -1 means 'forever' in lots of cases, this const allows you to use it instead
   * to help you remember what the value is doing in your code.
   */
  FOREVER: -1,

  /**
   * Direction constant.
   */
  NONE: 4,

  /**
   * Direction constant.
   */
  UP: 5,

  /**
   * Direction constant.
   */
  DOWN: 6,

  /**
   * Direction constant.
   */
  LEFT: 7,

  /**
   * Direction constant.
   */
  RIGHT: 8
};
export default CONST;