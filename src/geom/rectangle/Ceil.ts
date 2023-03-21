import type Rectangle from "./Rectangle";

/**
   * Rounds a Rectangle's position up to the smallest integer greater than or equal to each current coordinate.
   * @param rect The Rectangle to adjust.
   */
function Ceil<O extends Rectangle>(rect: O) {
    rect.x = Math.ceil(rect.x);
    rect.y = Math.ceil(rect.y);

    return rect;
}
export default Ceil;