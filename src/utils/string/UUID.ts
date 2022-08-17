/**
 * Creates and returns an RFC4122 version 4 compliant UUID.
 *
 * The string is in the form: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` where each `x` is replaced with a random
 * hexadecimal digit from 0 to f, and `y` is replaced with a random hexadecimal digit from 8 to b.
 *
 * @return The UUID string.
 */
function UUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
export default UUID;
