import { Clamp } from '@thaser/math';

const _FLAG = 2; // 0010

/**
 * Provides methods used for setting the alpha properties of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class Alpha {
  /**  Private internal value. Holds the global alpha value. */
  private _alpha = 1;

  /** Private internal value. Holds the top-left alpha value. */
  private _aphaTL = 1;

  /** Private internal value. Holds the top-right alpha value. */
  private _alphaTR = 1;

  /** Private internal value. Holds the bottom-left alpha value. */
  private _alphaBL = 1;

  /** Private internal value. Holds the bottom-right alpha value. */
  private _alphaBR = 1;

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
   *
   * If your game is running under WebGL you can optionally specify four different alpha values, each of which
   * correspond to the four corners of the Game Object. Under Canvas only the `topLeft` value given is used.
   * @param topLeft The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object. Default 1.
   * @param topRight The alpha value used for the top-right of the Game Object. WebGL only.
   * @param bottomLeft The alpha value used for the bottom-left of the Game Object. WebGL only.
   * @param bottomRight The alpha value used for the bottom-right of the Game Object. WebGL only.
   */
  setAlpha(
    topLeft = 1,
    topRight?: number,
    bottomLeft?: number,
    bottomRight?: number
  ) {
    if (topRight === undefined) this.alpha = topLeft;
    else {
      this._aphaTL = Clamp(topLeft, 0, 1);
      this._alphaTR = Clamp(topRight, 0, 1);
      this._alphaBL = Clamp(bottomLeft!, 0, 1);
      this._alphaBR = Clamp(bottomRight!, 0, 1);
    }

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
    this._aphaTL = v;
    this._alphaTR = v;
    this._alphaBL = v;
    this._alphaBR = v;

    if (v === 0) this.renderFlags &= ~_FLAG;
    else this.renderFlags |= _FLAG;
  }

  /**
   * The alpha value starting from the top-left of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  get alphaTopLeft() {
    return this._aphaTL;
  }
  set alphaTopLeft(value) {
    const v = Clamp(value, 0, 1);
    this._aphaTL = v;
    if (v !== 0) this.renderFlags |= _FLAG;
  }

  /**
   * The alpha value starting from the top-right of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  get alphaTopRight() {
    return this._alphaTR;
  }
  set alphaTopRight(value) {
    const v = Clamp(value, 0, 1);
    this._alphaTR = v;
    if (v !== 0) this.renderFlags |= _FLAG;
  }
  /**
   * The alpha value starting from the bottom-left of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  get alphaBottomLeft() {
    return this._alphaBL;
  }
  set alphaBottomLeft(value) {
    const v = Clamp(value, 0, 1);
    this._alphaBL = v;
    if (v !== 0) this.renderFlags |= _FLAG;
  }

  /**
   * The alpha value starting from the bottom-right of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  get alphaBottomRight() {
    return this._alphaBR;
  }
  set alphaBottomRight(value) {
    const v = Clamp(value, 0, 1);
    this._alphaBR = v;
    if (v !== 0) this.renderFlags |= _FLAG;
  }
}
