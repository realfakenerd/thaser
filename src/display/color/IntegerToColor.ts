import Color from "./Color";
import IntergerToRGB from "./IntergerToRGB";

/**
   * Converts the given color value into an instance of a Color object.
   * @param input The color value to convert into a Color object.
   */
function IntegerToColor(input: number): Color {
    const rgb = IntergerToRGB(input);
    return new Color(rgb.r, rgb.g, rgb.b, rgb.a);
}
export default IntegerToColor;