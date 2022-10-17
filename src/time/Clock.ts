import { PluginCache } from '@thaser/plugins';
import { Scene, Systems, Events as SceneEvents } from '@thaser/scene';
import { Remove } from '@utils';
import TimerEvent from './TimerEvent';

/**
 * The Clock is a Scene plugin which creates and updates Timer Events for its Scene.
 */
export default class Clock {
  /**
   *
   * @param scene The Scene which owns this Clock.
   */
  constructor(scene: Scene) {
    this.scene = scene;
    this.systems = scene.sys;

    scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
    scene.sys.events.on(SceneEvents.START, this.start, this);
  }

  /**
   * The Scene which owns this Clock.
   */
  scene: Scene;

  /**
   * The Scene Systems object of the Scene which owns this Clock.
   */
  systems: Systems;

  /**
   * The current time of the Clock, in milliseconds.
   *
   * If accessed externally, this is equivalent to the `time` parameter normally passed to a Scene's `update` method.
   */
  now = 0;

  /**
   * The scale of the Clock's time delta.
   *
   * The time delta is the time elapsed between two consecutive frames and influences the speed of time for this Clock and anything which uses it, such as its Timer Events. Values higher than 1 increase the speed of time, while values smaller than 1 decrease it. A value of 0 freezes time and is effectively equivalent to pausing the Clock.
   */
  timeScale = 1;

  /**
   * Whether the Clock is paused (`true`) or active (`false`).
   *
   * When paused, the Clock will not update any of its Timer Events, thus freezing time.
   */
  paused = false;

  _active: TimerEvent[] = [];
  _pendingInsertion: TimerEvent[] = [];
  _pendingRemoval: TimerEvent[] = [];

  private boot() {
    this.now = this.systems.game.loop.time;
    this.systems.events.once(SceneEvents.DESTROY, this.destroy, this);
  }

  private start() {
    const eventEmitter = this.systems.events;
    eventEmitter.on(SceneEvents.PRE_UPDATE, this.preUpdate, this);
    eventEmitter.on(SceneEvents.UPDATE, this.update, this);
    eventEmitter.once(SceneEvents.SHUTDOWN, this.shutdown, this);
  }

  /**
   * Creates a Timer Event and adds it to this Clock at the start of the next frame.
   *
   * You can pass in either a `TimerEventConfig` object, from with a new `TimerEvent` will
   * be created, or you can pass in a `TimerEvent` instance.
   *
   * If passing an instance please make sure that this instance hasn't been used before.
   * If it has ever entered a 'completed' state then it will no longer be suitable to
   * run again.
   *
   * Also, if the `TimerEvent` instance is being used by _another_ Clock (in another Scene)
   * it will still be updated by that Clock as well, so be careful when using this feature.
   * @param config The configuration for the Timer Event, or an existing Timer Event object.
   */
  addEvent(config: TimerEvent | TimerEventConfig): TimerEvent {
    let event;
    if (config instanceof TimerEvent) {
      event = config;
      this.removeEvent(event);
      event.elapsed = event.startAt;
      event.hasDispatched = false;
      event.repeatCount =
        event.repeat === -1 || event.loop ? 999999999999 : event.repeat;
    } else {
      event = new TimerEvent(config);
    }
    this._pendingInsertion.push(event);
    return event;
  }

  /**
   * Creates a Timer Event and adds it to the Clock at the start of the frame.
   *
   * This is a shortcut for {@link #addEvent} which can be shorter and is compatible with the syntax of the GreenSock Animation Platform (GSAP).
   * @param delay The delay of the function call, in milliseconds.
   * @param callback The function to call after the delay expires.
   * @param args The arguments to call the function with.
   * @param callbackScope The scope (`this` object) to call the function with.
   */
  delayedCall(
    delay: number,
    callback: Function,
    args?: any[],
    callbackScope?: any
  ): TimerEvent {
    return this.addEvent({ delay, callback, args, callbackScope });
  }

