import EventEmitter from 'eventemitter3';
import { Scene } from '@thaser/scene';
import { GetValue } from '@utils';
import InputEvents from '../events';
import InputPlugin from '../InputPlugin';
import InputPluginCache from '../InputPluginCache';
import Events from './events';
import Gamepad from './Gamepad';
/**
 * The Gamepad Plugin is an input plugin that belongs to the Scene-owned Input system.
 *
 * Its role is to listen for native DOM Gamepad Events and then process them.
 *
 * You do not need to create this class directly, the Input system will create an instance of it automatically.
 *
 * You can access it from within a Scene using `this.input.gamepad`.
 *
 * To listen for a gamepad being connected:
 *
 * ```javascript
 * this.input.gamepad.once('connected', function (pad) {
 *     //   'pad' is a reference to the gamepad that was just connected
 * });
 * ```
 *
 * Note that the browser may require you to press a button on a gamepad before it will allow you to access it,
 * this is for security reasons. However, it may also trust the page already, in which case you won't get the
 * 'connected' event and instead should check `GamepadPlugin.total` to see if it thinks there are any gamepads
 * already connected.
 *
 * Once you have received the connected event, or polled the gamepads and found them enabled, you can access
 * them via the built-in properties `GamepadPlugin.pad1` to `pad4`, for up to 4 game pads. With a reference
 * to the gamepads you can poll its buttons and axis sticks. See the properties and methods available on
 * the `Gamepad` class for more details.
 *
 * As of September 2020 Chrome, and likely other browsers, will soon start to require that games requesting
 * access to the Gamepad API are running under SSL. They will actively block API access if they are not.
 *
 * For more information about Gamepad support in browsers see the following resources:
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API
 * https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API
 * https://www.smashingmagazine.com/2015/11/gamepad-api-in-web-games/
 * http://html5gamepad.com/
 */
export default class GamepadPlugin extends EventEmitter {
  /**
   *
   * @param sceneInputPlugin A reference to the Scene Input Plugin that the KeyboardPlugin belongs to.
   */
  constructor(sceneInputPlugin: InputPlugin) {
    super();

    this.scene = sceneInputPlugin.scene;
    this.settings = this.scene.sys.settings;

    this.sceneInputPlugin = sceneInputPlugin;

    sceneInputPlugin.pluginEvents.once(InputEvents.BOOT, this.boot, this);
    sceneInputPlugin.pluginEvents.on(InputEvents.START, this.start, this);
  }

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
   * A boolean that controls if the Gamepad Manager is enabled or not.
   * Can be toggled on the fly.
   */
  enabled = true;

  /**
   * The Gamepad Event target, as defined in the Game Config.
   * Typically the browser window, but can be any interactive DOM element.
   */
  target: any;

  /**
   * An array of the connected Gamepads.
   */
  gamepads: Gamepad[] = [];

  private queue: GamepadEvent[] = [];
  private onGamepadHandler!: (event: GamepadEvent) => void;
  private _pad1!: Gamepad;
  private _pad2!: Gamepad;
  private _pad3!: Gamepad;
  private _pad4!: Gamepad;

  private boot() {
    const game = this.scene.sys.game;
    const settings = this.settings.input;
    const config = game.config;

    this.enabled =
      GetValue(settings, 'gamepad', config.inputGamepad) &&
      game.device.input.gamepads;
    this.target = GetValue(
      settings,
      'gamepad.target',
      config.inputGamepadEventTarget
    );

    this.sceneInputPlugin.pluginEvents.once(
      InputEvents.DESTROY,
      this.destroy,
      this
    );
  }

  private start() {
    if (this.enabled) {
      this.startListeners();
      this.refreshPads();
    }

    this.sceneInputPlugin.pluginEvents.once(
      InputEvents.SHUTDOWN,
      this.shutdown,
      this
    );
  }

  /**
   * Checks to see if both this plugin and the Scene to which it belongs is active.
   */
  isActive() {
    return this.enabled && this.scene.sys.isActive();
  }

  private startListeners() {
    const _this = this;
    const target = this.target;

    function handler(event: GamepadEvent) {
      if (event.defaultPrevented || !_this.isActive()) return;
      _this.refreshPads();
      _this.queue.push(event);
    }

    this.onGamepadHandler = handler;

    target.addEventListener('gamepadconnected', handler, false);
    target.addEventListener('gamepaddisconnected', handler, false);

    this.sceneInputPlugin.pluginEvents.on(
      InputEvents.UPDATE,
      this.update,
      this
    );
  }

  private stopListeners() {
    this.target.removeEventListener('gamepadconnected', this.onGamepadHandler);
    this.target.removeEventListener(
      'gamepaddisconnected',
      this.onGamepadHandler
    );

    this.sceneInputPlugin.pluginEvents.off(InputEvents.UPDATE, this.update);

    for (let i = 0; i < this.gamepads.length; i++) {
      this.gamepads[i].removeAllListeners();
    }
  }

