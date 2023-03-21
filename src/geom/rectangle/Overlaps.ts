import Rectangle from './Rectangle';

/**
 * Checks if two Rectangles overlap. If a Rectangle is within another Rectangle, the two will be considered overlapping. Thus, the Rectangles are treated as "solid".
 * @param rectA The first Rectangle to check.
 * @param rectB The second Rectangle to check.
 */
function Overlaps(rectA: Rectangle, rectB: Rectangle) {
  return (
    rectA.x < rectB.right &&
    rectA.right > rectB.x &&
    rectA.y < rectB.bottom &&
    rectA.bottom > rectB.y
  );
}

export default Overlaps;
