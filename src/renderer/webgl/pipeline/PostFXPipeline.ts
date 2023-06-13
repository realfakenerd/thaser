import { WebGLPipelineConfig } from '@thaser/types/renderer/webgl';
import WebGLPipeline from '../WebGLPipeline';
import { GameObject } from '@thaser/gameobjects';

/**
 * The Post FX Pipeline is a special kind of pipeline specifically for handling post
 * processing effects. Where-as a standard Pipeline allows you to control the process
 * of rendering Game Objects by configuring the shaders and attributes used to draw them,
 * a Post FX Pipeline is designed to allow you to apply processing _after_ the Game Object/s
 * have been rendered. Typical examples of post processing effects are bloom filters,
 * blurs, light effects and color manipulation.
 *
 * The pipeline works by creating a tiny vertex buffer with just one single hard-coded quad
 * in it. Game Objects can have a Post Pipeline set on them. Those objects are then rendered
 * using their standard pipeline, but are redirected to the Render Targets owned by the
 * post pipeline, which can then apply their own shaders and effects, before passing them
 * back to the main renderer.
 *
 * Please see the Phaser 3 examples for further details on this extensive subject.
 *
 * The default fragment shader it uses can be found in `shaders/src/PostFX.frag`.
 * The default vertex shader it uses can be found in `shaders/src/Quad.vert`.
 *
 * The default shader attributes for this pipeline are:
 *
 * `inPosition` (vec2, offset 0)
 * `inTexCoord` (vec2, offset 8)
 *
 * The vertices array layout is:
 *
 * -1,  1   B----C   1,  1
 *  0,  1   |   /|   1,  1
 *          |  / |
 *          | /  |
 *          |/   |
 * -1, -1   A----D   1, -1
 *  0,  0            1,  0
 *
 * A = -1, -1 (pos) and 0, 0 (uv)
 * B = -1,  1 (pos) and 0, 1 (uv)
 * C =  1,  1 (pos) and 1, 1 (uv)
 * D =  1, -1 (pos) and 1, 0 (uv)
 *
 * First tri: A, B, C
 * Second tri: A, C, D
 *
 * Array index:
 *
 * 0  = Tri 1 - Vert A - x pos
 * 1  = Tri 1 - Vert A - y pos
 * 2  = Tri 1 - Vert A - uv u
 * 3  = Tri 1 - Vert A - uv v
 *
 * 4  = Tri 1 - Vert B - x pos
 * 5  = Tri 1 - Vert B - y pos
 * 6  = Tri 1 - Vert B - uv u
 * 7  = Tri 1 - Vert B - uv v
 *
 * 8  = Tri 1 - Vert C - x pos
 * 9  = Tri 1 - Vert C - y pos
 * 10 = Tri 1 - Vert C - uv u
 * 11 = Tri 1 - Vert C - uv v
 *
 * 12 = Tri 2 - Vert A - x pos
 * 13 = Tri 2 - Vert A - y pos
 * 14 = Tri 2 - Vert A - uv u
 * 15 = Tri 2 - Vert A - uv v
 *
 * 16 = Tri 2 - Vert C - x pos
 * 17 = Tri 2 - Vert C - y pos
 * 18 = Tri 2 - Vert C - uv u
 * 19 = Tri 2 - Vert C - uv v
 *
 * 20 = Tri 2 - Vert D - x pos
 * 21 = Tri 2 - Vert D - y pos
 * 22 = Tri 2 - Vert D - uv u
 * 23 = Tri 2 - Vert D - uv v
 */
export default class PostFXPipeline extends WebGLPipeline {
  /**
   *
   * @param config The configuration options for this pipeline.
   */
  constructor(config: WebGLPipelineConfig) {
    super(config);
  }

  /**
   * If this post-pipeline belongs to a Game Object or Camera, this contains a reference to it.
   */
  gameObject: GameObject;

  /**
   * A Color Matrix instance belonging to this pipeline.
   *
   * Used during calls to the `drawFrame` method.
   */
  colorMatrix: Phaser.Display.ColorMatrix;

