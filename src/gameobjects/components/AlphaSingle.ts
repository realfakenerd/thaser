import { Clamp } from "@thaser/math";

const _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha property of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class AlphaSingle {
  /** Private internal value. Holds the global alpha value. */
  private _alpha = 1;

  /**
   * Clears all alpha values associated with this Game Object.
   *
   * Immediately sets the alpha levels back to 1 (fully opaque).
   */
  clearAlpha() {
    return this.setAlpha(1);
  }
  /**
   * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders.
   * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
   * @param value The alpha value applied across the whole Game Object. Default 1.
   */
  setAlpha(value = 1) {
    this.alpha = value;
    return this;
  }
  /**
   * The alpha value of the Game Object.
   *
   * This is a global value, impacting the entire Game Object, not just a region of it.
   */
  get alpha() {
    return this._alpha;
  }
  set alpha(value) {
      const v = Clamp(value, 0, 1);
      this._alpha = v;
      if(v===0) this.renderFlags &= ~_FLAG;
      else this.renderFlags |= _FLAG;
  }
}
