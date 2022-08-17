/**
 * Shallow Object Clone. Will not clone nested objects.
 * @param obj The object to clone.
 *
 * @return A new object with the same properties as the input object.
 */
function Clone(obj: Record<any, any>) {
    const clone: Record<any, any> = {};
    for (const key in obj) {
        if(Array.isArray(obj[key])) {
            clone[key] = obj[key].slice(0);
        } else {
            clone[key] = obj[key];
        }
    }
    return clone;
}
export default Clone;