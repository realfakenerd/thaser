import { InputColorObject } from '@thaser/types/display';
import GetColor from './GetColor';
import GetColor32 from './GetColor32';
import HSVToRGB from './HSVToRGB';
import RGBToHSV from './RGBToHSV';

/**
 * The Color class holds a single color value and allows for easy modification and reading of it.
 */
export default class Color {
  /**
   *
   * @param red The red color value. A number between 0 and 255. Default 0.
   * @param green The green color value. A number between 0 and 255. Default 0.
   * @param blue The blue color value. A number between 0 and 255. Default 0.
   * @param alpha The alpha value. A number between 0 and 255. Default 255.
   */
  constructor(red = 0, green = 0, blue = 0, alpha = 255) {
    this.setTo(red, green, blue, alpha);
  }

  /**
   * The internal red color value. A number between 0 and 255.
   */
  r = 0;
  /**
   * The internal green color value. A number between 0 and 255.
   */
  g = 0;
  /**
   * The internal blue color value. A number between 0 and 255.
   */
  b = 0;
  /**
   * The internal alpha color value. A number between 0 and 255.
   */
  private a = 255;

  /**
   * The hue color value. A number between 0 and 1.
   * This is the base color.
   */
  _h = 0;

  /**
   * The saturation color value. A number between 0 and 1.
   * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
   */
  _s = 0;

  /**
   * The lightness color value. A number between 0 and 1.
   * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
   */
  _v = 0;

  /** Is this color update locked? */
  private _locked = false;

  /**
   * An array containing the calculated color values for WebGL use.
   */
  gl: [number, number, number, number] = [0, 0, 0, 1];

  /** Pre-calculated internal color value */
  private _color = 0;

  /** Pre-calculated internal color32 value */
  private _color32 = 0;

  /** Pre-calculated interal color rgb string value */
  private _rgba = '';

  /**
   * Sets this color to be transparent. Sets all values to zero.
   */
  transparent() {
    this._locked = true;

    this.red = 0;
    this.green = 0;
    this.blue = 0;
    this.alpha = 0;

    this._locked = false;

    return this.update(true);
  }

  /**
   * Sets the color of this Color component.
   * @param red The red color value. A number between 0 and 255.
   * @param green The green color value. A number between 0 and 255.
   * @param blue The blue color value. A number between 0 and 255.
   * @param alpha The alpha value. A number between 0 and 255. Default 255.
   * @param updateHSV Update the HSV values after setting the RGB values? Default true.
   */
  setTo(
    red: number,
    green: number,
    blue: number,
    alpha = 255,
    updateHSV = true
  ) {
    this._locked = true;

    this.red = red;
    this.green = green;
    this.blue = blue;
    this.alpha = alpha;

    this._locked = false;

    return this.update(updateHSV);
  }

  /**
   * Sets the red, green, blue and alpha GL values of this Color component.
   * @param red The red color value. A number between 0 and 1.
   * @param green The green color value. A number between 0 and 1.
   * @param blue The blue color value. A number between 0 and 1.
   * @param alpha The alpha value. A number between 0 and 1. Default 1.
   */
  setGLTo(red: number, green: number, blue: number, alpha = 1) {
    this._locked = true;

    this.redGL = red;
    this.greenGL = green;
    this.blueGL = blue;
    this.alphaGL = alpha;

    this._locked = false;

    return this.update(true);
  }

  /**
   * Sets the color based on the color object given.
   * @param color An object containing `r`, `g`, `b` and optionally `a` values in the range 0 to 255.
   */
  setFromRGB(color: InputColorObject) {
    this._locked = true;

    this.red = color.r!;
    this.green = color.g!;
    this.blue = color.b!;

    if (color.hasOwnProperty('a')) {
      this.alpha = color.a!;
    }

    this._locked = false;

    return this.update(true);
  }

  /**
   * Sets the color based on the hue, saturation and lightness values given.
   * @param h The hue, in the range 0 - 1. This is the base color.
   * @param s The saturation, in the range 0 - 1. This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
   * @param v The value, in the range 0 - 1. This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
   */
  setFromHSV(h: number, s: number, v: number) {
    return HSVToRGB(h, s, v, this);
  }

  /**
   * Updates the internal cache values.
   */
  private update(updateHSV = false) {
    if (this._locked) {
      return this;
    }

    const r = this.r;
    const g = this.g;
    const b = this.b;
    const a = this.a;

    this._color = GetColor(r, g, b);
    this._color32 = GetColor32(r, g, b, a);
    this._rgba = `rgba(${r}, ${g}, ${b}, ${a / 255})`;

    if (updateHSV) {
      RGBToHSV(r, g, b, this);
    }

    return this;
  }

  /**
   * Updates the internal hsv cache values.
   */
  private updateHSV() {
    const r = this.r;
    const g = this.g;
    const b = this.b;

    RGBToHSV(r, g, b, this);

    return this;
  }

  /**
   * Returns a new Color component using the values from this one.
   */
  clone() {
    return new Color(this.r, this.g, this.b, this.a);
  }

  /**
   * Sets this Color object to be grayscaled based on the shade value given.
   * @param shade A value between 0 and 255.
   */
  gray(shade: number) {
    return this.setTo(shade, shade, shade);
  }

  /**
   * Sets this Color object to be a random color between the `min` and `max` values given.
   * @param min The minimum random color value. Between 0 and 255. Default 0.
   * @param max The maximum random color value. Between 0 and 255. Default 255.
   */
  random(min = 0, max = 255) {
    const r = Math.floor(min + Math.random() * (max - min));
    const g = Math.floor(min + Math.random() * (max - min));
    const b = Math.floor(min + Math.random() * (max - min));

    return this.setTo(r, g, b);
  }

