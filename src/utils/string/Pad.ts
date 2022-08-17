/**
 * Takes the given string and pads it out, to the length required, using the character
 * specified. For example if you need a string to be 6 characters long, you can call:
 *
 * `pad('bob', 6, '-', 2)`
 *
 * This would return: `bob---` as it has padded it out to 6 characters, using the `-` on the right.
 *
 * You can also use it to pad numbers (they are always returned as strings):
 *
 * `pad(512, 6, '0', 1)`
 *
 * Would return: `000512` with the string padded to the left.
 *
 * If you don't specify a direction it'll pad to both sides:
 *
 * `pad('c64', 7, '*')`
 *
 * Would return: `**c64**`
 * @param str The target string. `toString()` will be called on the string, which means you can also pass in common data types like numbers.
 * @param len The number of characters to be added. Default 0.
 * @param pad The string to pad it out with (defaults to a space). Default " ".
 * @param dir The direction dir = 1 (left), 2 (right), 3 (both). Default 3.
 *
 * @return The padded string.
 */
function Pad(str: string | number | object, len = 0, pad = ' ', dir = 3): string {
  str = str.toString();
  let padlen = 0;

  if (len + 1 >= str.length) {
    switch (dir) {
      case 1:
        str = new Array(len + 1 - str.length).join(pad) + str;
        break;
      case 3:
        const right = Math.ceil((padlen = len - str.length) / 2);
        const left = padlen - right;
        str =
          new Array(left + 1).join(pad) + str + new Array(right + 1).join(pad);
        break;
      default:
        str = str + new Array(len + 1 - str.length).join(pad);
        break;
    }
  }
  return str;
}
export default Pad;