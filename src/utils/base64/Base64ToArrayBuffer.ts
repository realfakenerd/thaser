const chars =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

const lookup = new Uint8Array(256);
let i = 0;
for (i; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

/**
 * Converts a base64 string, either with or without a data uri, into an Array Buffer.
 * @param base64 The base64 string to be decoded. Can optionally contain a data URI header, which will be stripped out prior to decoding.
 *
 * @return An ArrayBuffer decoded from the base64 data.
 */
function Base64ToArrayBuffer(base64: string): ArrayBuffer {
  base64 = base64.substring(base64.indexOf(',') + 1);

  const len = base64.length;
  let bufferLength = len * 0.75;
  let p = 0;
  let encoded1: number;
  let encoded2: number;
  let encoded3: number;
  let encoded4: number;

  if (base64[len - 1] === '=') {
    bufferLength--;
    if (base64[len - 2] === '=') {
      bufferLength--;
    }
  }

  const arrayBuffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(arrayBuffer);

  let i = 0;
  for (i; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arrayBuffer;
}
export default Base64ToArrayBuffer;