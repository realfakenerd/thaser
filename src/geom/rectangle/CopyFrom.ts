import type Rectangle from "./Rectangle";

/**
 * Copy the values of one Rectangle to a destination Rectangle.
 * @param source The source Rectangle to copy the values from.
 * @param dest The destination Rectangle to copy the values to.
 */
function CopyFrom<O extends Rectangle>(
  source: Rectangle,
  dest: O
) {
    return dest.setTo(source.x, source.y, source.width, source.height);
}

export default CopyFrom;
