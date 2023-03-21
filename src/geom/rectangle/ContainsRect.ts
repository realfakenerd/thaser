import type Rectangle from './Rectangle';

/**
 * Tests if one rectangle fully contains another.
 * @param rectA The first rectangle.
 * @param rectB The second rectangle.
 */
function ContainsRect(rectA: Rectangle, rectB: Rectangle) {
  if (rectB.width * rectB.height > rectA.width * rectA.height) return false;

  return (
    rectB.x > rectA.x &&
    rectB.x < rectA.right &&
    rectB.right > rectA.x &&
    rectB.right < rectA.right &&
    rectB.y > rectA.y &&
    rectB.y < rectA.bottom &&
    rectB.bottom > rectA.y &&
    rectB.bottom < rectA.bottom
  );
}

export default ContainsRect;
