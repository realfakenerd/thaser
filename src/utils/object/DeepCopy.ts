/**
 * Deep Copy the given object or array.
 * @param inObject The object to deep copy.
 *
 * @return A deep copy of the original object.
 */
function DeepCopy(inObject: Record<any, any>) {
  let outObject: Record<any, any>;
  let value: any;
  let key: any;

  if (typeof inObject !== 'object' || inObject === null) return inObject;

  outObject = Array.isArray(inObject) ? [] : {};

  for(key in inObject) {
    value = inObject[key];

    outObject[key] = DeepCopy(value);
  }

  return outObject;
}
export default DeepCopy;