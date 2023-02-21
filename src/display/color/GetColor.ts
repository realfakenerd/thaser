/**
 * Given 3 separate color values this will return an integer representation of it.
 * @param red The red color value. A number between 0 and 255.
 * @param green The green color value. A number between 0 and 255.
 * @param blue The blue color value. A number between 0 and 255.
 */
function GetColor(red: number, green: number, blue: number) {
  return (red << 16) | (green << 8) | blue;
}

export default GetColor;
