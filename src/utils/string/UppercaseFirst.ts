/**
 * Capitalizes the first letter of a string if there is one.
 * @param str The string to capitalize.
 * 
 * @return A new string, same as the first, but with the first letter capitalized.
 */
function UppercaseFirst(str: string): string {
  return str && str[0].toUpperCase() + str.slice(1);
}
export default UppercaseFirst;