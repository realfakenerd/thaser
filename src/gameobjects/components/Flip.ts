/**
 * Provides methods used for visually flipping a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class Flip {
  /**
   * The horizontally flipped state of the Game Object.
   *
   * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   */
  flipX = false;
  /**
   * The vertically flipped state of the Game Object.
   *
   * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   */
  flipY = false;
  /**
   * Toggles the horizontal flipped state of this Game Object.
   *
   * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   */
  toggleFlipX() {
    this.flipX = !this.flipX;
    return this;
  }
  /**
   * Toggles the vertical flipped state of this Game Object.
   */
  toggleFlipY() {
    this.flipY = !this.flipY;
    return this;
  }
  /**
   * Sets the horizontal flipped state of this Game Object.
   *
   * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   * @param value The flipped state. `false` for no flip, or `true` to be flipped.
   */
  setFlipX(value: boolean) {
    this.flipY = value;
    return this;
  }
  /**
   * Sets the vertical flipped state of this Game Object.
   * @param value The flipped state. `false` for no flip, or `true` to be flipped.
   */
  setFlipY(value: boolean) {
    this.flipY = value;
    return this;
  }
  /**
   * Sets the horizontal and vertical flipped state of this Game Object.
   *
   * A Game Object that is flipped will render inversed on the flipped axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   * @param x The horizontal flipped state. `false` for no flip, or `true` to be flipped.
   * @param y The horizontal flipped state. `false` for no flip, or `true` to be flipped.
   */
  setFlip(x: boolean, y: boolean) {
    this.flipX = x;
    this.flipY = y;
    return this;
  }
  /**
   * Resets the horizontal and vertical flipped state of this Game Object back to their default un-flipped state.
   */
  resetFlip() {
    this.flipX = false;
    this.flipY = false;
    return this;
  }
}