  /**
   * A reference to the Full Frame 1 Render Target that belongs to the
   * Utility Pipeline. This property is set during the `boot` method.
   *
   * This Render Target is the full size of the renderer.
   *
   * You can use this directly in Post FX Pipelines for multi-target effects.
   * However, be aware that these targets are shared between all post fx pipelines.
   */
  fullFrame1: Phaser.Renderer.WebGL.RenderTarget;

  /**
   * A reference to the Full Frame 2 Render Target that belongs to the
   * Utility Pipeline. This property is set during the `boot` method.
   *
   * This Render Target is the full size of the renderer.
   *
   * You can use this directly in Post FX Pipelines for multi-target effects.
   * However, be aware that these targets are shared between all post fx pipelines.
   */
  fullFrame2: Phaser.Renderer.WebGL.RenderTarget;

  /**
   * A reference to the Half Frame 1 Render Target that belongs to the
   * Utility Pipeline. This property is set during the `boot` method.
   *
   * This Render Target is half the size of the renderer.
   *
   * You can use this directly in Post FX Pipelines for multi-target effects.
   * However, be aware that these targets are shared between all post fx pipelines.
   */
  halfFrame1: Phaser.Renderer.WebGL.RenderTarget;

  /**
   * A reference to the Half Frame 2 Render Target that belongs to the
   * Utility Pipeline. This property is set during the `boot` method.
   *
   * This Render Target is half the size of the renderer.
   *
   * You can use this directly in Post FX Pipelines for multi-target effects.
   * However, be aware that these targets are shared between all post fx pipelines.
   */
  halfFrame2: Phaser.Renderer.WebGL.RenderTarget;

  /**
   * Copy the `source` Render Target to the `target` Render Target.
   *
   * You can optionally set the brightness factor of the copy.
   *
   * The difference between this method and `drawFrame` is that this method
   * uses a faster copy shader, where only the brightness can be modified.
   * If you need color level manipulation, see `drawFrame` instead.
   * @param source The source Render Target.
   * @param target The target Render Target.
   * @param brightness The brightness value applied to the frame copy. Default 1.
   * @param clear Clear the target before copying? Default true.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   */
  copyFrame(
    source: Phaser.Renderer.WebGL.RenderTarget,
    target?: Phaser.Renderer.WebGL.RenderTarget,
    brightness?: number,
    clear?: boolean,
    clearAlpha?: boolean
  ): void;

  /**
   * Pops the framebuffer from the renderers FBO stack and sets that as the active target,
   * then draws the `source` Render Target to it. It then resets the renderer textures.
   *
   * This should be done when you need to draw the _final_ results of a pipeline to the game
   * canvas, or the next framebuffer in line on the FBO stack. You should only call this once
   * in the `onDraw` handler and it should be the final thing called. Be careful not to call
   * this if you need to actually use the pipeline shader, instead of the copy shader. In
   * those cases, use the `bindAndDraw` method.
   * @param source The Render Target to draw from.
   */
  copyToGame(source: Phaser.Renderer.WebGL.RenderTarget): void;

  /**
   * Copy the `source` Render Target to the `target` Render Target, using the
   * given Color Matrix.
   *
   * The difference between this method and `copyFrame` is that this method
   * uses a color matrix shader, where you have full control over the luminance
   * values used during the copy. If you don't need this, you can use the faster
   * `copyFrame` method instead.
   * @param source The source Render Target.
   * @param target The target Render Target.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   */
  drawFrame(
    source: Phaser.Renderer.WebGL.RenderTarget,
    target?: Phaser.Renderer.WebGL.RenderTarget,
    clearAlpha?: boolean
  ): void;

  /**
   * Draws the `source1` and `source2` Render Targets to the `target` Render Target
   * using a linear blend effect, which is controlled by the `strength` parameter.
   * @param source1 The first source Render Target.
   * @param source2 The second source Render Target.
   * @param target The target Render Target.
   * @param strength The strength of the blend. Default 1.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   */
  blendFrames(
    source1: Phaser.Renderer.WebGL.RenderTarget,
    source2: Phaser.Renderer.WebGL.RenderTarget,
    target?: Phaser.Renderer.WebGL.RenderTarget,
    strength?: number,
    clearAlpha?: boolean
  ): void;