  /**
   * Sets this Color object to be a random grayscale color between the `min` and `max` values given.
   * @param min The minimum random color value. Between 0 and 255. Default 0.
   * @param max The maximum random color value. Between 0 and 255. Default 255.
   */
  randomGray(min = 0, max = 255) {
    const s = Math.floor(min + Math.random() * (max - min));

    return this.setTo(s, s, s);
  }

  /**
   * Increase the saturation of this Color by the percentage amount given.
   * The saturation is the amount of the base color in the hue.
   * @param amount The percentage amount to change this color by. A value between 0 and 100.
   */
  saturate(amount: number) {
    this.s += amount / 100;
    return this;
  }

  /**
   * Decrease the saturation of this Color by the percentage amount given.
   * The saturation is the amount of the base color in the hue.
   * @param amount The percentage amount to change this color by. A value between 0 and 100.
   */
  desaturate(amount: number) {
    this.s -= amount / 100;
    return this;
  }
  /**
   * Increase the lightness of this Color by the percentage amount given.
   * @param amount The percentage amount to change this color by. A value between 0 and 100.
   */
  lighten(amount: number) {
    this.v += amount / 100;
    return this;
  }

  /**
   * Decrease the lightness of this Color by the percentage amount given.
   * @param amount The percentage amount to change this color by. A value between 0 and 100.
   */
  darken(amount: number) {
    this.v -= amount / 100;
    return this;
  }

  /**
   * Brighten this Color by the percentage amount given.
   * @param amount The percentage amount to change this color by. A value between 0 and 100.
   */
  brighten(amount: number) {
    let r = this.r;
    let g = this.g;
    let b = this.b;

    r = Math.max(0, Math.min(255, r - Math.round(255 * -(amount / 100))));
    g = Math.max(0, Math.min(255, g - Math.round(255 * -(amount / 100))));
    b = Math.max(0, Math.min(255, b - Math.round(255 * -(amount / 100))));

    return this.setTo(r, g, b);
  }

  /**
   * The color of this Color component, not including the alpha channel.
   */
  get color() {
    return this._color;
  }

  /**
   * The color of this Color component, including the alpha channel.
   */
  get color32() {
    return this._color32;
  }

  /**
   * The color of this Color component as a string which can be used in CSS color values.
   */
  get rgba() {
    return this._rgba;
  }

  /**
   * The red color value, normalized to the range 0 to 1.
   */
  get redGL() {
    return this.gl[0];
  }
  set redGL(value) {
    this.gl[0] = Math.min(Math.abs(value), 1);
    this.r = Math.floor(this.gl[0] * 255);
    this.update(true);
  }

  /**
   * The green color value, normalized to the range 0 to 1.
   */
  get greenGL() {
    return this.gl[1];
  }
  set greenGL(value) {
    this.gl[1] = Math.min(Math.abs(value), 1);
    this.g = Math.floor(this.gl[1] * 255);
    this.update(true);
  }

  /**
   * The blue color value, normalized to the range 0 to 1.
   */
  get blueGL() {
    return this.gl[2];
  }
  set blueGL(value) {
    this.gl[2] = Math.min(Math.abs(value), 1);
    this.b = Math.floor(this.gl[2] * 255);
    this.update(true);
  }

  /**
   * The alpha color value, normalized to the range 0 to 1.
   */
  get alphaGL() {
    return this.gl[3];
  }
  set alphaGL(value) {
    this.gl[3] = Math.min(Math.abs(value), 1);
    this.a = Math.floor(this.gl[3] * 255);
    this.update(true);
  }

  /**
   * The red color value, normalized to the range 0 to 255.
   */
  get red() {
    return this.r;
  }
  set red(value) {
    value = Math.floor(Math.abs(value));
    this.r = Math.min(value, 255);
    this.gl[0] = value / 255;
    this.update(true);
  }

  /**
   * The green color value, normalized to the range 0 to 255.
   */
  get green() {
    return this.g;
  }
  set green(value) {
    value = Math.floor(Math.abs(value));
    this.g = Math.min(value, 255);
    this.gl[1] = value / 255;
    this.update(true);
  }

  /**
   * The blue color value, normalized to the range 0 to 255.
   */
  get blue() {
    return this.b;
  }
  set blue(value) {
    value = Math.floor(Math.abs(value));
    this.b = Math.min(value, 255);
    this.gl[2] = value / 255;
    this.update(true);
  }

  /**
   * The alpha color value, normalized to the range 0 to 255.
   */
  get alpha() {
    return this.a;
  }
  set alpha(value) {
    value = Math.floor(Math.abs(value));
    this.a = Math.min(value, 255);
    this.gl[3] = value / 255;
    this.update(true);
  }

  /**
   * The hue color value. A number between 0 and 1.
   * This is the base color.
   */
  get h() {
    return this._h;
  }
  set h(value) {
    this._h = value;
    HSVToRGB(value, this._s, this._v, this);
  }

  /**
   * The saturation color value. A number between 0 and 1.
   * This controls how much of the hue will be in the final color, where 1 is fully saturated and 0 will give you white.
   */
  get s() {
    return this._s;
  }
  set s(value) {
    this._s = value;
    HSVToRGB(this._h, value, this._v, this);
  }

  /**
   * The lightness color value. A number between 0 and 1.
   * This controls how dark the color is. Where 1 is as bright as possible and 0 is black.
   */
  get v() {
    return this._v;
  }
  set v(value) {
    this._v = value;
    HSVToRGB(this._h, this._s, value, this);
  }
}
