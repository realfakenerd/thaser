import { EventEmitter } from '@thaser/events';
import Events from './events';
import Gamepad from './Gamepad';
/**
 * Contains information about a specific button on a Gamepad.
 * Button objects are created automatically by the Gamepad as they are needed.
 */
export default class Button {
  /**
   *
   * @param pad A reference to the Gamepad that this Button belongs to.
   * @param index The index of this Button.
   */
  constructor(pad: Gamepad, index: number) {
    this.pad = pad;
    this.events = pad.manager;
    this.index = index;
  }

  /**
   * A reference to the Gamepad that this Button belongs to.
   */
  pad: Gamepad;

  /**
   * An event emitter to use to emit the button events.
   */
  events: EventEmitter;

  /**
   * The index of this Button.
   */
  index: number;

  /**
   * Between 0 and 1.
   */
  value = 0;

  /**
   * Can be set for analogue buttons to enable a 'pressure' threshold,
   * before a button is considered as being 'pressed'.
   */
  threshold = 1;

  /**
   * Is the Button being pressed down or not?
   */
  pressed = false;

  update(value: number) {
    this.value = value;
    const pad = this.pad;
    const index = this.index;
    if (value >= this.threshold) {
      if (!this.pressed) {
        this.pressed = true;
        this.events.emit(Events.BUTTON_DOWN, pad, this, value);
        this.pad.emit(Events.GAMEPAD_BUTTON_DOWN, index, value, this);
      }
    } else if (this.pressed) {
      this.pressed = false;
      this.events.emit(Events.BUTTON_UP, pad, this, value);
      this.pad.emit(Events.GAMEPAD_BUTTON_UP, index, value, this);
    }
  }

  /**
   * Destroys this Button instance and releases external references it holds.
   */
  destroy(): void {
    this.pad = null as any;
    this.events = null as any;
  }
}
