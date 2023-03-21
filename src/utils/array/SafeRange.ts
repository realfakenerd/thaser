/**
 * Tests if the start and end indexes are a safe range for the given array.
 * @param array The array to check.
 * @param startIndex The start index.
 * @param endIndex The end index.
 * @param throwError Throw an error if the range is out of bounds. Default true.
 */
function SafeRange(
  array: any[],
  startIndex: number,
  endIndex: number,
  throwError?: boolean
): boolean {
  const len = array.length;

  if (
    startIndex < 0 ||
    startIndex > len ||
    startIndex >= endIndex ||
    endIndex > len
  ) {
    if (throwError) {
      throw new Error('Range Error: Values outside acceptable range');
    }

    return false;
  } else return true;
}

export default SafeRange;
