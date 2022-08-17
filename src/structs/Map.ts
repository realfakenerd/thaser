type EachMapCallback<E> = (key: string, entry: E) => boolean;

/**
 * The keys of a Map can be arbitrary values.
 *
 * ```javascript
 * var map = new Map([
 *    [ 1, 'one' ],
 *    [ 2, 'two' ],
 *    [ 3, 'three' ]
 * ]);
 * ```
 */
export default class Map<K extends string, V> {
  /**
   * The entries in this Map.
   */
  entries: { [key: string]: V } = {};

  /**
   * The number of key / value pairs in this Map.
   */
  size = 0;

  /**
   * @param elements An optional array of key-value pairs to populate this Map with.
   */
  constructor(elements?: V[]) {
    if (Array.isArray(elements)) {
      let i = 0;
      for (i; i < elements.length; i++) {
        // @ts-ignore
        this.set(elements[i][0], elements[i][1]);
      }
    }
  }

  /**
   * Adds an element with a specified `key` and `value` to this Map.
   * If the `key` already exists, the value will be replaced.
   * @param key The key of the element to be added to this Map.
   * @param value The value of the element to be added to this Map.
   *
   * @return `This` Map object.
   */
  set(key: K, value: V) {
    if (!this.has(key)) {
      this.size++;
    }
    this.entries[key] = value;
    return this;
  }

  /**
   * Returns the value associated to the `key`, or `undefined` if there is none.
   * @param key The key of the element to return from the `Map` object.
   *
   * @return The element associated with the specified key or `undefined` if the key can't be found in this Map object.
   */
  get(key: K) {
    if (this.has(key)) return this.entries[key] as V;
  }

  /**
   * @return an `Array` of all the values stored in this Map.
   */
  getArray(): V[] {
    const output = [];
    const entries = this.entries;

    for (const key in entries) {
      output.push(entries[key]);
    }

    return output;
  }

  /**
   * Returns a boolean indicating whether an element with the specified key exists or not.
   * @param key The key of the element to test for presence of in this Map.
   *
   * @returns `true` if an element with the specified key exists in this Map, otherwise `false`.
   */
  has(key: K): boolean {
    return this.entries.hasOwnProperty(key);
  }

  /**
   * Delete the specified element from this Map.
   * @param key The key of the element to delete from this Map.
   *
   * @return This Map object.
   */
  delete(key: K) {
    if (this.has(key)) {
      delete this.entries[key];
      this.size--;
    }

    return this;
  }

  /**
   * Delete all entries from this Map.
   *
   * @return This Map object.
   */
  clear() {
    Object.keys(this.entries).forEach(prop => {
      delete this.entries[prop];
    }, this);
    this.size = 0;
    return this;
  }
  /**
   * @return all entries keys in this Map.
   */
  keys(): K[] {
    return Object.keys(this.entries) as any;
  }

  /**
   * @return an `Array` of all entries.
   */
  values(): V[] {
    const output = [];
    const entries = this.entries;
    for (const key in entries) {
      output.push(entries[key]);
    }
    return output;
  }

  /**
   * Dumps the contents of this Map to the console via `console.group`.
   */
  dump(): void {
    const entries = this.entries;
    console.group('Map');
    for (const key in entries) {
      console.log(key, entries[key]);
    }
    console.groupEnd();
  }

  /**
   * Iterates through all entries in this Map, passing each one to the given callback.
   *
   * If the callback returns `false`, the iteration will break.
   * @param callback The callback which will receive the keys and entries held in this Map.
   */
  each(callback: EachMapCallback<V>) {
    const entries = this.entries;
    for (const key in entries) {
      if (callback(key, entries[key]) === false) {
        break;
      }
    }
    return this;
  }
  /**
   * Returns `true` if the value exists within this Map. Otherwise, returns `false`.
   * @param value The value to search for.
   */
  contains(value: V): boolean {
    const entries = this.entries;
    for (const key in entries) {
      if (entries[key] === value) return true;
    }
    return false;
  }

  /**
   * Merges all new keys from the given Map into this one.
   * If it encounters a key that already exists it will be skipped unless override is set to `true`.
   * @param map The Map to merge in to this Map.
   * @param override Set to `true` to replace values in this Map with those from the source map, or `false` to skip them. Default false.
   */
  merge(map: Map<K, V>, override = false) {
    const local = this.entries;
    const source = map.entries;
    for (const key in source) {
      if (local.hasOwnProperty(key) && override) {
        local[key] = source[key];
      } else {
        this.set(key as K, source[key]);
      }
    }
    return this;
  }
}
