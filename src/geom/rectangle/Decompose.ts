import Rectangle from './Rectangle';

/**
 * Create an array of points for each corner of a Rectangle
 * If an array is specified, each point object will be added to the end of the array, otherwise a new array will be created.
 * @param rect The Rectangle object to be decomposed.
 * @param out If provided, each point will be added to this array.
 */
function Decompose(rect: Rectangle, out: any[] = []) {
  out.push({ x: rect.x, y: rect.y });
  out.push({ x: rect.right, y: rect.y });
  out.push({ x: rect.right, y: rect.bottom });
  out.push({ x: rect.x, y: rect.bottom });

  return out;
}
export default Decompose;
