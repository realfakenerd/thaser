/**
 * Snap a value to nearest grid slice, using ceil.
 *
 * Example: if you have an interval gap of `5` and a position of `12`... you will snap to `15`.
 * As will `14` snap to `15`... but `16` will snap to `20`.
 * @param value The value to snap.
 * @param gap The interval gap of the grid.
 * @param start Optional starting offset for gap. Default 0.
 * @param divide If `true` it will divide the snapped value by the gap before returning. Default false.
 */
function SnapCeil(value: number, gap: number, start = 0, divide = false) {
  if (gap === 0) return value;

  value -= start;
  value = gap * Math.ceil(value / gap);

  return divide ? (start + value) / gap : start + value;
}
export default SnapCeil;
