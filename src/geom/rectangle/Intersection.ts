import Rectangle from "./Rectangle";
import { RectangleToRectangle as Intersects } from "../intersects";
  /**
   * Takes two Rectangles and first checks to see if they intersect.
   * If they intersect it will return the area of intersection in the `out` Rectangle.
   * If they do not intersect, the `out` Rectangle will have a width and height of zero.
   * @param rectA The first Rectangle to get the intersection from.
   * @param rectB The second Rectangle to get the intersection from.
   * @param out A Rectangle to store the intersection results in.
   */
  function Intersection<O extends Rectangle>(
    rectA: Rectangle,
    rectB: Rectangle,
    out = new Rectangle()
  ) {
    if(Intersects(rectA, rectB)) {
        out.x = Math.max(rectA.x, rectB.x);
        out.y = Math.max(rectA.y, rectB.y);
        out.width = Math.min(rectA.right, rectB.right) - out.x;
        out.height = Math.min(rectA.bottom, rectB.bottom) - out.y;
    } else out.setEmpty();

    return out;
  }

  export default Intersection;