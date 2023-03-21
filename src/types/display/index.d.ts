export interface InputColorObject {
  /**
   * The red color value in the range 0 to 255.
   */
  r?: number;
  /**
   * The green color value in the range 0 to 255.
   */
  g?: number;
  /**
   * The blue color value in the range 0 to 255.
   */
  b?: number;
  /**
   * The alpha color value in the range 0 to 255.
   */
  a?: number;
}

export interface HSVColorObject {
  /**
   * The hue color value. A number between 0 and 1
   */
  h: number;
  /**
   * The saturation color value. A number between 0 and 1
   */
  s: number;
  /**
   * The lightness color value. A number between 0 and 1
   */
  v: number;
}

export interface ColorObject {
  /**
   * The red color value in the range 0 to 255.
   */
  r: number;
  /**
   * The green color value in the range 0 to 255.
   */
  g: number;
  /**
   * The blue color value in the range 0 to 255.
   */
  b: number;
  /**
   * The alpha color value in the range 0 to 255.
   */
  a?: number;
  /**
   * The combined color value.
   */
  color?: number;
}
