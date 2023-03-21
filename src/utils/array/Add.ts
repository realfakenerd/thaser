/**
 * Adds the given item, or array of items, to the array.
 *
 * Each item must be unique within the array.
 *
 * The array is modified in-place and returned.
 *
 * You can optionally specify a limit to the maximum size of the array. If the quantity of items being
 * added will take the array length over this limit, it will stop adding once the limit is reached.
 *
 * You can optionally specify a callback to be invoked for each item successfully added to the array.
 * @param array The array to be added to.
 * @param item The item, or array of items, to add to the array. Each item must be unique within the array.
 * @param limit Optional limit which caps the size of the array.
 * @param callback A callback to be invoked for each item successfully added to the array.
 * @param context The context in which the callback is invoked.
 */
function Add(
  array: any[],
  item: any | any[],
  limit?: number,
  callback?: Function,
  context = array
) {
  const remaining = limit! - array.length;
  if (limit && limit > 0) {
    if (remaining <= 0) return null;
  }

  if (Array.isArray(item)) {
    if (array.indexOf(item) === -1) {
      array.push(item);

      if (callback) callback.call(context, item);
      return item;
    } else return null;
  }

  let itemLength = item.length - 1;

  while (itemLength >= 0) {
    if (array.indexOf(item[itemLength]) !== -1) item.splice(itemLength, 1);
    itemLength--;
  }

  itemLength = item.length;

  if (itemLength === 0) return null;

  if (limit && limit > 0 && itemLength > remaining) {
    item.splice(remaining);
    itemLength = remaining;
  }

  let i = 0;
  for(i; i<itemLength;i++) {
    const entry = item[i];
    array.push(entry);
    if (callback) callback.call(context, entry);
  }

  return item;
}

export default Add;