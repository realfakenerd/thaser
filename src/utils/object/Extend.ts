import IsPlainObject from './IsPlainObject';

/**
 * This is a slightly modified version of http://api.jquery.com/jQuery.extend/
 * @param args The objects that will be mixed.
 * @return The extended object.
 */
function Extend(this: any, ...args: any[]) {
  let options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = arguments[0] || {},
    i = 1,
    length = arguments.length,
    deep = false;

  if (typeof target === 'boolean') {
    deep = target;
    target = arguments[1] || {};
    i = 2;
  }

  if (length === i) {
    target = this;
    --i;
  }

  for (; i < length; i++) {
    if ((options = arguments[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        if (target === copy) continue;
        if (
          deep &&
          copy &&
          (IsPlainObject(copy) || (copyIsArray = Array.isArray(copy)))
        ) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ? src : [];
          } else {
            clone = src && IsPlainObject(src) ? src : {};
          }
          target[name] = Extend(deep, clone, copy);
        } else if (copy !== undefined) {
          target[name] = copy;
        }
      }
    }
  }
}
export default Extend;
