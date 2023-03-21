/**
 * Provides methods used for calculating and setting the size of a non-Frame based Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class ComputedSize {
  /**
   * The native (un-scaled) width of this Game Object.
   *
   * Changing this value will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or use
   * the `displayWidth` property.
   */
  width = 0;
  /**
   * The native (un-scaled) height of this Game Object.
   *
   * Changing this value will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or use
   * the `displayHeight` property.
   */
  height = 0;
  /**
   * The displayed width of this Game Object.
   *
   * This value takes into account the scale factor.
   *
   * Setting this value will adjust the Game Object's scale property.
   */
  get displayWidth() {
      return this.scaleX * this.width;
  }
  set displayWidth(value) {
      this.scaleX = value / this.width;
  }
  /**
   * The displayed height of this Game Object.
   *
   * This value takes into account the scale factor.
   *
   * Setting this value will adjust the Game Object's scale property.
   */
  get displayHeight() {
      return this.scaleY * this.height;
  }
  set displayHeight(value) {
      this.scaleY = value / this.height;
  }
  /**
   * Sets the internal size of this Game Object, as used for frame or physics body creation.
   *
   * This will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or call the
   * `setDisplaySize` method, which is the same thing as changing the scale but allows you
   * to do so by giving pixel values.
   *
   * If you have enabled this Game Object for input, changing the size will _not_ change the
   * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
   * @param width The width of this Game Object.
   * @param height The height of this Game Object.
   */
  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
    return this;
  }
  /**
   * Sets the display size of this Game Object.
   *
   * Calling this will adjust the scale.
   * @param width The width of this Game Object.
   * @param height The height of this Game Object.
   */
  setDisplaySize(width: number, height: number) {
    this.displayWidth = width;
    this.displayHeight = height;
    return this;
  }
}
