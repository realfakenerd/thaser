/**
 * Adds the given item, or array of items, to the array starting at the index specified.
 *
 * Each item must be unique within the array.
 *
 * Existing elements in the array are shifted up.
 *
 * The array is modified in-place and returned.
 *
 * You can optionally specify a limit to the maximum size of the array. If the quantity of items being
 * added will take the array length over this limit, it will stop adding once the limit is reached.
 *
 * You can optionally specify a callback to be invoked for each item successfully added to the array.
 * @param array The array to be added to.
 * @param item The item, or array of items, to add to the array.
 * @param index The index in the array where the item will be inserted. Default 0.
 * @param limit Optional limit which caps the size of the array.
 * @param callback A callback to be invoked for each item successfully added to the array.
 * @param context The context in which the callback is invoked.
 */
function AddAt(
  array: any[],
  item: any | any[],
  index = 0,
  limit?: number,
  callback?: Function,
  context = array
): any[] {
  const remaining = limit! - array.length;
  if (limit && limit > 0) {
    if (remaining <= 0) return null as any;
  }

  if (!Array.isArray(item)) {
    if (array.indexOf(item) === -1) {
      array.splice(index, 0, item);

      if (callback) {
        callback.call(context, item);
      }

      return item;
    } else return null as any;
  }

  let itemLength = item.length - 1;

  while (itemLength >= 0) {
    if (array.indexOf(item[itemLength]) !== -1) {
      item.pop();
    }

    itemLength--;
  }

  itemLength = item.length;

  if (itemLength === 0) return null as any;

  //  Truncate to the limit
  if (limit && limit > 0 && itemLength > remaining) {
    item.splice(remaining);

    itemLength = remaining;
  }

  let i = itemLength;
  for (i - 1; i >= 0; i--) {
    const entry = item[i];

    array.splice(index, 0, entry);

    if (callback) {
      callback.call(context, entry);
    }
  }

  return item;
}

export default AddAt;
