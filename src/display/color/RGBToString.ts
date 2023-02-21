import ComponentToHex from './ComponentToHex';

/**
 * Converts the color values into an HTML compatible color string, prefixed with either `#` or `0x`.
 * @param r The red color value. A number between 0 and 255.
 * @param g The green color value. A number between 0 and 255.
 * @param b The blue color value. A number between 0 and 255.
 * @param a The alpha value. A number between 0 and 255. Default 255.
 * @param prefix The prefix of the string. Either `#` or `0x`. Default #.
 */
function RGBToString(r: number, g: number, b: number, a = 255, prefix = '#') {
  if (prefix === '#')
    return (
      '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1, 7)
    );
  else
    return (
      '0x' +
      ComponentToHex(a) +
      ComponentToHex(r) +
      ComponentToHex(g) +
      ComponentToHex(b)
    );
}
export default RGBToString;