  /**
   * Clears and recreates the array of pending Timer Events.
   */
  clearPendingEvents(): this {
    this._pendingInsertion = [];
    return this;
  }

  /**
   * Removes the given Timer Event, or an array of Timer Events, from this Clock.
   *
   * The events are removed from all internal lists (active, pending and removal),
   * freeing the event up to be re-used.
   * @param events The Timer Event, or an array of Timer Events, to remove from this Clock.
   */
  removeEvent(events: TimerEvent | TimerEvent[]): this {
    if (!Array.isArray(events)) {
      events = [events];
    }

    let i = 0;
    const length = events.length;
    for (i; i < length; i++) {
      var event = events[i];

      Remove(this._pendingRemoval, event);
      Remove(this._pendingInsertion, event);
      Remove(this._active, event);
    }

    return this;
  }

  /**
   * Schedules all active Timer Events for removal at the start of the frame.
   */
  removeAllEvents(): this {
    this._pendingRemoval = this._pendingRemoval.concat(this._active);
    return this;
  }

  /**
   * Updates the arrays of active and pending Timer Events. Called at the start of the frame.
   * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  preUpdate(time: number, delta: number): void {
    const toRemove = this._pendingRemoval.length;
    const toInsert = this._pendingInsertion.length;
    if (toRemove === 0 && toInsert === 0) return;
    let i: number;
    let event;
    for (i = 0; i < toRemove; i++) {
      event = this._pendingRemoval[i];
      const index = this._active.indexOf(event);
      if (index > -1) {
        this._active.splice(index, 1);
      }
      event.destroy();
    }
    for (i = 0; i < toInsert; i++) {
      event = this._pendingInsertion[i];
      this._active.push(event);
    }
    this._pendingRemoval.length = 0;
    this._pendingInsertion.length = 0;
  }

  /**
   * Updates the Clock's internal time and all of its Timer Events.
   * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  update(time: number, delta: number): void {
    this.now = time;
    if (this.paused) return;
    delta *= this.timeScale;
    let i = 0;
    const length = this._active.length;
    for (i; i < length; i++) {
      const event = this._active[i];
      if (event.paused) continue;
      event.elapsed += delta * event.timeScale;

      if (event.elapsed >= event.delay) {
        let remainder = event.elapsed - event.delay;
        event.elapsed = event.delay;
        if (!event.hasDispatched && event.callback) {
          event.hasDispatched = true;
          event.callback.apply(event.callbackScope, event.args);
        }
        if (event.repeatCount > 0) {
          event.repeatCount--;
          if (remainder >= event.delay) {
            while (remainder >= event.delay && event.repeatCount > 0) {
              if (event.callback) {
                event.callback.apply(event.callbackScope, event.args);
              }
              remainder -= event.delay;
              event.repeatCount--;
            }
          }
          event.elapsed = remainder;
          event.hasDispatched = false;
        } else if (event.hasDispatched) {
          this._pendingRemoval.push(event);
        }
      }
    }
  }

  private shutdown() {
    let i: number;

    const iLength = this._pendingInsertion.length;
    const rLength = this._pendingRemoval.length;
    const aLength = this._active.length;
    for (i = 0; i < iLength; i++) {
      this._pendingInsertion[i].destroy();
    }

    for (i = 0; i < aLength; i++) {
      this._active[i].destroy();
    }

    for (i = 0; i < rLength; i++) {
      this._pendingRemoval[i].destroy();
    }

    this._active.length = 0;
    this._pendingRemoval.length = 0;
    this._pendingInsertion.length = 0;

    const eventEmitter = this.systems.events;

    eventEmitter.off(SceneEvents.PRE_UPDATE, this.preUpdate, this);
    eventEmitter.off(SceneEvents.UPDATE, this.update, this);
    eventEmitter.off(SceneEvents.SHUTDOWN, this.shutdown, this);
  }

  private destroy() {
    this.shutdown();
    this.scene.sys.events.off(SceneEvents.START, this.start, this);
    this.scene = null as any;
    this.systems = null as any;
  }
}
PluginCache.register('Clock', Clock, 'time');
