import EventEmitter from 'eventemitter3';
import { Scene, Events as SceneEvents } from '@thaser/scene';
import InputPlugin from '../InputPlugin';
import KeyCombo from './combo/KeyCombo';
import KeyboardManager from './KeyboardManager';
import { Key, KeyCodes } from './keys';
import InputEvents from '../events';
import { Events as GameEvents } from '@thaser/core';
import { GetValue } from '@utils';
import InputPluginCache from '../InputPluginCache';

/**
 * The Keyboard Plugin is an input plugin that belongs to the Scene-owned Input system.
 *
 * Its role is to listen for native DOM Keyboard Events and then process them.
 *
 * You do not need to create this class directly, the Input system will create an instance of it automatically.
 *
 * You can access it from within a Scene using `this.input.keyboard`. For example, you can do:
 *
 * ```javascript
 * this.input.keyboard.on('keydown', callback, context);
 * ```
 *
 * Or, to listen for a specific key:
 *
 * ```javascript
 * this.input.keyboard.on('keydown-A', callback, context);
 * ```
 *
 * You can also create Key objects, which you can then poll in your game loop:
 *
 * ```javascript
 * var spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
 * ```
 *
 * If you have multiple parallel Scenes, each trying to get keyboard input, be sure to disable capture on them to stop them from
 * stealing input from another Scene in the list. You can do this with `this.input.keyboard.enabled = false` within the
 * Scene to stop all input, or `this.input.keyboard.preventDefault = false` to stop a Scene halting input on another Scene.
 *
 * _Note_: Many keyboards are unable to process certain combinations of keys due to hardware limitations known as ghosting.
 * See http://www.html5gamedevs.com/topic/4876-impossible-to-use-more-than-2-keyboard-input-buttons-at-the-same-time/ for more details
 * and use the site https://w3c.github.io/uievents/tools/key-event-viewer.html to test your n-key support in browser.
 *
 * Also please be aware that certain browser extensions can disable or override Phaser keyboard handling.
 * For example the Chrome extension vimium is known to disable Phaser from using the D key, while EverNote disables the backtick key.
 * And there are others. So, please check your extensions before opening Phaser issues about keys that don't work.
 */
export default class KeyboardPlugin extends EventEmitter {
  queue!: any[];

  /**
   *
   * @param sceneInputPlugin A reference to the Scene Input Plugin that the KeyboardPlugin belongs to.
   */
  constructor(sceneInputPlugin: InputPlugin) {
    super();

    this.game = sceneInputPlugin.systems.game;
    this.scene = sceneInputPlugin.scene;
    this.settings = this.scene.sys.settings;

    this.sceneInputPlugin = sceneInputPlugin;

    this.manager = sceneInputPlugin.manager.keyboard;

    sceneInputPlugin.pluginEvents.once(InputEvents.BOOT, this.boot, this);
    sceneInputPlugin.pluginEvents.on(InputEvents.START, this.start, this);
  }

  /**
   * A reference to the core game, so we can listen for visibility events.
   */
  game: Game;

  /**
   * A reference to the Scene that this Input Plugin is responsible for.
   */
  scene: Scene;

  /**
   * A reference to the Scene Systems Settings.
   */
  settings: SettingsObject;

  /**
   * A reference to the Scene Input Plugin that created this Keyboard Plugin.
   */
  sceneInputPlugin: InputPlugin;

  /**
   * A reference to the global Keyboard Manager.
   */
  manager: KeyboardManager;

  /**
   * A boolean that controls if this Keyboard Plugin is enabled or not.
   * Can be toggled on the fly.
   */
  enabled = true;

  /**
   * An array of Key objects to process.
   */
  keys: Key[] = [];

  /**
   * An array of KeyCombo objects to process.
   */
  combos: KeyCombo[] = [];

  private prevCode: string | null = null;
  private prevTime = 0;
  private prevType: string | null = null;

  private boot() {
    const settings = this.settings.input;

    this.enabled = GetValue(settings, 'keyboard', true);

    var captures = GetValue(settings, 'keyboard.capture', null);

    if (captures) {
      this.addCaptures(captures);
    }

    this.sceneInputPlugin.pluginEvents.once(
      InputEvents.DESTROY,
      this.destroy,
      this
    );
  }

  private start() {
    this.sceneInputPlugin.manager.events.on(
      InputEvents.MANAGER_PROCESS,
      this.update,
      this
    );

    this.sceneInputPlugin.pluginEvents.once(
      InputEvents.SHUTDOWN,
      this.shutdown,
      this
    );

    this.game.events.on(GameEvents.BLUR, this.resetKeys, this);

    this.scene.sys.events.on(SceneEvents.PAUSE, this.resetKeys, this);
    this.scene.sys.events.on(SceneEvents.SLEEP, this.resetKeys, this);
  }

