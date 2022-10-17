import { GetFastValue } from '@thaser/utils';

/**
 * A Timer Event represents a delayed function call. It's managed by a Scene's {@link Clock} and will call its function after a set amount of time has passed. The Timer Event can optionally repeat - i.e. call its function multiple times before finishing, or loop indefinitely.
 *
 * Because it's managed by a Clock, a Timer Event is based on game time, will be affected by its Clock's time scale, and will pause if its Clock pauses.
 */
export default class TimerEvent {
  /**
   *
   * @param config The configuration for the Timer Event, including its delay and callback.
   */
  constructor(config: TimerEventConfig) {
    this.reset(config);
  }

  /**
   * The delay in ms at which this TimerEvent fires.
   */
  private _delay = 0;
  get delay(){
    return this._delay;
  }

  /**
   * The total number of times this TimerEvent will repeat before finishing.
   */
  private _repeat = 0;
  get repeat() {
    return this._repeat;
  }

  /**
   * If repeating this contains the current repeat count.
   */
  repeatCount = 0;

  /**
   * True if this TimerEvent loops, otherwise false.
   */
  private _loop = false;
  get loop() {
    return this._loop;
  }

  /**
   * The callback that will be called when the TimerEvent occurs.
   */
  callback!: Function;

  /**
   * The scope in which the callback will be called.
   */
  callbackScope!: object;

  /**
   * Additional arguments to be passed to the callback.
   */
  args!: any[];

  /**
   * Scale the time causing this TimerEvent to update.
   */
  timeScale = 1;

  /**
   * Start this many MS into the elapsed (useful if you want a long duration with repeat, but for the first loop to fire quickly)
   */
  startAt = 0;

  /**
   * The time in milliseconds which has elapsed since the Timer Event's creation.
   *
   * This value is local for the Timer Event and is relative to its Clock. As such, it's influenced by the Clock's time scale and paused state, the Timer Event's initial {@link #startAt} property, and the Timer Event's {@link #timeScale} and {@link #paused} state.
   */
  elapsed = 0;

  /**
   * Whether or not this timer is paused.
   */
  paused = false;

  /**
   * Whether the Timer Event's function has been called.
   *
   * When the Timer Event fires, this property will be set to `true` before the callback function is invoked and will be reset immediately afterward if the Timer Event should repeat. The value of this property does not directly influence whether the Timer Event will be removed from its Clock, but can prevent it from firing.
   */
  hasDispatched = false;

  /**
   * Completely reinitializes the Timer Event, regardless of its current state, according to a configuration object.
   * @param config The new state for the Timer Event.
   */
  reset(config: TimerEventConfig): TimerEvent {
    this._delay = GetFastValue(config, 'delay', 0);
    this._repeat = GetFastValue(config, 'repeat', 0);
    this._loop = GetFastValue(config, 'loop', false);
    this.callback = GetFastValue(config, 'callback', undefined);
    this.callbackScope = GetFastValue(config, 'callbackScope', this.callback);
    this.args = GetFastValue(config, 'args', []);
    this.timeScale = GetFastValue(config, 'timeScale', 1);
    this.startAt = GetFastValue(config, 'startAt', 0);
    this.paused = GetFastValue(config, 'paused', false);
    this.elapsed = this.startAt;
    this.hasDispatched = false;
    this.repeatCount =
      this._repeat === -1 || this._loop ? 999999999999 : this._repeat;

    return this;
  }

  /**
   * Gets the progress of the current iteration, not factoring in repeats.
   */
  getProgress(): number {
    return this.elapsed / this._delay;
  }

  /**
   * Gets the progress of the timer overall, factoring in repeats.
   */
  getOverallProgress(): number {
    if (this._repeat > 0) {
      const totalDuration = this._delay + this._delay * this._repeat;
      const totalElapsed =
        this.elapsed + this._delay * (this._repeat - this.repeatCount);

      return totalElapsed / totalDuration;
    } else return this.getProgress();
  }

  /**
   * Returns the number of times this Timer Event will repeat before finishing.
   *
   * This should not be confused with the number of times the Timer Event will fire before finishing. A return value of 0 doesn't indicate that the Timer Event has finished running - it indicates that it will not repeat after the next time it fires.
   */
  getRepeatCount(): number {
    return this.repeatCount;
  }

  /**
   * Returns the local elapsed time for the current iteration of the Timer Event.
   */
  getElapsed(): number {
    return this.elapsed;
  }

  /**
   * Returns the local elapsed time for the current iteration of the Timer Event in seconds.
   */
  getElapsedSeconds(): number {
    return this.elapsed * 0.001;
  }

  /**
   * Returns the time interval until the next iteration of the Timer Event.
   */
  getRemaining(): number {
    return this._delay - this.elapsed;
  }

  /**
   * Returns the time interval until the next iteration of the Timer Event in seconds.
   */
  getRemainingSeconds(): number {
    return this.getRemaining() * 0.001;
  }

  /**
   * Returns the time interval until the last iteration of the Timer Event.
   */
  getOverallRemaining(): number {
    return this._delay * (1 + this.repeatCount) - this.elapsed;
  }

  /**
   * Returns the time interval until the last iteration of the Timer Event in seconds.
   */
  getOverallRemainingSeconds(): number {
    return this.getOverallRemaining() * 0.001;
  }

  /**
   * Forces the Timer Event to immediately expire, thus scheduling its removal in the next frame.
   * @param dispatchCallback If `true`, the function of the Timer Event will be called before its removal. Default false.
   */
  remove(dispatchCallback = false): void {
    this.elapsed = this._delay;
    this.hasDispatched = !dispatchCallback;
    this.repeatCount = 0;
  }

  /**
   * Destroys all object references in the Timer Event, i.e. its callback, scope, and arguments.
   *
   * Normally, this method is only called by the Clock when it shuts down. As such, it doesn't stop the Timer Event. If called manually, the Timer Event will still be updated by the Clock, but it won't do anything when it fires.
   */
  destroy(): void {
    this.callback = undefined as any;
    this.callbackScope = undefined as any;
    this.args = [];
  }
}
