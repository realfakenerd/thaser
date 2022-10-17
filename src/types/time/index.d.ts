interface TimerEventConfig {
  /**
   * The delay after which the Timer Event should fire, in milliseconds.
   */
  delay?: number;
  /**
   * The total number of times the Timer Event will repeat before finishing.
   */
  repeat?: number;
  /**
   * `true` if the Timer Event should repeat indefinitely.
   */
  loop?: boolean;
  /**
   * The callback which will be called when the Timer Event fires.
   */
  callback?: Function;
  /**
   * The scope (`this` object) with which to invoke the `callback`.
   */
  callbackScope?: any;
  /**
   * Additional arguments to be passed to the `callback`.
   */
  args?: any[];
  /**
   * The scale of the elapsed time.
   */
  timeScale?: number;
  /**
   * The initial elapsed time in milliseconds. Useful if you want a long duration with repeat, but for the first loop to fire quickly.
   */
  startAt?: number;
  /**
   * `true` if the Timer Event should be paused.
   */
  paused?: boolean;
}
