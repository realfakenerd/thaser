import Rectangle from './Rectangle';

/**
 * Creates a new Rectangle which is identical to the given one.
 * @param source The Rectangle to clone.
 */
function Clone(source: Rectangle) {
    return new Rectangle(source.x, source.y, source.width, source.height);
}
export default Clone;
