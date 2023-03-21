import type Rectangle from './Rectangle';

/**
 * Rounds down (floors) the top left X and Y coordinates of the given Rectangle to the largest integer less than or equal to them
 * @param rect The rectangle to floor the top left X and Y coordinates of
 */
function Floor<O extends Rectangle>(rect: O) {
    rect.x = Math.floor(rect.x);
    rect.y = Math.floor(rect.y);
    return rect;
}
export default Floor;
