/**
 * bitmask flag for GameObject.renderMask
 */
const _FLAG = 1; // 0001

/**
 * Provides methods used for setting the visibility of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class Visible {
  /**
   * Private internal value. Holds the visible value.
   */
  private static _visible: boolean = true;
  private static renderFlags: number;
  /**
   * The visible state of the Game Object.
   *
   * An invisible Game Object will skip rendering, but will still process update logic.
   */
  static get visible() {
    return this._visible;
  }
  static set visible(value: boolean) {
    if (value) {
      this._visible = true;
      this.renderFlags |= _FLAG;
    } else {
      this._visible = false;
      this.renderFlags &= ~_FLAG;
    }
  }
  /**
   * Sets the visibility of this Game Object.
   *
   * An invisible Game Object will skip rendering, but will still process update logic.
   * @param value The visible state of the Game Object.
   */
  static setVisible(value: boolean) {
    this.visible = value;
    return this;
  }
}
