/**
 * Force a value within the boundaries by clamping it to the range `min`, `max`.
 * @param value The value to be clamped.
 * @param min The minimum bounds.
 * @param max The maximum bounds.
 * 
 * @return The clamped value.
 */
function Clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
export default Clamp;
