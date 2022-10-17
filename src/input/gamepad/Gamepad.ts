import EventEmitter from 'eventemitter3';
import { Vector2 } from '@thaser/math';
import Axis from './Axis';
import Button from './Button';
import GamepadPlugin from './GamePadPlugin';

/**
 * A single Gamepad.
 *
 * These are created, updated and managed by the Gamepad Plugin.
 */
export default class Gamepad extends EventEmitter {
  /**
   *
   * @param manager A reference to the Gamepad Plugin.
   * @param pad The Gamepad object, as extracted from GamepadEvent.
   */
  constructor(manager: GamepadPlugin, pad: Gamepad['pad']) {
    super();

    this.manager = manager;
    this.pad = pad;

    this.id = pad.id;
    this.index = pad.index;

    for (let i = 0; i < ((pad as any).buttons as Button[]).length; i++) {
      this.buttons.push(new Button(this, i));
    }

    for (let i = 0; i < ((pad as any).axes as Axis[]).length; i++) {
      this.axes.push(new Axis(this, i));
    }

    this.vibration = pad.vibrationActuator;

    const _noButton = {
      value: 0,
      pressed: false
    };

    this._LCLeft = this.buttons[14] ? this.buttons[14] : _noButton;
    this._LCRight = this.buttons[15] ? this.buttons[15] : _noButton;
    this._LCTop = this.buttons[12] ? this.buttons[12] : _noButton;
    this._LCBottom = this.buttons[13] ? this.buttons[13] : _noButton;
    this._RCLeft = this.buttons[2] ? this.buttons[2] : _noButton;
    this._RCRight = this.buttons[1] ? this.buttons[1] : _noButton;
    this._RCTop = this.buttons[3] ? this.buttons[3] : _noButton;
    this._RCBottom = this.buttons[0] ? this.buttons[0] : _noButton;
    this._FBLeftTop = this.buttons[4] ? this.buttons[4] : _noButton;
    this._FBLeftBottom = this.buttons[6] ? this.buttons[6] : _noButton;
    this._FBRightTop = this.buttons[5] ? this.buttons[5] : _noButton;
    this._FBRightBottom = this.buttons[7] ? this.buttons[7] : _noButton;

    const _noAxis = {
      value: 0
    };

    this._HAxisLeft = this.axes[0] ? this.axes[0] : _noAxis;
    this._VAxisLeft = this.axes[1] ? this.axes[1] : _noAxis;
    this._HAxisRight = this.axes[2] ? this.axes[2] : _noAxis;
    this._VAxisRight = this.axes[3] ? this.axes[3] : _noAxis;
  }

  private _LCLeft: Partial<Button>;
  private _LCRight: Partial<Button>;
  private _LCTop: Partial<Button>;
  private _LCBottom: Partial<Button>;
  private _RCLeft: Partial<Button>;
  private _RCRight: Partial<Button>;
  private _RCTop: Partial<Button>;
  private _RCBottom: Partial<Button>;
  private _FBLeftTop: Partial<Button>;
  private _FBLeftBottom: Partial<Button>;
  private _FBRightTop: Partial<Button>;
  private _FBRightBottom: Partial<Button>;
  private _HAxisLeft: Partial<Button>;
  private _VAxisLeft: Partial<Button>;
  private _HAxisRight: Partial<Button>;
  private _VAxisRight: Partial<Button>;

  /**
   * A reference to the Gamepad Plugin.
   */
  manager: GamepadPlugin;

  /**
   * A reference to the native Gamepad object that is connected to the browser.
   */
  pad: any;

  /**
   * A string containing some information about the controller.
   *
   * This is not strictly specified, but in Firefox it will contain three pieces of information
   * separated by dashes (-): two 4-digit hexadecimal strings containing the USB vendor and
   * product id of the controller, and the name of the controller as provided by the driver.
   * In Chrome it will contain the name of the controller as provided by the driver,
   * followed by vendor and product 4-digit hexadecimal strings.
   */
  id: string;

