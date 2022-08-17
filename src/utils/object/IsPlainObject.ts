/**
 * This is a slightly modified version of jQuery.isPlainObject.
 * A plain object is an object whose internal class property is [object Object].
 * @param obj The object to inspect.
 * 
 * @return `true` if the object is plain, otherwise `false`.
 */
function IsPlainObject(obj: any | Record<any, any>): boolean {
  if (typeof obj !== 'object' || obj.nodeType || obj === obj.window)
    return false;

  try {
    if (
      obj.constructor &&
      !{}.hasOwnProperty.call(obj.constructor.prototype, 'isPrototypeOf')
    )
      return false;
  } catch (e) {
    return false;
  }
  return true;
}
export default IsPlainObject;