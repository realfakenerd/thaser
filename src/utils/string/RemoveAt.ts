/**
 * Takes a string and removes the character at the given index.
 * @param string The string to be worked on.
 * @param index The index of the character to be removed.
 * 
 * @return The modified string.
 */
function RemoveAt(string: string, index: number): string {
    if(index === 0) return string.slice(1);
    else return string.slice(0, index - 1) + string.slice(index);
}
export default RemoveAt;