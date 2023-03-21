import { type Point } from "../point";
import Contains from "./Contains";
import type Rectangle from "./Rectangle";

/**
 * Determines whether the specified point is contained within the rectangular region defined by this Rectangle object.
 * @param rect The Rectangle object.
 * @param point The point object to be checked. Can be a Phaser Point object or any object with x and y values.
 */
function ContainsPoint(rect: Rectangle, point: Point) {
    return Contains(rect, point.x, point.y);
}

export default ContainsPoint;
