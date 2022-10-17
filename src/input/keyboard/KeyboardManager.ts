import { NOOP } from '../../utils';
import InputEvents from '../events';
import GameEvents from '../../core/events';
import { KeyCodes } from './keys';
/**
 * The Keyboard Manager is a helper class that belongs to the global Input Manager.
 *
 * Its role is to listen for native DOM Keyboard Events and then store them for further processing by the Keyboard Plugin.
 *
 * You do not need to create this class directly, the Input Manager will create an instance of it automatically if keyboard
 * input has been enabled in the Game Config.
 */
export default class KeyboardManager {
  /**
   *
   * @param inputManager A reference to the Input Manager.
   */
  constructor(inputManager: InputManager) {
    this.manager = inputManager;
    inputManager.events.once(InputEvents.MANAGER_BOOT, this.boot, this);
  }

  /**
   * A reference to the Input Manager.
   */
  manager: InputManager;

  queue: KeyboardEvent[] = [];

  /**
   * A flag that controls if the non-modified keys, matching those stored in the `captures` array,
   * have `preventDefault` called on them or not.
   *
   * A non-modified key is one that doesn't have a modifier key held down with it. The modifier keys are
   * shift, control, alt and the meta key (Command on a Mac, the Windows Key on Windows).
   * Therefore, if the user presses shift + r, it won't prevent this combination, because of the modifier.
   * However, if the user presses just the r key on its own, it will have its event prevented.
   *
   * If you wish to stop capturing the keys, for example switching out to a DOM based element, then
   * you can toggle this property at run-time.
   */
  preventDefault = true;

  /**
   * An array of Key Code values that will automatically have `preventDefault` called on them,
   * as long as the `KeyboardManager.preventDefault` boolean is set to `true`.
   *
   * By default the array is empty.
   *
   * The key must be non-modified when pressed in order to be captured.
   *
   * A non-modified key is one that doesn't have a modifier key held down with it. The modifier keys are
   * shift, control, alt and the meta key (Command on a Mac, the Windows Key on Windows).
   * Therefore, if the user presses shift + r, it won't prevent this combination, because of the modifier.
   * However, if the user presses just the r key on its own, it will have its event prevented.
   *
   * If you wish to stop capturing the keys, for example switching out to a DOM based element, then
   * you can toggle the `KeyboardManager.preventDefault` boolean at run-time.
   *
   * If you need more specific control, you can create Key objects and set the flag on each of those instead.
   *
   * This array can be populated via the Game Config by setting the `input.keyboard.capture` array, or you
   * can call the `addCapture` method. See also `removeCapture` and `clearCaptures`.
   */
  captures: number[] = [];

  /**
   * A boolean that controls if the Keyboard Manager is enabled or not.
   * Can be toggled on the fly.
   */
  enabled = false;

  /**
   * The Keyboard Event target, as defined in the Game Config.
   * Typically the window in which the game is rendering, but can be any interactive DOM element.
   */
  target: any;

  /**
   * The Key Down Event handler.
   * This function is sent the native DOM KeyEvent.
   * Initially empty and bound in the `startListeners` method.
   */
  onKeyDown: Function = NOOP;

  /**
   * The Key Up Event handler.
   * This function is sent the native DOM KeyEvent.
   * Initially empty and bound in the `startListeners` method.
   */
  onKeyUp: Function = NOOP;

  private boot() {
    const config = this.manager.config;

    this.enabled = config.inputKeyboard;
    this.target = config.inputKeyboardEventTarget;

    this.addCapture(config.inputKeyboardCapture);

    if (!this.target && window) {
      this.target = window;
    }

    if (this.enabled && this.target) {
      this.startListeners();
    }

    this.manager.game.events.on(GameEvents.POST_STEP, this.postUpdate, this);
  }

  /**
   * Starts the Keyboard Event listeners running.
   * This is called automatically and does not need to be manually invoked.
   */
  startListeners(): void {
    const _this = this;

    this.onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !_this.enabled || !_this.manager) return;

      _this.queue.push(event);

      _this.manager.events.emit(InputEvents.MANAGER_PROCESS);

      const modified =
        event.altKey || event.ctrlKey || event.shiftKey || event.metaKey;

