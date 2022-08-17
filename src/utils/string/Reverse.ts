/**
 * Takes the given string and reverses it, returning the reversed string.
 * For example if given the string `Atari 520ST` it would return `TS025 iratA`.
 * @param string The string to be reversed.
 * 
 * @return The reversed string.
 */
function Reverse(string: string): string {
    return string.split('').reverse().join('');
}
export default Reverse;