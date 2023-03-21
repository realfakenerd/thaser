import Rectangle from './Rectangle';

/**
 * Creates a new Rectangle or repositions and/or resizes an existing Rectangle so that it encompasses the two given Rectangles, i.e. calculates their union.
 * @param rectA The first Rectangle to use.
 * @param rectB The second Rectangle to use.
 * @param out The Rectangle to store the union in.
 */
function Union<O extends Rectangle>(
  rectA: Rectangle,
  rectB: Rectangle,
  out = new Rectangle() as O
) {
  const x = Math.min(rectA.x, rectB.x);
  const y = Math.min(rectA.y, rectB.y);
  const w = Math.max(rectA.right, rectB.right) - x;
  const h = Math.max(rectA.bottom, rectB.bottom) - y;

  return out.setTo(x, y, w, h);
}

export default Union;