  /**
   * Disconnects all current Gamepads.
   */
  disconnectAll(): void {
    let i = 0;
    const length = this.gamepads.length;
    for (i; i < length; i++) {
      this.gamepads[i].pad.connected = false;
    }
  }

  private refreshPads() {
    const connectedPads = navigator.getGamepads();
    if (!connectedPads) {
      this.disconnectAll();
    } else {
      const currentPads = this.gamepads;
      let i = 0;
      const length = connectedPads.length;
      for (i; i < length; i++) {
        const livePad = connectedPads[i];
        if (!livePad) continue;
        const id = livePad.id;
        const index = livePad.index;
        const currentPad = currentPads[index];

        if (!currentPad) {
          const newPad = new Gamepad(this, livePad);
          currentPads[index] = newPad;

          if (!this._pad1) {
            this._pad1 = newPad;
          } else if (!this._pad2) {
            this._pad2 = newPad;
          } else if (!this._pad3) {
            this._pad3 = newPad;
          } else if (!this._pad4) {
            this._pad4 = newPad;
          }
        } else if (currentPad.id !== id) {
          currentPad.destroy();
          currentPads[index] = new Gamepad(this, livePad);
        } else {
          currentPad.update(livePad);
        }
      }
    }
  }

  /**
   * Returns an array of all currently connected Gamepads.
   */
  getAll(): Gamepad[] {
    const out = [];
    const pads = this.gamepads;
    let i = 0;
    const length = pads.length;
    for (i; i < length; i++) {
      if (pads[i]) {
        out.push(pads[i]);
      }
    }

    return out;
  }

  /**
   * Looks-up a single Gamepad based on the given index value.
   * @param index The index of the Gamepad to get.
   */
  getPad(index: number): Gamepad | undefined {
    const pads = this.gamepads;
    let i = 0;
    const length = pads.length;
    for (i; i < length; i++) {
      if (pads[i] && pads[i].index === index) {
        return pads[i];
      }
    }
  }

  update() {
    if (!this.enabled) return;
    this.refreshPads();

    const len = this.queue.length;

    if (len === 0) return;

    const queue = this.queue.splice(0, len);

    let i = 0;
    for (i; i < len; i++) {
      const event = queue[i];
      const pad = this.getPad(event.gamepad.index);

      if (event.type === 'gamepadconnected') {
        this.emit(Events.CONNECTED, pad, event);
      } else if (event.type === 'gamepaddisconnected') {
        this.emit(Events.DISCONNECTED, pad, event);
      }
    }
  }

  private shutdown() {
    this.stopListeners();
    this.removeAllListeners();
  }

  private destroy() {
    this.shutdown();

    for (var i = 0; i < this.gamepads.length; i++) {
      if (this.gamepads[i]) {
        this.gamepads[i].destroy();
      }
    }

    this.gamepads = [];

    this.scene = null as any;
    this.settings = null as any;
    this.sceneInputPlugin = null as any;
    this.target = null as any;
  }

  /**
   * The total number of connected game pads.
   */
  get total() {
    return this.gamepads.length;
  }

  /**
   * A reference to the first connected Gamepad.
   *
   * This will be undefined if either no pads are connected, or the browser
   * has not yet issued a gamepadconnect, which can happen even if a Gamepad
   * is plugged in, but hasn't yet had any buttons pressed on it.
   */
  get pad1(): Gamepad {
    return this._pad1;
  }

  /**
   * A reference to the second connected Gamepad.
   *
   * This will be undefined if either no pads are connected, or the browser
   * has not yet issued a gamepadconnect, which can happen even if a Gamepad
   * is plugged in, but hasn't yet had any buttons pressed on it.
   */
  get pad2(): Gamepad {
    return this._pad2;
  }

  /**
   * A reference to the third connected Gamepad.
   *
   * This will be undefined if either no pads are connected, or the browser
   * has not yet issued a gamepadconnect, which can happen even if a Gamepad
   * is plugged in, but hasn't yet had any buttons pressed on it.
   */
  get pad3(): Gamepad {
    return this._pad3;
  }

  /**
   * A reference to the fourth connected Gamepad.
   *
   * This will be undefined if either no pads are connected, or the browser
   * has not yet issued a gamepadconnect, which can happen even if a Gamepad
   * is plugged in, but hasn't yet had any buttons pressed on it.
   */
  get pad4(): Gamepad {
    return this._pad4;
  }
}
InputPluginCache.register(
  'GamepadPlugin',
  GamepadPlugin,
  'gamepad',
  'gamepad',
  'inputGamepad'
);
