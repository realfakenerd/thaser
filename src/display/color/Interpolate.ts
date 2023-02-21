import { Linear } from '@thaser/math';
import { type ColorObject } from '@thaser/types/display';
import type Color from './Color';

/**
 * Interpolates between the two given color ranges over the length supplied.
 * @param r1 Red value.
 * @param g1 Blue value.
 * @param b1 Green value.
 * @param r2 Red value.
 * @param g2 Blue value.
 * @param b2 Green value.
 * @param length Distance to interpolate over. Default 100.
 * @param index Index to start from. Default 0.
 */
function RGBWithRGB(
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number,
  length = 100,
  index = 0
): ColorObject {
  const t = index / length;
  return {
    r: Linear(r1, r2, t),
    g: Linear(g1, g2, t),
    b: Linear(b1, b2, t)
  };
}
/**
 * Interpolates between the two given color objects over the length supplied.
 * @param color1 The first Color object.
 * @param color2 The second Color object.
 * @param length Distance to interpolate over. Default 100.
 * @param index Index to start from. Default 0.
 */
function ColorWithColor(
  color1: Color,
  color2: Color,
  length = 100,
  index = 0
): ColorObject {
  return RGBWithRGB(
    color1.r,
    color1.g,
    color1.b,
    color2.r,
    color2.g,
    color2.b,
    length,
    index
  );
}

/**
 * Interpolates between the Color object and color values over the length supplied.
 * @param color1 The first Color object.
 * @param r Red value.
 * @param g Blue value.
 * @param b Green value.
 * @param length Distance to interpolate over. Default 100.
 * @param index Index to start from. Default 0.
 */
function ColorWithRGB(
  color1: Color,
  r: number,
  g: number,
  b: number,
  length = 100,
  index = 0
): ColorObject {
  return RGBWithRGB(color1.r, color1.g, color1.b, r, g, b, length, index);
}

export { RGBWithRGB, ColorWithRGB, ColorWithColor };
