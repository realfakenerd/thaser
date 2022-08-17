/**
 * Takes a string and replaces instances of markers with values in the given array.
 * The markers take the form of `%1`, `%2`, etc. I.e.:
 *
 * `Format("The %1 is worth %2 gold", [ 'Sword', 500 ])`
 * @param string The string containing the replacement markers.
 * @param values An array containing values that will replace the markers. If no value exists an empty string is inserted instead.
 *
 * @return The string contained replaced values.
 */
function Format(string: string, values: any[]): string {
  return string.replace(/%([0-9]+)/g, function (s, n) {
    return values[Number(n) - 1];
  });
}
export default Format;