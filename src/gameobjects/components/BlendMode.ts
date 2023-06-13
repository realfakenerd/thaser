import { BlendModes } from '@thaser/renderer';

/**
 * Provides methods used for setting the blend mode of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class BlendMode {
  private static _blendMode = BlendModes.NORMAL;

  /**
   * Sets the Blend Mode being used by this Game Object.
   *
   * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
   *
   * Under WebGL only the following Blend Modes are available:
   *
   * * ADD
   * * MULTIPLY
   * * SCREEN
   * * ERASE
   *
   * Canvas has more available depending on browser support.
   *
   * You can also create your own custom Blend Modes in WebGL.
   *
   * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
   * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
   * reasons try to be careful about the construction of your Scene and the frequency of which blend modes
   * are used.
   */
  static get blendMode() {
    return this._blendMode;
  }
  static set blendMode(value: BlendModes | string) {
    if (typeof value === 'string') value = BlendModes[parseInt(value)];
    (value as BlendModes) |= 0;
    if (parseInt(value as string) >= -1) this._blendMode = value as BlendModes;
  }
  /**
   * Sets the Blend Mode being used by this Game Object.
   *
   * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
   *
   * Under WebGL only the following Blend Modes are available:
   *
   * * ADD
   * * MULTIPLY
   * * SCREEN
   * * ERASE (only works when rendering to a framebuffer, like a Render Texture)
   *
   * Canvas has more available depending on browser support.
   *
   * You can also create your own custom Blend Modes in WebGL.
   *
   * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
   * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
   * reasons try to be careful about the construction of your Scene and the frequency in which blend modes
   * are used.
   * @param value The BlendMode value. Either a string or a CONST.
   */
  static setBlendMode(value: string | BlendModes) {
    this.blendMode = value;
    return this;
  }
}
