/**
 * Provides methods used for setting the FX values of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class FX {
  /**
   * The amount of extra padding to be applied to this Game Object
   * when it is being rendered by a SpriteFX Pipeline.
   *
   * Lots of FX require additional spacing added to the texture the
   * Game Object uses, for example a glow or shadow effect, and this
   * method allows you to control how much extra padding is included
   * in addition to the texture size.
   */
  fxPadding = 0;
  /**
   * Sets the amount of extra padding to be applied to this Game Object
   * when it is being rendered by a SpriteFX Pipeline.
   *
   * Lots of FX require additional spacing added to the texture the
   * Game Object uses, for example a glow or shadow effect, and this
   * method allows you to control how much extra padding is included
   * in addition to the texture size.
   * @param padding The amount of padding to add to the texture. Default 0.
   */
  setFXPadding(padding = 0) {
    this.fxPadding = padding;
    return this;
  }
  /**
   * This callback is invoked when this Game Object is copied by a SpriteFX Pipeline.
   *
   * This happens when the pipeline uses its `copySprite` method.
   *
   * It's invoked prior to the copy, allowing you to set shader uniforms, etc on the pipeline.
   * @param pipeline The SpriteFX Pipeline that invoked this callback.
   */
  onFXCopy(pipeline: Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline): void {}
  /**
   * This callback is invoked when this Game Object is rendered by a SpriteFX Pipeline.
   *
   * This happens when the pipeline uses its `drawSprite` method.
   *
   * It's invoked prior to the draw, allowing you to set shader uniforms, etc on the pipeline.
   * @param pipeline The SpriteFX Pipeline that invoked this callback.
   */
  onFX(pipeline: Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline): void {}
}
