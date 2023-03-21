/**
 * Provides methods used for setting the depth of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class Depth {
  /** Private internal value. Holds the depth of the Game Object. */
  private _depth = 0;
  /**
   * The depth of this Game Object within the Scene. Ensure this value is only ever set to a number data-type.
   *
   * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
   * of Game Objects, without actually moving their position in the display list.
   *
   * The default depth is zero. A Game Object with a higher depth
   * value will always render in front of one with a lower value.
   *
   * Setting the depth will queue a depth sort event within the Scene.
   */
  get depth() {
    return this._depth;
  }
  set depth(value: number) {
    if (this.displayList) this.displayList.queueDepthSort();
    this._depth = value;
  }
  /**
   * The depth of this Game Object within the Scene.
   *
   * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
   * of Game Objects, without actually moving their position in the display list.
   *
   * The default depth is zero. A Game Object with a higher depth
   * value will always render in front of one with a lower value.
   *
   * Setting the depth will queue a depth sort event within the Scene.
   * @param value The depth of this Game Object. Ensure this value is only ever a number data-type.
   */
  setDepth(value = 0) {
    this.depth = value;
    return this;
  }
}