  /**
   * An integer that is unique for each Gamepad currently connected to the system.
   * This can be used to distinguish multiple controllers.
   * Note that disconnecting a device and then connecting a new device may reuse the previous index.
   */
  index: number;

  /**
   * An array of Gamepad Button objects, corresponding to the different buttons available on the Gamepad.
   */
  buttons: Button[] = [];

  /**
   * An array of Gamepad Axis objects, corresponding to the different axes available on the Gamepad, if any.
   */
  axes: Axis[] = [];

  /**
   * The Gamepad's Haptic Actuator (Vibration / Rumble support).
   * This is highly experimental and only set if both present on the device,
   * and exposed by both the hardware and browser.
   */
  vibration: GamepadHapticActuator;

  /**
   * A Vector2 containing the most recent values from the Gamepad's left axis stick.
   * This is updated automatically as part of the Gamepad.update cycle.
   * The H Axis is mapped to the `Vector2.x` property, and the V Axis to the `Vector2.y` property.
   * The values are based on the Axis thresholds.
   * If the Gamepad does not have a left axis stick, the values will always be zero.
   */
  leftStick = new Vector2();

  /**
   * A Vector2 containing the most recent values from the Gamepad's right axis stick.
   * This is updated automatically as part of the Gamepad.update cycle.
   * The H Axis is mapped to the `Vector2.x` property, and the V Axis to the `Vector2.y` property.
   * The values are based on the Axis thresholds.
   * If the Gamepad does not have a right axis stick, the values will always be zero.
   */
  rightStick = new Vector2();

  private _created = performance.now();

  /**
   * Gets the total number of axis this Gamepad claims to support.
   */
  getAxisTotal(): number {
    return this.axes.length;
  }

  /**
   * Gets the value of an axis based on the given index.
   * The index must be valid within the range of axes supported by this Gamepad.
   * The return value will be a float between 0 and 1.
   * @param index The index of the axes to get the value for.
   */
  getAxisValue(index: number): number {
    return this.axes[index].getValue();
  }

  /**
   * Sets the threshold value of all axis on this Gamepad.
   * The value is a float between 0 and 1 and is the amount below which the axis is considered as not having been moved.
   * @param value A value between 0 and 1.
   */
  setAxisThreshold(value: number): void {
    let i = 0;
    const length = this.axes.length;
    for (i; i < length; i++) {
      this.axes[i].threshold = value;
    }
  }

  /**
   * Gets the total number of buttons this Gamepad claims to have.
   */
  getButtonTotal(): number {
    return this.buttons.length;
  }

  /**
   * Gets the value of a button based on the given index.
   * The index must be valid within the range of buttons supported by this Gamepad.
   *
   * The return value will be either 0 or 1 for an analogue button, or a float between 0 and 1
   * for a pressure-sensitive digital button, such as the shoulder buttons on a Dual Shock.
   * @param index The index of the button to get the value for.
   */
  getButtonValue(index: number): number {
    return this.buttons[index].value;
  }

  /**
   * Returns if the button is pressed down or not.
   * The index must be valid within the range of buttons supported by this Gamepad.
   * @param index The index of the button to get the value for.
   */
  isButtonDown(index: number): boolean {
    return this.buttons[index].pressed;
  }

  update(pad: any) {
    if (pad.timestamp < this._created) return;
    let i: number;
    const localButtons = this.buttons;
    const gamepadButtons = pad.buttons;

    const len = localButtons.length;

    for (i = 0; i < len; i++) {
      localButtons[i].update(gamepadButtons[i].value);
    }

    const localAxes = this.axes;
    const gamepadAxes = pad.axes;

    for (i = 0; i < len; i++) {
      localAxes[i].update(gamepadAxes[i]);
    }

    if (len >= 2) {
      this.leftStick.set(localAxes[0].getValue(), localAxes[1].getValue());
      if (len >= 4) {
        this.rightStick.set(localAxes[2].getValue(), localAxes[3].getValue());
      }
    }
  }