  /**
   * Checks to see if both this plugin and the Scene to which it belongs is active.
   */
  isActive(): boolean {
    return this.enabled && this.scene.sys.isActive();
  }

  /**
   * By default when a key is pressed Phaser will not stop the event from propagating up to the browser.
   * There are some keys this can be annoying for, like the arrow keys or space bar, which make the browser window scroll.
   *
   * This `addCapture` method enables consuming keyboard events for specific keys, so they don't bubble up the browser
   * and cause the default behaviors.
   *
   * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to say prevent
   * the SPACE BAR from triggering a page scroll, then it will prevent it for any Scene in your game, not just the calling one.
   *
   * You can pass a single key code value:
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
   * Or, a comma-delimited string:
   *
   * ```javascript
   * this.input.keyboard.addCapture('W,S,A,D');
   * ```
   *
   * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
   *
   * You can also provide an array mixing both strings and key code integers.
   * @param keycode The Key Codes to enable event capture for.
   */
  addCapture(keycode: string | number | number[] | any[]): this {
    this.manager.addCapture(keycode);
    return this;
  }

  /**
   * Removes an existing key capture.
   *
   * Please note that keyboard captures are global. This means that if you call this method from within a Scene, to remove
   * the capture of a key, then it will remove it for any Scene in your game, not just the calling one.
   *
   * You can pass a single key code value:
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
   * Or, a comma-delimited string:
   *
   * ```javascript
   * this.input.keyboard.removeCapture('W,S,A,D');
   * ```
   *
   * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
   *
   * You can also provide an array mixing both strings and key code integers.
   * @param keycode The Key Codes to disable event capture for.
   */
  removeCapture(keycode: string | number | number[] | any[]): this {
    this.manager.removeCapture(keycode);
    return this;
  }

  /**
   * Returns an array that contains all of the keyboard captures currently enabled.
   */
  getCaptures(): number[] {
    return this.manager.captures;
  }

  /**
   * Allows Phaser to prevent any key captures you may have defined from bubbling up the browser.
   * You can use this to re-enable event capturing if you had paused it via `disableGlobalCapture`.
   */
  enableGlobalCapture(): this {
    this.manager.preventDefault = true;
    return this;
  }

  /**
   * Disables Phaser from preventing any key captures you may have defined, without actually removing them.
   * You can use this to temporarily disable event capturing if, for example, you swap to a DOM element.
   */
  disableGlobalCapture(): this {
    this.manager.preventDefault = false;
    return this;
  }

  /**
   * Removes all keyboard captures.
   *
   * Note that this is a global change. It will clear all event captures across your game, not just for this specific Scene.
   */
  clearCaptures(): this {
    this.manager.clearCaptures();
    return this;
  }

  /**
   * Creates and returns an object containing 4 hotkeys for Up, Down, Left and Right, and also Space Bar and shift.
   */
  createCursorKeys(): CursorKeys {
    return this.addKeys({
      up: KeyCodes.UP,
      down: KeyCodes.DOWN,
      left: KeyCodes.LEFT,
      right: KeyCodes.RIGHT,
      space: KeyCodes.SPACE,
      shift: KeyCodes.SHIFT
    });
  }

  /**
   * A practical way to create an object containing user selected hotkeys.
   *
   * For example:
   *
   * ```javascript
   * this.input.keyboard.addKeys({ 'up': Phaser.Input.Keyboard.KeyCodes.W, 'down': Phaser.Input.Keyboard.KeyCodes.S });
   * ```
   *
   * would return an object containing the properties (`up` and `down`) mapped to W and S {@link Phaser.Input.Keyboard.Key} objects.
   *
   * You can also pass in a comma-separated string:
   *
   * ```javascript
   * this.input.keyboard.addKeys('W,S,A,D');
   * ```
   *
   * Which will return an object with the properties W, S, A and D mapped to the relevant Key objects.
   *
   * To use non-alpha numeric keys, use a string, such as 'UP', 'SPACE' or 'LEFT'.
   * @param keys An object containing Key Codes, or a comma-separated string.
   * @param enableCapture Automatically call `preventDefault` on the native DOM browser event for the key codes being added. Default true.
   * @param emitOnRepeat Controls if the Key will continuously emit a 'down' event while being held down (true), or emit the event just once (false, the default). Default false.
   */
  addKeys<T extends object = any>(
    keys: Record<string, any> | string,
    enableCapture = true,
    emitOnRepeat = false
  ): T {
    const output: Record<any, any> = {};

    if (typeof keys === 'string') {
      keys = keys.split(',');

      let i = 0;
      const length = keys.length;
      for (i; i < length; i++) {
        const currentKey = keys[i].trim();

        if (currentKey) {
          output[currentKey] = this.addKey(
            currentKey,
            enableCapture,
            emitOnRepeat
          );
        }
      }
    } else {
      for (const key in keys) {
        output[key] = this.addKey(keys[key], enableCapture, emitOnRepeat);
      }
    }

    return output;
  }

