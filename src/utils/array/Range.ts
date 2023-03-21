import { Shuffle } from ".";
import { GetValue } from "../object";

interface ChunkDef {
  a: number;
  b: number;
}

function BuildChunk(a: number[], b: number[], qty: number): ChunkDef[] {
  const out: ChunkDef[] = [];

  let aIndex = 0;
  const aLength = a.length;
  for (aIndex; aIndex < aLength; aIndex++) {
    let bIndex = 0;
    const bLength = b.length;
    for (bIndex; bIndex < bLength; bIndex++) {
      let i = 0;
      for (i; i < qty; i++) {
        out.push({ a: a[aIndex], b: b[bIndex] });
      }
    }
  }

  return out;
}

/**
 * Creates an array populated with a range of values, based on the given arguments and configuration object.
 *
 * Range ([a,b,c], [1,2,3]) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2,3], qty = 3) =
 * a1, a1, a1, a2, a2, a2, a3, a3, a3, b1, b1, b1, b2, b2, b2, b3, b3, b3
 *
 * Range ([a,b,c], [1,2,3], repeat x1) =
 * a1, a2, a3, b1, b2, b3, c1, c2, c3, a1, a2, a3, b1, b2, b3, c1, c2, c3
 *
 * Range ([a,b], [1,2], repeat -1 = endless, max = 14) =
 * Maybe if max is set then repeat goes to -1 automatically?
 * a1, a2, b1, b2, a1, a2, b1, b2, a1, a2, b1, b2, a1, a2 (capped at 14 elements)
 *
 * Range ([a], [1,2,3,4,5], random = true) =
 * a4, a1, a5, a2, a3
 *
 * Range ([a, b], [1,2,3], random = true) =
 * b3, a2, a1, b1, a3, b2
 *
 * Range ([a, b, c], [1,2,3], randomB = true) =
 * a3, a1, a2, b2, b3, b1, c1, c3, c2
 *
 * Range ([a], [1,2,3,4,5], yoyo = true) =
 * a1, a2, a3, a4, a5, a5, a4, a3, a2, a1
 *
 * Range ([a, b], [1,2,3], yoyo = true) =
 * a1, a2, a3, b1, b2, b3, b3, b2, b1, a3, a2, a1
 * @param a The first array of range elements.
 * @param b The second array of range elements.
 * @param options A range configuration object. Can contain: repeat, random, randomB, yoyo, max, qty.
 */
function Range(a: any[], b: any[], options?: Record<any, any>): any[] {
  const max = GetValue(options!, 'max', 0);
  const qty = GetValue(options!, 'qty', 1);
  const random = GetValue(options!, 'random', false);
  const randomB = GetValue(options!, 'randomB', false);
  let repeat = GetValue(options!, 'repeat', 0);
  const yoyo = GetValue(options!, 'yoyo', false);
  let out: ChunkDef[] = [];
  if (randomB) {
    Shuffle(b);
  }
  if (repeat === -1) {
    if (max === 0) {
      repeat = 0;
    } else {
      let total = a.length * b.length * qty;
      if (yoyo) {
        total *= 2;
      }
      repeat = Math.ceil(max / total);
    }
  }

  let i = 0;
  for (i; i <= repeat; i++) {
    const chunk = BuildChunk(a, b, qty);
    if (random) {
      Shuffle(chunk);
    }
    out = out.concat(chunk);
    if (yoyo) {
      chunk.reverse();
      out = out.concat(chunk);
    }
  }
  if (max) {
    out.splice(max);
  }
  return out;
}

export default Range;