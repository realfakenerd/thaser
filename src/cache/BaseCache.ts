import { Map as CustomMap } from '../structs';
import { EventEmitter } from 'eventemitter3';
import Events from './events';
/**
 * The BaseCache is a base Cache class that can be used for storing references to any kind of data.
 *
 * Data can be added, retrieved and removed based on the given keys.
 *
 * Keys are string-based.
 */
export default class BaseCache {
  /**
   * The Map in which the cache objects are stored.
   *
   * You can query the Map directly or use the BaseCache methods.
   */
  entries = new CustomMap();

  /**
   * An instance of EventEmitter used by the cache to emit related events.
   */
  events = new EventEmitter();

  /**
   * Adds an item to this cache. The item is referenced by a unique string, which you are responsible
   * for setting and keeping track of. The item can only be retrieved by using this string.
   * @param key The unique key by which the data added to the cache will be referenced.
   * @param data The data to be stored in the cache.
   */
  add(key: string, data: any): this {
    this.entries.set(key, data);
    this.events.emit(Events.ADD, this, key, data);
    return this;
  }

  /**
   * Checks if this cache contains an item matching the given key.
   * This performs the same action as `BaseCache.exists`.
   * @param key The unique key of the item to be checked in this cache.
   */
  has(key: string): boolean {
    return this.entries.has(key);
  }

  /**
   * Checks if this cache contains an item matching the given key.
   * This performs the same action as `BaseCache.has` and is called directly by the Loader.
   * @param key The unique key of the item to be checked in this cache.
   */
  exists(key: string): boolean {
    return this.entries.has(key);
  }

  /**
   * Gets an item from this cache based on the given key.
   * @param key The unique key of the item to be retrieved from this cache.
   */
  get(key: string): any {
    return this.entries.get(key);
  }

  /**
   * Removes and item from this cache based on the given key.
   *
   * If an entry matching the key is found it is removed from the cache and a `remove` event emitted.
   * No additional checks are done on the item removed. If other systems or parts of your game code
   * are relying on this item, it is up to you to sever those relationships prior to removing the item.
   * @param key The unique key of the item to remove from the cache.
   */
  remove(key: string): this {
    const entry = this.get(key);
    if (entry) {
      this.entries.delete(key);
      this.events.emit(Events.REMOVE, this, key, entry.data);
    }
    return this;
  }

  /**
   * Returns all keys in use in this cache.
   */
  getKeys(): string[] {
    return this.entries.keys();
  }

  /**
   * Destroys this cache and all items within it.
   */
  destroy(): void {
    this.entries.clear();
    this.events.removeAllListeners();

    this.entries = null as any;
    this.events = null as any;
  }
}
