import Color from "./Color";
import HueToComponent from "./HueToComponent";

/**
 * Converts HSL (hue, saturation and lightness) values to a Phaser Color object.
 * @param h The hue value in the range 0 to 1.
 * @param s The saturation value in the range 0 to 1.
 * @param l The lightness value in the range 0 to 1.
 */
function HSLToColor(h: number, s: number, l: number) {
  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = HueToComponent(p, q, h + 1 / 3);
    g = HueToComponent(p, q, h);
    b = HueToComponent(p, q, h - 1 / 3);
  }

  const color = new Color();
  return color.setGLTo(r, g, b, 1);
}
export default HSLToColor;
