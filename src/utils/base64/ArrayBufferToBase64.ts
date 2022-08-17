const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

/**
 * Converts an ArrayBuffer into a base64 string.
 *
 * The resulting string can optionally be a data uri if the `mediaType` argument is provided.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs for more details.
 * @param arrayBuffer The Array Buffer to encode.
 * @param mediaType An optional media type, i.e. `audio/ogg` or `image/jpeg`. If included the resulting string will be a data URI.
 *
 * @return The base64 encoded Array buffer.
 */
function ArrayBufferToBase64(
  arrayBuffer: ArrayBuffer,
  mediaType?: string
): string {
  const bytes = new Uint8Array(arrayBuffer);
  const len = bytes.length;

  let base64 = mediaType ? 'data:' + mediaType + ';base64' : '';
  let i = 0;
  for (i; i < len; i += 3) {
    base64 += chars[bytes[i] >> 2];
    base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
    base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
    base64 += chars[bytes[i + 2] & 63];
  }

  if (len % 3 === 2) {
    base64 = base64.substring(0, base64.length - 1) + '=';
  } else if (len % 3 === 1) {
    base64 = base64.substring(0, base64.length - 2) + '==';
  }
  return base64;
}
export default ArrayBufferToBase64;