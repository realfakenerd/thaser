import EventEmitter from 'eventemitter3';
import Events from '../events';
import KeyboardPlugin from '../KeyboardPlugin';

/**
 * A generic Key object which can be passed to the Process functions (and so on)
 * keycode must be an integer
 */
export default class Key extends EventEmitter {
  /**
   *
   * @param plugin The Keyboard Plugin instance that owns this Key object.
   * @param keyCode The keycode of this key.
   */
  constructor(plugin: KeyboardPlugin, keyCode: number) {
    super();
    this.plugin = plugin;
    this.keyCode = keyCode;
  }

  /**
   * The Keyboard Plugin instance that owns this Key object.
   */
  plugin: KeyboardPlugin;

  /**
   * The keycode of this key.
   */
  keyCode: number;

  /**
   * The original DOM event.
   */
  originalEvent: KeyboardEvent = undefined as any;

  /**
   * Can this Key be processed?
   */
  enabled = true;

  /**
   * The "down" state of the key. This will remain `true` for as long as the keyboard thinks this key is held down.
   */
  isDown = false;

  /**
   * The "up" state of the key. This will remain `true` for as long as the keyboard thinks this key is up.
   */
  isUp = true;

  /**
   * The down state of the ALT key, if pressed at the same time as this key.
   */
  altKey = false;

  /**
   * The down state of the CTRL key, if pressed at the same time as this key.
   */
  ctrlKey = false;

  /**
   * The down state of the SHIFT key, if pressed at the same time as this key.
   */
  shiftKey = false;

  /**
   * The down state of the Meta key, if pressed at the same time as this key.
   * On a Mac the Meta Key is the Command key. On Windows keyboards, it's the Windows key.
   */
  metaKey = false;

  /**
   * The location of the modifier key. 0 for standard (or unknown), 1 for left, 2 for right, 3 for numpad.
   */
  location = 0;

  /**
   * The timestamp when the key was last pressed down.
   */
  timeDown = 0;

  /**
   * The number of milliseconds this key was held down for in the previous down - up sequence.
   * This value isn't updated every game step, only when the Key changes state.
   * To get the current duration use the `getDuration` method.
   */
  duration = 0;

  /**
   * The timestamp when the key was last released.
   */
  timeUp = 0;

  /**
   * When a key is held down should it continuously fire the `down` event each time it repeats?
   *
   * By default it will emit the `down` event just once, but if you wish to receive the event
   * for each repeat as well, enable this property.
   */
  emitOnRepeat = false;

  /**
   * If a key is held down this holds down the number of times the key has 'repeated'.
   */
  repeats = 0;

  _justDown = false;
  _justUp = false;
  _tick = -1;

  /**
   * Controls if this Key will continuously emit a `down` event while being held down (true),
   * or emit the event just once, on first press, and then skip future events (false).
   * @param value Emit `down` events on repeated key down actions, or just once?
   */
  setEmitOnRepeat(value: boolean): this {
    this.emitOnRepeat = value;
    return this;
  }

  /**
   * Processes the Key Down action for this Key.
   * Called automatically by the Keyboard Plugin.
   * @param event The native DOM Keyboard event.
   */
  onDown(event: KeyboardEvent): void {
    this.originalEvent = event;

    if (!this.enabled) return;

    this.altKey = event.altKey;
    this.ctrlKey = event.ctrlKey;
    this.shiftKey = event.shiftKey;
    this.metaKey = event.metaKey;
    this.location = event.location;

    this.repeats++;

    if (!this.isDown) {
      this.isDown = true;
      this.isUp = false;
      this.timeDown = event.timeStamp;
      this.duration = 0;
      this._justDown = true;
      this._justUp = false;

      this.emit(Events.DOWN, this, event);
    } else if (this.emitOnRepeat) {
      this.emit(Events.DOWN, this, event);
    }
  }

  /**
   * Processes the Key Up action for this Key.
   * Called automatically by the Keyboard Plugin.
   * @param event The native DOM Keyboard event.
   */
  onUp(event: KeyboardEvent): void {
    this.originalEvent = event;

    if (!this.enabled) return;

    this.isDown = false;
    this.isUp = true;
    this.timeUp = event.timeStamp;
    this.duration = this.timeUp - this.timeDown;
    this.repeats = 0;

    this._justDown = false;
    this._justUp = true;
    this._tick = -1;

    this.emit(Events.UP, this, event);
  }

  /**
   * Resets this Key object back to its default un-pressed state.
   *
   * As of version 3.60.0 it no longer resets the `enabled` or `preventDefault` flags.
   */
  reset(): this {
    this.isDown = false;
    this.isUp = true;
    this.altKey = false;
    this.ctrlKey = false;
    this.shiftKey = false;
    this.metaKey = false;
    this.timeDown = 0;
    this.duration = 0;
    this.timeUp = 0;
    this.repeats = 0;
    this._justDown = false;
    this._justUp = false;
    this._tick = -1;

    return this;
  }

  /**
   * Returns the duration, in ms, that the Key has been held down for.
   *
   * If the key is not currently down it will return zero.
   *
   * To get the duration the Key was held down for in the previous up-down cycle,
   * use the `Key.duration` property value instead.
   */
  getDuration(): number {
    if (this.isDown) return this.plugin.game.loop.time - this.timeDown;
    else return 0;
  }

  /**
   * Removes any bound event handlers and removes local references.
   */
  destroy(): void {
    this.removeAllListeners();
    this.originalEvent = null as any;
    this.plugin = null as any;
  }
}