  /**
   * Destroys this Gamepad instance, its buttons and axes, and releases external references it holds.
   */
  destroy(): void {
    this.removeAllListeners();

    this.manager = null as any;
    this.pad = null as any;

    let i: number;

    for (i = 0; i < this.buttons.length; i++) {
      this.buttons[i].destroy();
    }

    for (i = 0; i < this.axes.length; i++) {
      this.axes[i].destroy();
    }

    this.buttons = [];
    this.axes = [];
  }

  /**
   * Is this Gamepad currently connected or not?
   */
  get connected() {
    return this.pad.connected;
  }

  /**
   * A timestamp containing the most recent time this Gamepad was updated.
   */
  get timestamp(): number {
    return this.pad.timestamp;
  }

  /**
   * Is the Gamepad's Left button being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * This is the d-pad left button under standard Gamepad mapping.
   */
  get left() {
    return this._LCLeft.pressed;
  }

  /**
   * Is the Gamepad's Right button being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * This is the d-pad right button under standard Gamepad mapping.
   */
  get right() {
    return this._LCRight.pressed;
  }

  /**
   * Is the Gamepad's Up button being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * This is the d-pad up button under standard Gamepad mapping.
   */
  get up() {
    return this._LCTop.pressed;
  }

  /**
   * Is the Gamepad's Down button being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * This is the d-pad down button under standard Gamepad mapping.
   */
  get down() {
    return this._LCBottom.pressed;
  }

  /**
   * Is the Gamepad's bottom button in the right button cluster being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * On a Dual Shock controller it's the X button.
   * On an XBox controller it's the A button.
   */
  get A() {
    return this._RCBottom.pressed;
  }

  /**
   * Is the Gamepad's top button in the right button cluster being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * On a Dual Shock controller it's the Triangle button.
   * On an XBox controller it's the Y button.
   */
  get Y() {
    return this._RCTop.pressed;
  }

  /**
   * Is the Gamepad's left button in the right button cluster being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * On a Dual Shock controller it's the Square button.
   * On an XBox controller it's the X button.
   */
  get X() {
    return this._RCLeft.pressed;
  }

  /**
   * Is the Gamepad's right button in the right button cluster being pressed?
   * If the Gamepad doesn't have this button it will always return false.
   * On a Dual Shock controller it's the Circle button.
   * On an XBox controller it's the B button.
   */
  get B() {
    return this._RCRight.pressed;
  }

  /**
   * Returns the value of the Gamepad's top left shoulder button.
   * If the Gamepad doesn't have this button it will always return zero.
   * The value is a float between 0 and 1, corresponding to how depressed the button is.
   * On a Dual Shock controller it's the L1 button.
   * On an XBox controller it's the LB button.
   */
  get L1() {
    return this._FBLeftTop.value;
  }

  /**
   * Returns the value of the Gamepad's bottom left shoulder button.
   * If the Gamepad doesn't have this button it will always return zero.
   * The value is a float between 0 and 1, corresponding to how depressed the button is.
   * On a Dual Shock controller it's the L2 button.
   * On an XBox controller it's the LT button.
   */
  get L2() {
    return this._FBLeftBottom.value;
  }

  /**
   * Returns the value of the Gamepad's top right shoulder button.
   * If the Gamepad doesn't have this button it will always return zero.
   * The value is a float between 0 and 1, corresponding to how depressed the button is.
   * On a Dual Shock controller it's the R1 button.
   * On an XBox controller it's the RB button.
   */
  get R1() {
    return this._FBRightTop.value;
  }

  /**
   * Returns the value of the Gamepad's bottom right shoulder button.
   * If the Gamepad doesn't have this button it will always return zero.
   * The value is a float between 0 and 1, corresponding to how depressed the button is.
   * On a Dual Shock controller it's the R2 button.
   * On an XBox controller it's the RT button.
   */
  get R2() {
    return this._FBRightBottom.value;
  }
}
