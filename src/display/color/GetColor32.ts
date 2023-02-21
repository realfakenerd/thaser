/**
 * Given an alpha and 3 color values this will return an integer representation of it.
 * @param red The red color value. A number between 0 and 255.
 * @param green The green color value. A number between 0 and 255.
 * @param blue The blue color value. A number between 0 and 255.
 * @param alpha The alpha color value. A number between 0 and 255.
 */
function GetColor32(red: number, green: number, blue: number, alpha: number) {
    return alpha << 24 | red << 16 | green << 8 | blue;
}

export default GetColor32;
