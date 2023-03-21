import SafeRange from './SafeRange';

/**
 * Passes each element in the array, between the start and end indexes, to the given callback.
 * @param array The array to search.
 * @param callback A callback to be invoked for each item in the array.
 * @param context The context in which the callback is invoked.
 * @param startIndex The start index to search from.
 * @param endIndex The end index to search to.
 * @param args Additional arguments that will be passed to the callback, after the child.
 */
function EachInRange(
  array: any[],
  callback: Function,
  context: object,
  startIndex = 0,
  endIndex = array.length,
  ...args: any[]
): any[] {
  if (SafeRange(array, startIndex, endIndex)) {
    let i: number;
    const _args = [null];
    const argsLength = arguments.length;

    for (i = 5; i < argsLength; i++) {
      _args.push(arguments[i]);
    }

    for (i = startIndex; i < endIndex; i++) {
      _args[0] = array[i];

      callback.apply(context, _args);
    }
  }

  return array;
}

export default EachInRange;