  /**
   * Adds a Key object to this Keyboard Plugin.
   *
   * The given argument can be either an existing Key object, a string, such as `A` or `SPACE`, or a key code value.
   *
   * If a Key object is given, and one already exists matching the same key code, the existing one is replaced with the new one.
   * @param key Either a Key object, a string, such as `A` or `SPACE`, or a key code value.
   * @param enableCapture Automatically call `preventDefault` on the native DOM browser event for the key codes being added. Default true.
   * @param emitOnRepeat Controls if the Key will continuously emit a 'down' event while being held down (true), or emit the event just once (false, the default). Default false.
   */
  addKey(
    key: Key | string | number,
    enableCapture = true,
    emitOnRepeat = false
  ): Key {
    const keys = this.keys;

    if (key instanceof Key) {
      const idx = keys.indexOf(key);

      if (idx > -1) {
        keys[idx] = key;
      } else {
        keys[key.keyCode] = key;
      }

      if (enableCapture) {
        this.addCapture(key.keyCode);
      }

      key.setEmitOnRepeat(emitOnRepeat);

      return key;
    }

    if (typeof key === 'string') {
      key = KeyCodes[key.toUpperCase() as any];
    }

    if (!keys[key]) {
      keys[key] = new Key(this, key);

      if (enableCapture) {
        this.addCapture(key);
      }

      keys[key].setEmitOnRepeat(emitOnRepeat);
    }

    return keys[key];
  }

  /**
   * Removes a Key object from this Keyboard Plugin.
   *
   * The given argument can be either a Key object, a string, such as `A` or `SPACE`, or a key code value.
   * @param key Either a Key object, a string, such as `A` or `SPACE`, or a key code value.
   * @param destroy Call `Key.destroy` on the removed Key object? Default false.
   * @param removeCapture Remove this Key from being captured? Only applies if set to capture when created. Default false.
   */
  removeKey(
    key: Key | string | number,
    destroy = false,
    removeCapture = false
  ): this {
    const keys = this.keys;
    let ref;

    if (key instanceof Key) {
      const idx = keys.indexOf(key);

      if (idx > -1) {
        ref = this.keys[idx];

        this.keys[idx] = undefined as any;
      }
    } else if (typeof key === 'string') {
      key = KeyCodes[key.toUpperCase() as any];
    }

    if (keys[key]) {
      ref = keys[key];

      keys[key] = undefined;
    }

    if (ref) {
      ref.plugin = null;

      if (removeCapture) {
        this.removeCapture(ref.keyCode);
      }

      if (destroy) {
        ref.destroy();
      }
    }

    return this;
  }

  /**
   * Removes all Key objects created by _this_ Keyboard Plugin.
   * @param destroy Call `Key.destroy` on each removed Key object? Default false.
   * @param removeCapture Remove all key captures for Key objects owened by this plugin? Default false.
   */
  removeAllKeys(destroy = false, removeCapture = false): this {
    const keys = this.keys;

    let i = 0;
    const length = keys.length;
    for (i; i < length; i++) {
      var key = keys[i];

      if (key) {
        keys[i] = undefined as any;

        if (removeCapture) {
          this.removeCapture(key.keyCode);
        }

        if (destroy) {
          key.destroy();
        }
      }
    }

    return this;
  }

  /**
   * Creates a new KeyCombo.
   *
   * A KeyCombo will listen for a specific string of keys from the Keyboard, and when it receives them
   * it will emit a `keycombomatch` event from this Keyboard Plugin.
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
   * @param keys The keys that comprise this combo.
   * @param config A Key Combo configuration object.
   */
  createCombo(
    keys: string | number[] | object[],
    config?: KeyComboConfig
  ): KeyCombo {
    return new KeyCombo(this, keys, config);
  }

