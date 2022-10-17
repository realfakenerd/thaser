import { EventEmitter } from '@thaser/events';
import { DataEachCallback } from '../types/global';
import Events from './events';
/**
 * The Data Manager Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 */
export default class DataManager {
  /**
   *
   * @param parent The object that this DataManager belongs to.
   * @param eventEmitter The DataManager's event emitter.
   */
  constructor(parent: Record<any, any>, eventEmitter?: EventEmitter) {
    this.parent = parent;
    this.events = eventEmitter!;

    if (!eventEmitter) {
      this.events = parent.events ? parent.events : parent;
    }

    if (!parent.hasOwnProperty('sys') && this.events) {
      this.events.once(Events.DESTROY, this.destroy, this);
    }
  }

  /**
   * The object that this DataManager belongs to.
   */
  parent: any;

  /**
   * The DataManager's event emitter.
   */
  events: EventEmitter;

  /**
   * The data list.
   */
  list: Record<string, any> = {};

  /**
   * The public values list. You can use this to access anything you have stored
   * in this Data Manager. For example, if you set a value called `gold` you can
   * access it via:
   *
   * ```javascript
   * this.data.values.gold;
   * ```
   *
   * You can also modify it directly:
   *
   * ```javascript
   * this.data.values.gold += 1000;
   * ```
   *
   * Doing so will emit a `setdata` event from the parent of this Data Manager.
   *
   * Do not modify this object directly. Adding properties directly to this object will not
   * emit any events. Always use `DataManager.set` to create new items the first time around.
   */
  values: Record<string, any> = {};

  /**
   * Whether setting data is frozen for this DataManager.
   */
  private _frozen = false;

  /**
   * Retrieves the value for the given key, or undefined if it doesn't exist.
   *
   * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
   *
   * ```javascript
   * this.data.get('gold');
   * ```
   *
   * Or access the value directly:
   *
   * ```javascript
   * this.data.values.gold;
   * ```
   *
   * You can also pass in an array of keys, in which case an array of values will be returned:
   *
   * ```javascript
   * this.data.get([ 'gold', 'armor', 'health' ]);
   * ```
   *
   * This approach is useful for destructuring arrays in ES6.
   * @param key The key of the value to retrieve, or an array of keys.
   */
  get(key: string | string[]) {
    const list = this.list;
    if (Array.isArray(key)) {
      const output: any[] = [];
      let i = 0;
      const length = key.length;
      for (i; i < length; i++) {
        output.push(list[key[i]]);
      }
      return output;
    } else {
      return list[key];
    }
  }

  /**
   * Retrieves all data values in a new object.
   */
  getAll(): Record<string, any> {
    const results: Record<any, any> = {};
    for (const key in this.list) {
      if (this.list.hasOwnProperty(key)) {
        results[key] = this.list[key];
      }
    }

    return results;
  }

  /**
   * Queries the DataManager for the values of keys matching the given regular expression.
   * @param search A regular expression object. If a non-RegExp object obj is passed, it is implicitly converted to a RegExp by using new RegExp(obj).
   */
  query(search: RegExp): Record<string, any> {
    const results: Record<string, any> = {};
    for (const key in this.list) {
      if (this.list.hasOwnProperty(key) && key.match(search)) {
        results[key] = this.list[key];
      }
    }

    return results;
  }

  /**
   * Sets a value for the given key. If the key doesn't already exist in the Data Manager then it is created.
   *
   * ```javascript
   * data.set('name', 'Red Gem Stone');
   * ```
   *
   * You can also pass in an object of key value pairs as the first argument:
   *
   * ```javascript
   * data.set({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
   * ```
   *
   * To get a value back again you can call `get`:
   *
   * ```javascript
   * data.get('gold');
   * ```
   *
   * Or you can access the value directly via the `values` property, where it works like any other variable:
   *
   * ```javascript
   * data.values.gold += 50;
   * ```
   *
   * When the value is first set, a `setdata` event is emitted.
   *
   * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
   * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
   * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
   *
   * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
   * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
   * @param key The key to set the value for. Or an object or key value pairs. If an object the `data` argument is ignored.
   * @param data The value to set for the given key. If an object is provided as the key this argument is ignored.
   */
  set(key: string | Record<any, any>, data: any) {
    if (this._frozen) return this;
    if (typeof key === 'string') return this.setValue(key, data);
    else {
      for (const entry in key) {
        this.setValue(entry, key[entry]);
      }
    }

    return this;
  }

  /**
   * Increase a value for the given key. If the key doesn't already exist in the Data Manager then it is increased from 0.
   *
   * When the value is first set, a `setdata` event is emitted.
   * @param key The key to increase the value for.
   * @param data The value to increase for the given key.
   */
  inc(key: string | Record<any, any>, data = 1) {
    if (this._frozen) return this;

    let value = this.get(key as string);
    if (value === undefined) {
      value = 0;
    }

    this.set(key, value + data);
    return this;
  }

  /**
   * Toggle a boolean value for the given key. If the key doesn't already exist in the Data Manager then it is toggled from false.
   *
   * When the value is first set, a `setdata` event is emitted.
   * @param key The key to toggle the value for.
   */
  toggle(key: string | Record<any, any>) {
    if (this._frozen) return this;
    this.set(key, !this.get(key as string));
    return this;
  }