  /**
   * Draws the `source1` and `source2` Render Targets to the `target` Render Target
   * using an additive blend effect, which is controlled by the `strength` parameter.
   * @param source1 The first source Render Target.
   * @param source2 The second source Render Target.
   * @param target The target Render Target.
   * @param strength The strength of the blend. Default 1.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   */
  blendFramesAdditive(
    source1: Phaser.Renderer.WebGL.RenderTarget,
    source2: Phaser.Renderer.WebGL.RenderTarget,
    target?: Phaser.Renderer.WebGL.RenderTarget,
    strength?: number,
    clearAlpha?: boolean
  ): void;

  /**
   * Clears the given Render Target.
   * @param target The Render Target to clear.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   */
  clearFrame(
    target: Phaser.Renderer.WebGL.RenderTarget,
    clearAlpha?: boolean
  ): void;

  /**
   * Copy the `source` Render Target to the `target` Render Target.
   *
   * The difference with this copy is that no resizing takes place. If the `source`
   * Render Target is larger than the `target` then only a portion the same size as
   * the `target` dimensions is copied across.
   *
   * You can optionally set the brightness factor of the copy.
   * @param source The source Render Target.
   * @param target The target Render Target.
   * @param brightness The brightness value applied to the frame copy. Default 1.
   * @param clear Clear the target before copying? Default true.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   * @param eraseMode Erase source from target using ERASE Blend Mode? Default false.
   */
  blitFrame(
    source: Phaser.Renderer.WebGL.RenderTarget,
    target: Phaser.Renderer.WebGL.RenderTarget,
    brightness?: number,
    clear?: boolean,
    clearAlpha?: boolean,
    eraseMode?: boolean
  ): void;

  /**
   * Binds the `source` Render Target and then copies a section of it to the `target` Render Target.
   *
   * This method is extremely fast because it uses `gl.copyTexSubImage2D` and doesn't
   * require the use of any shaders. Remember the coordinates are given in standard WebGL format,
   * where x and y specify the lower-left corner of the section, not the top-left. Also, the
   * copy entirely replaces the contents of the target texture, no 'merging' or 'blending' takes
   * place.
   * @param source The source Render Target.
   * @param target The target Render Target.
   * @param x The x coordinate of the lower left corner where to start copying.
   * @param y The y coordinate of the lower left corner where to start copying.
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param clear Clear the target before copying? Default true.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   */
  copyFrameRect(
    source: Phaser.Renderer.WebGL.RenderTarget,
    target: Phaser.Renderer.WebGL.RenderTarget,
    x: number,
    y: number,
    width: number,
    height: number,
    clear?: boolean,
    clearAlpha?: boolean
  ): void;

  /**
   * Binds this pipeline and draws the `source` Render Target to the `target` Render Target.
   *
   * If no `target` is specified, it will pop the framebuffer from the Renderers FBO stack
   * and use that instead, which should be done when you need to draw the final results of
   * this pipeline to the game canvas.
   *
   * You can optionally set the shader to be used for the draw here, if this is a multi-shader
   * pipeline. By default `currentShader` will be used. If you need to set a shader but not
   * a target, just pass `null` as the `target` parameter.
   * @param source The Render Target to draw from.
   * @param target The Render Target to draw to. If not set, it will pop the fbo from the stack.
   * @param clear Clear the target before copying? Only used if `target` parameter is set. Default true.
   * @param clearAlpha Clear the alpha channel when running `gl.clear` on the target? Default true.
   * @param currentShader The shader to use during the draw.
   */
  bindAndDraw(
    source: Phaser.Renderer.WebGL.RenderTarget,
    target?: Phaser.Renderer.WebGL.RenderTarget,
    clear?: boolean,
    clearAlpha?: boolean,
    currentShader?: Phaser.Renderer.WebGL.WebGLShader
  ): void;
}
