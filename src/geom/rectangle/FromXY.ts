import Rectangle from './Rectangle';

/**
 * Create the smallest Rectangle containing two coordinate pairs.
 * @param x1 The X coordinate of the first point.
 * @param y1 The Y coordinate of the first point.
 * @param x2 The X coordinate of the second point.
 * @param y2 The Y coordinate of the second point.
 * @param out Optional Rectangle to adjust.
 */
function FromXY<O extends Rectangle>(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  out = new Rectangle() as O
) {
    return out.setTo(
        Math.min(x1, x2),
        Math.min(y1, y2),
        Math.abs(x1 - x2),
        Math.abs(y1 - y2)
    )
}

export default FromXY;