  /**
   * Internal value setter, called automatically by the `set` method.
   * @param key - The key to set the value for.
   * @param data - The value to set.
   */
  private setValue(key: string, data: any) {
    if (this._frozen) return this;
    if (this.has(key)) {
      this.values[key] = data;
    } else {
      const _this = this;
      const list = this.list;
      const events = this.events;
      const parent = this.parent;
      Reflect.defineProperty(this.values, key, {
        enumerable: true,
        configurable: true,
        get: () => list[key],
        set: value => {
          if (!_this._frozen) {
            const previousValue = list[key];
            list[key] = value;
            events.emit(Events.CHANGE_DATA, parent, key, value, previousValue);
            events.emit(
              Events.CHANGE_DATA_KEY + key,
              parent,
              value,
              previousValue
            );
          }
        }
      });
      list[key] = data;
      events.emit(Events.SET_DATA, parent, key, data);
    }
    return this;
  }

  /**
   * Passes all data entries to the given callback.
   * @param callback The function to call.
   * @param context Value to use as `this` when executing callback.
   * @param args Additional arguments that will be passed to the callback, after the game object, key, and data.
   */
  each(callback: DataEachCallback, context?: any, ...args: any[]) {
    const _args = [this.parent, null, undefined];
    let i = 1;
    const length = arguments.length;
    for (i; i < length; i++) {
      _args.push(arguments[i]);
    }
    for (const key in this.list) {
      args[1] = key;
      args[2] = this.list[key];
      callback.apply(context, _args as any);
    }
    return this;
  }

  /**
   * Merge the given object of key value pairs into this DataManager.
   *
   * Any newly created values will emit a `setdata` event. Any updated values (see the `overwrite` argument)
   * will emit a `changedata` event.
   * @param data The data to merge.
   * @param overwrite Whether to overwrite existing data. Defaults to true. Default true.
   */
  merge(data: Record<string, any>, overwrite = true) {
    for (const key in data) {
      if (
        data.hasOwnProperty(key) &&
        (overwrite || (!overwrite && !this.has(key)))
      ) {
        this.setValue(key, data[key]);
      }
    }
    return this;
  }

  /**
   * Remove the value for the given key.
   *
   * If the key is found in this Data Manager it is removed from the internal lists and a
   * `removedata` event is emitted.
   *
   * You can also pass in an array of keys, in which case all keys in the array will be removed:
   *
   * ```javascript
   * this.data.remove([ 'gold', 'armor', 'health' ]);
   * ```
   * @param key The key to remove, or an array of keys to remove.
   */
  remove(key: string | string[]) {
    if (this._frozen) return this;
    if (Array.isArray(key)) {
      let i = 0;
      const length = key.length;
      for (i; i < length; i++) {
        this.removeValue(key[i]);
      }
    } else {
      return this.removeValue(key);
    }
    return this;
  }

  /**
   * Internal value remover, called automatically by the `remove` method.
   * @param key - The key to set the value for.
   * @returns
   */
  private removeValue(key: string) {
    if (this.has(key)) {
      const data = this.list[key];
      delete this.list[key];
      delete this.values[key];
      this.events.emit(Events.REMOVE_DATA, this.parent, key, data);
    }
    return this;
  }

  /**
   * Retrieves the data associated with the given 'key', deletes it from this Data Manager, then returns it.
   * @param key The key of the value to retrieve and delete.
   */
  pop(key: string) {
    let data = undefined;
    if (!this._frozen && this.has(key)) {
      data = this.list[key];
      delete this.list[key];
      delete this.values[key];
      this.events.emit(Events.REMOVE_DATA, this.parent, key, data);
    }
    return data;
  }

  /**
   * Determines whether the given key is set in this Data Manager.
   *
   * Please note that the keys are case-sensitive and must be valid JavaScript Object property strings.
   * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
   * @param key The key to check.
   */
  has(key: string): boolean {
    return this.list.hasOwnProperty(key);
  }

  /**
   * Freeze or unfreeze this Data Manager. A frozen Data Manager will block all attempts
   * to create new values or update existing ones.
   * @param value Whether to freeze or unfreeze the Data Manager.
   */
  setFreeze(value: boolean) {
    this._frozen = value;
    return this;
  }

  /**
   * Delete all data in this Data Manager and unfreeze it.
   */
  reset() {
    for (const key in this.list) {
      delete this.list[key];
      delete this.values[key];
    }
    this._frozen = false;
    return this;
  }

  /**
   * Destroy this data manager.
   */
  destroy(): void {
    this.reset();

    this.events.off(Events.CHANGE_DATA);
    this.events.off(Events.SET_DATA);
    this.events.off(Events.REMOVE_DATA);

    this.parent = null;
  }

  /**
   * Gets or sets the frozen state of this Data Manager.
   * A frozen Data Manager will block all attempts to create new values or update existing ones.
   */
  freeze = {
    get: () => this._frozen,
    set: (value: any) => {
      this._frozen = value ? true : false;
    }
  };

  /**
   * Return the total number of entries in this Data Manager.
   */
  count = {
    get: () => {
      let i = 0;
      for (const key in this.list) {
        if (this.list[key] !== undefined) {
          i++;
        }
      }
      return i;
    }
  };
}
