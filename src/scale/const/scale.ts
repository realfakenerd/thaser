/**
 * Phaser Scale Manager constants for the different scale modes available.
 */
const enum ScaleModes {
  /**
   * No scaling happens at all. The canvas is set to the size given in the game config and Phaser doesn't change it
   * again from that point on. If you change the canvas size, either via CSS, or directly via code, then you need
   * to call the Scale Managers `resize` method to give the new dimensions, or input events will stop working.
   */
  NONE,
  /**
   * The height is automatically adjusted based on the width.
   */
  WIDTH_CONTROLS_HEIGHT,
  /**
   * The width is automatically adjusted based on the height.
   */
  HEIGHT_CONTROLS_WIDTH,
  /**
   * The width and height are automatically adjusted to fit inside the given target area,
   * while keeping the aspect ratio. Depending on the aspect ratio there may be some space
   * inside the area which is not covered.
   */
  FIT,
  /**
   * The width and height are automatically adjusted to make the size cover the entire target
   * area while keeping the aspect ratio. This may extend further out than the target size.
   */
  ENVELOP,
  /**
   * The Canvas is resized to fit all available _parent_ space, regardless of aspect ratio.
   */
  RESIZE
}

export default ScaleModes;