  /**
   * Checks if the given Key object is currently being held down.
   *
   * The difference between this method and checking the `Key.isDown` property directly is that you can provide
   * a duration to this method. For example, if you wanted a key press to fire a bullet, but you only wanted
   * it to be able to fire every 100ms, then you can call this method with a `duration` of 100 and it
   * will only return `true` every 100ms.
   *
   * If the Keyboard Plugin has been disabled, this method will always return `false`.
   * @param key A Key object.
   * @param duration The duration which must have elapsed before this Key is considered as being down. Default 0.
   */
  checkDown(key: Key, duration = 0): boolean {
    if (this.enabled && key.isDown) {
      const t = SnapFloor(this.time - key.timeDown, duration);

      if (t > key._tick) {
        key._tick = t;

        return true;
      }
    }

    return false;
  }

  private update() {
    const queue = this.manager.queue;
    const len = queue.length;

    if (!this.isActive() || len === 0) return;

    const keys = this.keys;

    let i = 0;
    for (i; i < len; i++) {
      const event = queue[i];
      const code = event.keyCode;
      const key = keys[code];
      let repeat = false;

      //  Override the default functions (it's too late for the browser to use them anyway, so we may as well)
      if (event.cancelled === undefined) {
        //  Event allowed to flow across all handlers in this Scene, and any other Scene in the Scene list
        event.cancelled = 0;

        //  Won't reach any more local (Scene level) handlers
        event.stopImmediatePropagation = function () {
          event.cancelled = 1;
        };

        //  Won't reach any more handlers in any Scene further down the Scene list
        event.stopPropagation = function () {
          event.cancelled = -1;
        };
      }

      if (event.cancelled === -1) {
        //  This event has been stopped from broadcasting to any other Scene, so abort.
        continue;
      }

      //  Duplicate event bailout
      if (
        code === this.prevCode &&
        event.timeStamp === this.prevTime &&
        event.type === this.prevType
      ) {
        //  On some systems, the exact same event will fire multiple times. This prevents it.
        continue;
      }

      this.prevCode = code;
      this.prevTime = event.timeStamp;
      this.prevType = event.type;

      if (event.type === 'keydown') {
        //  Key specific callback first
        if (key) {
          repeat = key.isDown;

          key.onDown(event);
        }

        if (!event.cancelled && (!key || !repeat)) {
          if (KeyMap[code]) {
            this.emit(Events.KEY_DOWN + KeyMap[code], event);
          }

          if (!event.cancelled) {
            this.emit(Events.ANY_KEY_DOWN, event);
          }
        }
      } else {
        //  Key specific callback first
        if (key) {
          key.onUp(event);
        }

        if (!event.cancelled) {
          if (KeyMap[code]) {
            this.emit(Events.KEY_UP + KeyMap[code], event);
          }

          if (!event.cancelled) {
            this.emit(Events.ANY_KEY_UP, event);
          }
        }
      }

      //  Reset the cancel state for other Scenes to use
      if (event.cancelled === 1) {
        event.cancelled = 0;
      }
    }
  }

  /**
   * Resets all Key objects created by _this_ Keyboard Plugin back to their default un-pressed states.
   * This can only reset keys created via the `addKey`, `addKeys` or `createCursorKeys` methods.
   * If you have created a Key object directly you'll need to reset it yourself.
   *
   * This method is called automatically when the Keyboard Plugin shuts down, but can be
   * invoked directly at any time you require.
   */
  resetKeys(): this {
    const keys = this.keys;

    let i = 0;
    const length = keys.length;
    for (i; i < length; i++) {
      //  Because it's a sparsely populated array
      if (keys[i]) {
        keys[i].reset();
      }
    }

    return this;
  }

  private shutdown() {
    this.removeAllKeys(true);
    this.removeAllListeners();

    this.sceneInputPlugin.manager.events.off(
      InputEvents.MANAGER_PROCESS,
      this.update,
      this
    );

    this.game.events.off(GameEvents.BLUR, this.resetKeys);

    this.scene.sys.events.off(SceneEvents.PAUSE, this.resetKeys, this);
    this.scene.sys.events.off(SceneEvents.SLEEP, this.resetKeys, this);

    this.queue = [];
  }

  private destroy() {
    this.shutdown();

    const keys = this.keys;

    let i = 0;
    const length = keys.length;
    for (i; i < length; i++) {
      //  Because it's a sparsely populated array
      if (keys[i]) {
        keys[i].destroy();
      }
    }

    this.keys = [];
    this.combos = [];
    this.queue = [];

    this.scene = null as any;
    this.settings = null as any;
    this.sceneInputPlugin = null as any;
    this.manager = null as any;
  }

  get time() {
    return this.sceneInputPlugin.manager.time;
  }
}
InputPluginCache.register(
  'KeyboardPlugin',
  KeyboardPlugin,
  'keyboard',
  'keyboard',
  'inputKeyboard'
);
