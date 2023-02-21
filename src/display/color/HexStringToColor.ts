import Color from './Color';

/**
 * Converts a hex string into a Phaser Color object.
 *
 * The hex string can supplied as `'#0033ff'` or the short-hand format of `'#03f'`; it can begin with an optional "#" or "0x", or be unprefixed.
 *
 * An alpha channel is _not_ supported.
 * @param hex The hex color value to convert, such as `#0033ff` or the short-hand format: `#03f`.
 */
function HexStringToColor(hex: string): Color {
  const color = new Color();
  hex = hex.replace(
    /^(?:#|0x)?([a-f\d])([a-f\d])([a-f\d])$/i,
    (_, r, g, b) => r + r + g + g + b + b
  );

  const result = /^(?:#|0x)?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

  if (result) {
    const r = parseInt(result[1], 16);
    const g = parseInt(result[2], 16);
    const b = parseInt(result[3], 16);
    color.setTo(r, g, b);
  }

  return color;
}
export default HexStringToColor;
