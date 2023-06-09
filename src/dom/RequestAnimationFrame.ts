import { NOOP } from '@thaser/utils';

/**
 * Abstracts away the use of RAF or setTimeOut for the core game update loop.
 *
 * This is invoked automatically by the Phaser.Game instance.
 */
export default class RequestAnimationFrame {
  /**
   * True if RequestAnimationFrame is running, otherwise false.
   */
  isRunning = false;

  /**
   * The callback to be invoked each step.
   */
  callback: FrameRequestCallback = NOOP;

  /**
   * True if the step is using setTimeout instead of RAF.
   */
  isSetTimeOut = false;

  /**
   * The setTimeout or RAF callback ID used when canceling them.
   */
  timeOutID: number | null = null;

  /**
   * The delay rate in ms for setTimeOut.
   */
  delay = 0;

  /**
   * The RAF step function.
   *
   * Invokes the callback and schedules another call to requestAnimationFrame.
   * @param {number} time - The timestamp passed in from RequestAnimationFrame.
   */
  step(time: number) {
    this.callback(time);

    if (this.isRunning) {
      this.timeOutID = requestAnimationFrame(this.step);
    }
  }

  /**
   * The SetTimeout step function.
   *
   * Invokes the callback and schedules another call to setTimeout.
   */
  stepTimeout() {
    if (this.isRunning) {
      this.timeOutID = setTimeout(this.stepTimeout, this.delay);
    }

    this.callback(performance.now());
  }

  /**
   * Starts the requestAnimationFrame or setTimeout process running.
   * @param callback The callback to invoke each step.
   * @param forceSetTimeOut Should it use SetTimeout, even if RAF is available?
   * @param delay The setTimeout delay rate in ms.
   */
  start(
    callback: FrameRequestCallback,
    forceSetTimeOut: boolean,
    delay: number
  ) {
    if (this.isRunning) return;

    this.callback = callback;
    this.isSetTimeOut = forceSetTimeOut;
    this.delay = delay;
    this.isRunning = true;
    this.timeOutID = forceSetTimeOut
      ? setTimeout(this.stepTimeout, 0)
      : requestAnimationFrame(this.step);
  }

  /**
   * Stops the requestAnimationFrame or setTimeout from running.
   */
  stop() {
    this.isRunning = false;
    if(this.isSetTimeOut) {
        clearTimeout(this.timeOutID!);
    } else {
        cancelAnimationFrame(this.timeOutID!);
    }
  }

  /**
   * Stops the step from running and clears the callback reference.
   */
  destroy() {
    this.stop();
    this.callback = NOOP;
  }
}
