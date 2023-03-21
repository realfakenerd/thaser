import Rectangle from './Rectangle';

/**
 * Determines if the two objects (either Rectangles or Rectangle-like) have the same width and height values under strict equality.
 * @param rect The first Rectangle object.
 * @param toCompare The second Rectangle object.
 */
function SameDimensions(rect: Rectangle, toCompare: Rectangle) {
  return rect.width === toCompare.width && rect.height === toCompare.height;
}
export default SameDimensions;
