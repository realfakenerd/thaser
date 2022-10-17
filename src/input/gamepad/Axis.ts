import { EventEmitter } from '@thaser/events';
import Gamepad from './Gamepad';
/**
 * Contains information about a specific Gamepad Axis.
 * Axis objects are created automatically by the Gamepad as they are needed.
 */
export default class Axis {
  /**
   *
   * @param pad A reference to the Gamepad that this Axis belongs to.
   * @param index The index of this Axis.
   */
  constructor(pad: Gamepad, index: number) {
    this.pad = pad;
    this.events = pad.events;
    this.index = index;
  }

  /**
   * A reference to the Gamepad that this Axis belongs to.
   */
  pad: Gamepad;

  /**
   * An event emitter to use to emit the axis events.
   */
  events: EventEmitter;

  /**
   * The index of this Axis.
   */
  index: number;

  /**
   * The raw axis value, between -1 and 1 with 0 being dead center.
   * Use the method `getValue` to get a normalized value with the threshold applied.
   */
  value: number = 0;

  /**
   * Movement tolerance threshold below which axis values are ignored in `getValue`.
   */
  threshold: number = 0.1;

  /**
   * Internal update handler for this Axis.
   * Called automatically by the Gamepad as part of its update.
   * @param value - The value of the axis movement.
   */
  update(value: number) {
    this.value = value;
  }

  /**
   * Applies the `threshold` value to the axis and returns it.
   */
  getValue(): number {
    return Math.abs(this.value) < this.threshold ? 0 : this.value;
  }

  /**
   * Destroys this Axis instance and releases external references it holds.
   */
  destroy(): void {
    this.pad = null as any;
    this.events = null as any;
  }
}
