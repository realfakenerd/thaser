import { GetFastValue } from '@utils';
import Events from '../events';
import KeyboardPlugin from '../KeyboardPlugin';
import ProcessKeyCombo from './ProcessKeyCombo';
import ResetKeyCombo from './ResetKeyCombo';
/**
 * A KeyCombo will listen for a specific string of keys from the Keyboard, and when it receives them
 * it will emit a `keycombomatch` event from the Keyboard Manager.
 *
 * The keys to be listened for can be defined as:
 *
 * A string (i.e. 'ATARI')
 * An array of either integers (key codes) or strings, or a mixture of both
 * An array of objects (such as Key objects) with a public 'keyCode' property
 *
 * For example, to listen for the Konami code (up, up, down, down, left, right, left, right, b, a, enter)
 * you could pass the following array of key codes:
 *
 * ```javascript
 * this.input.keyboard.createCombo([ 38, 38, 40, 40, 37, 39, 37, 39, 66, 65, 13 ], { resetOnMatch: true });
 *
 * this.input.keyboard.on('keycombomatch', function (event) {
 *     console.log('Konami Code entered!');
 * });
 * ```
 *
 * Or, to listen for the user entering the word PHASER:
 *
 * ```javascript
 * this.input.keyboard.createCombo('PHASER');
 * ```
 */
export default class KeyCombo {
  /**
   *
   * @param keyboardPlugin A reference to the Keyboard Plugin.
   * @param keys The keys that comprise this combo.
   * @param config A Key Combo configuration object.
   */
  constructor(
    keyboardPlugin: KeyboardPlugin,
    keys: string | number[] | Record<any, any>[],
    config: KeyComboConfig = {}
  ) {
    this.manager = keyboardPlugin;

    let i = 0;
    const length = keys.length;
    for (i; i < length; i++) {
      const char = keys[i];

      if (typeof char === 'string') {
        this.keyCodes.push(char.toUpperCase().charCodeAt(0));
      } else if (typeof char === 'number') {
        this.keyCodes.push(char);
      } else if (char.hasOwnProperty('keyCode')) {
        this.keyCodes.push(char.keyCode);
      }
    }

    this.current = this.keyCodes[0];

    this.size = this.keyCodes.length;
    this.resetOnWrongKey = GetFastValue(config, 'maxKeyDelay', 0);
    this.maxKeyDelay = GetFastValue(config, 'maxKeyDelay', 0);
    this.resetOnMatch = GetFastValue(config, 'resetOnMatch', false);
    this.deleteOnMatch = GetFastValue(config, 'deleteOnMatch', false);

    const _this = this;

    function onKeyDownHandler(event: KeyboardEvent) {
      if (_this.matched || !_this.enabled) return;

      const matched = ProcessKeyCombo(event, _this);
      if (matched) {
        _this.manager.emit(Events.COMBO_MATCH, _this, event);
        if (_this.resetOnMatch) {
          ResetKeyCombo(_this);
        } else if (_this.deleteOnMatch) {
          _this.destroy();
        }
      }
    }

    this.onKeyDown = onKeyDownHandler;
    this.manager.on(Events.ANY_KEY_DOWN, this.onKeyDown);
  }

  private onKeyDown: (event: KeyboardEvent) => void;

  /**
   * A reference to the Keyboard Manager
   */
  manager: KeyboardPlugin;

  /**
   * A flag that controls if this Key Combo is actively processing keys or not.
   */
  enabled = true;

  /**
   * An array of the keycodes that comprise this combo.
   */
  keyCodes: any[] = [];

  /**
   * The current keyCode the combo is waiting for.
   */
  current: number;

  /**
   * The current index of the key being waited for in the 'keys' string.
   */
  index = 0;

  /**
   * The length of this combo (in keycodes)
   */
  size: number;

  /**
   * The time the previous key in the combo was matched.
   */
  timeLastMatched = 0;

  /**
   * Has this Key Combo been matched yet?
   */
  matched = false;

  /**
   * The time the entire combo was matched.
   */
  timeMatched = 0;

  /**
   * If they press the wrong key do we reset the combo?
   */
  resetOnWrongKey: boolean;

  /**
   * The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
   */
  maxKeyDelay: number;

  /**
   * If previously matched and they press the first key of the combo again, will it reset?
   */
  resetOnMatch: boolean;

  /**
   * If the combo matches, will it delete itself?
   */
  deleteOnMatch: boolean;

  /**
   * How far complete is this combo? A value between 0 and 1.
   */
  get progress() {
    return this.index / this.size;
  }

  /**
   * Destroys this Key Combo and all of its references.
   */
  destroy(): void {
    this.enabled = false;
    this.keyCodes = [];

    this.manager.off(Events.ANY_KEY_DOWN, this.onKeyDown);

    this.manager = null as any;
  }
}
