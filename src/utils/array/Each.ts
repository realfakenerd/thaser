/**
 * Passes each element in the array to the given callback.
 * @param array The array to search.
 * @param callback A callback to be invoked for each item in the array.
 * @param context The context in which the callback is invoked.
 * @param args Additional arguments that will be passed to the callback, after the current array item.
 */
function Each(
  array: any[],
  callback: Function,
  context: object,
  ...args: any[]
): any[] {
  let i: number;
  const _args = [null];
  const argsLength = arguments.length;
  const arrLength = array.length;
  for (i = 3; i < argsLength; i++) {
    _args.push(arguments[i]);
  }
  for (i = 0; i < arrLength; i++) {
    _args[0] = array[i];
    callback.apply(context, args);
  }

  return array;
}
export default Each;
