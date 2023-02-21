/**
 * Returns a string containing a hex representation of the given color component.
 * @param color The color channel to get the hex value for, must be a value between 0 and 255.
 */
function ComponentToHex(color: number) {
  const hex = color.toString(16);
  return hex.length === 1 ? `0${hex}` : hex;
}
export default ComponentToHex;