      if (
        _this.preventDefault &&
        !modified &&
        _this.captures.indexOf(event.keyCode) > -1
      ) {
        event.preventDefault();
      }
    };

    this.onKeyUp = (event: KeyboardEvent) => {
      if (event.defaultPrevented || !_this.enabled || !_this.manager) return;

      _this.queue.push(event);

      _this.manager.events.emit(InputEvents.MANAGER_PROCESS);

      const modified =
        event.altKey || event.ctrlKey || event.shiftKey || event.metaKey;

      if (
        _this.preventDefault &&
        !modified &&
        _this.captures.indexOf(event.keyCode) > -1
      ) {
        event.preventDefault();
      }
    };

    const target = this.target;
    if (target) {
      target.addEventListener('keydown', this.onKeyDown, false);
      target.addEventListener('keyup', this.onKeyUp, false);

      this.enabled = true;
    }
  }

  /**
   * Stops the Key Event listeners.
   * This is called automatically and does not need to be manually invoked.
   */
  stopListeners(): void {
    const target = this.target;

    target.removeEventListener('keydown', this.onKeyDown, false);
    target.removeEventListener('keyup', this.onKeyUp, false);

    this.enabled = false;
  }

  /**
   * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
   * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
   *
   * This `addCapture` method enables consuming keyboard event for specific keys so it doesn't bubble up to the the browser
   * and cause the default browser behavior.
   *
   * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to say prevent
   * the SPACE BAR from triggering a page scroll, then it will prevent it for any Scene in your game, not just the calling one.
   *
   * You can pass in a single key code value, or an array of key codes, or a string:
   *
   * ```javascript
   * this.input.keyboard.addCapture(62);
   * ```
   *
   * An array of key codes:
   *
   * ```javascript
   * this.input.keyboard.addCapture([ 62, 63, 64 ]);
   * ```
   *
   * Or a string:
   *
   * ```javascript
   * this.input.keyboard.addCapture('W,S,A,D');
   * ```
   *
   * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
   *
   * You can also provide an array mixing both strings and key code integers.
   *
   * If there are active captures after calling this method, the `preventDefault` property is set to `true`.
   * @param keycode The Key Codes to enable capture for, preventing them reaching the browser.
   */
  addCapture(keycode: string | number | number[] | any[]): void {
    if (typeof keycode === 'string') {
      keycode = keycode.split(',');
    }

    if (!Array.isArray(keycode)) {
      keycode = [keycode];
    }

    const captures = this.captures;

    let i = 0;
    const length = keycode.length;
    for (i; i < length; i++) {
      let code = keycode[i];

      if (typeof code === 'string') {
        code = KeyCodes[code.trim().toUpperCase() as any];
      }

      if (captures.indexOf(code) === -1) {
        captures.push(code);
      }
    }

    this.preventDefault = captures.length > 0;
  }

  private postUpdate() {
    this.queue = [];
  }

  /**
   * Removes an existing key capture.
   *
   * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to remove
   * the capture of a key, then it will remove it for any Scene in your game, not just the calling one.
   *
   * You can pass in a single key code value, or an array of key codes, or a string:
   *
   * ```javascript
   * this.input.keyboard.removeCapture(62);
   * ```
   *
   * An array of key codes:
   *
   * ```javascript
   * this.input.keyboard.removeCapture([ 62, 63, 64 ]);
   * ```
   *
   * Or a string:
   *
   * ```javascript
   * this.input.keyboard.removeCapture('W,S,A,D');
   * ```
   *
   * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
   *
   * You can also provide an array mixing both strings and key code integers.
   *
   * If there are no captures left after calling this method, the `preventDefault` property is set to `false`.
   * @param keycode The Key Codes to disable capture for, allowing them reaching the browser again.
   */
  removeCapture(keycode: string | number | number[] | any[]): void {
    if (typeof keycode === 'string') {
      keycode = keycode.split(',');
    }

    if (!Array.isArray(keycode)) {
      keycode = [keycode];
    }

    const captures = this.captures;
    let i = 0;
    const length = keycode.length;
    for (i; i < length; i++) {
      let code = keycode[i];

      if (typeof code === 'string') {
        code = KeyCodes[code.toUpperCase() as any];
      }

      ArrayRemove(captures, code);
    }

    this.preventDefault = captures.length > 0;
  }

  /**
   * Removes all keyboard captures and sets the `preventDefault` property to `false`.
   */
  clearCaptures(): void {
    this.captures = [];

    this.preventDefault = false;
  }

  /**
   * Destroys this Keyboard Manager instance.
   */
  destroy(): void {
    this.stopListeners();

    this.clearCaptures();

    this.queue = [];

    this.manager.game.events.off(GameEvents.POST_RENDER, this.postUpdate, this);

    this.target = null as any;
    this.enabled = false;
    this.manager = null as any;
  }
}
