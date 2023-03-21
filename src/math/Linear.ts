/**
 * Calculates a linear (interpolation) value over t.
 * @param p0 The first point.
 * @param p1 The second point.
 * @param t The percentage between p0 and p1 to return, represented as a number between 0 and 1.
 */
function Linear(p0: number, p1: number, t: number) {
  return (p1 - p0) * t + p0;
}
export default Linear;
