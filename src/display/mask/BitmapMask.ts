import { GameObject } from '@thaser/gameobjects';
import { Scene } from '@thaser/scene';
import { Events as GameEvents } from '@thaser/core';
import { Event as RenderEvents } from '@thaser/renderer';
import { CanvasRenderer } from '@thaser/renderer/canvas';
import { WebGLRenderer } from '@thaser/renderer/webgl';
import { Camera } from '@thaser/cameras';
/**
 * A Bitmap Mask combines the alpha (opacity) of a masked pixel with the alpha of another pixel.
 * Unlike the Geometry Mask, which is a clipping path, a Bitmap Mask behaves like an alpha mask,
 * not a clipping path. It is only available when using the WebGL Renderer.
 *
 * A Bitmap Mask can use any Game Object to determine the alpha of each pixel of the masked Game Object(s).
 * For any given point of a masked Game Object's texture, the pixel's alpha will be multiplied by the alpha
 * of the pixel at the same position in the Bitmap Mask's Game Object. The color of the pixel from the
 * Bitmap Mask doesn't matter.
 *
 * For example, if a pure blue pixel with an alpha of 0.95 is masked with a pure red pixel with an
 * alpha of 0.5, the resulting pixel will be pure blue with an alpha of 0.475. Naturally, this means
 * that a pixel in the mask with an alpha of 0 will hide the corresponding pixel in all masked Game Objects
 *  A pixel with an alpha of 1 in the masked Game Object will receive the same alpha as the
 * corresponding pixel in the mask.
 *
 * Note: You cannot combine Bitmap Masks and Blend Modes on the same Game Object. You can, however,
 * combine Geometry Masks and Blend Modes together.
 *
 * The Bitmap Mask's location matches the location of its Game Object, not the location of the
 * masked objects. Moving or transforming the underlying Game Object will change the mask
 * (and affect the visibility of any masked objects), whereas moving or transforming a masked object
 * will not affect the mask.
 *
 * The Bitmap Mask will not render its Game Object by itself. If the Game Object is not in a
 * Scene's display list, it will only be used for the mask and its full texture will not be directly
 * visible. Adding the underlying Game Object to a Scene will not cause any problems - it will
 * render as a normal Game Object and will also serve as a mask.
 */
export default class BitmapMask {
  /**
   *
   * @param scene The Scene which this Bitmap Mask will be used in.
   * @param renderable A renderable Game Object that uses a texture, such as a Sprite.
   */
  constructor(scene: Scene, renderable: GameObject) {
    const renderer = scene.sys.renderer;
    this.renderer = renderer;

    this.bitmapMask = renderable;
    this.scene = scene;

    this.createMask();
    scene.sys.game.events.on(
      GameEvents.CONTEXT_RESTORED,
      this.createMask,
      this
    );
    if (renderer) {
      renderer.on(RenderEvents.RESIZE, this.createMask, this);
    }
  }

  /**
   * A reference to either the Canvas or WebGL Renderer that this Mask is using.
   */
  renderer: CanvasRenderer | WebGLRenderer;

  /**
   * A renderable Game Object that uses a texture, such as a Sprite.
   */
  bitmapMask: GameObject;

  /**
   * The texture used for the masks framebuffer.
   */
  maskTexture: WebGLTexture | null = null;

  /**
   * The texture used for the main framebuffer.
   */
  mainTexture: WebGLTexture | null = null;

  /**
   * Whether the Bitmap Mask is dirty and needs to be updated.
   */
  dirty = true;

  /**
   * The framebuffer to which a masked Game Object is rendered.
   */
  mainFramebuffer: WebGLFramebuffer | null = null;

  /**
   * The framebuffer to which the Bitmap Mask's masking Game Object is rendered.
   */
  maskFramebuffer: WebGLFramebuffer | null = null;

  /**
   * Whether to invert the masks alpha.
   *
   * If `true`, the alpha of the masking pixel will be inverted before it's multiplied with the masked pixel.
   * Essentially, this means that a masked area will be visible only if the corresponding area in the mask is invisible.
   */
  invertAlpha = false;

  /**
   * Is this mask a stencil mask?
   */
  readonly isStencil = false;

  /**
   * The Scene which this Bitmap Mask will be used in.
   */
  scene: Scene;

  /**
   * Creates the WebGL Texture2D objects and Framebuffers required for this
   * mask. If this mask has already been created, then `clearMask` is called first.
   */
  createMask() {
    const renderer = this.renderer;
    if (!renderer || !(renderer as WebGLRenderer).gl) return;
    if (this.mainTexture) this.clearMask();

    const width = renderer.width;
    const height = renderer.height;
    const pot = (width & (width - 1)) === 0 && (height & (height - 1)) === 0;
    const gl = renderer.gl;
    const wrap = pot ? gl.REPEAT : gl.CLAMP_TO_EDGE;
    const filter = gl.LINEAR;

    this.mainTexture = (renderer as WebGLRenderer).createTexture2D(
      0,
      filter,
      filter,
      wrap,
      wrap,
      gl.RGBA,
      null,
      width,
      height
    );
    this.maskTexture = (renderer as WebGLRenderer).createTexture2D(
      0,
      filter,
      filter,
      wrap,
      wrap,
      gl.RGBA,
      null,
      width,
      height
    );
    this.mainFramebuffer = (renderer as WebGLRenderer).createFramebuffer(
      width,
      height,
      this.mainTexture,
      true
    );
    this.maskFramebuffer = (renderer as WebGLRenderer).createFramebuffer(
      width,
      height,
      this.maskTexture,
      true
    );
  }

  /**
   * Deletes the `mainTexture` and `maskTexture` WebGL Textures and deletes
   * the `mainFramebuffer` and `maskFramebuffer` too, nulling all references.
   *
   * This is called when this mask is destroyed, or if you try to creat a new
   * mask from this object when one is already set.
   */
  clearMask() {
    const renderer = this.renderer;
    if (!renderer || !(renderer as WebGLRenderer).gl || !this.mainTexture)
      return;

    (renderer as WebGLRenderer).deleteTexture(this.mainTexture);
    (renderer as WebGLRenderer).deleteTexture(this.maskTexture!);
    (renderer as WebGLRenderer).deleteFramebuffer(this.mainFramebuffer!);
    (renderer as WebGLRenderer).deleteFramebuffer(this.maskFramebuffer!);

    this.mainTexture = null;
    this.maskTexture = null;
    this.mainFramebuffer = null;
    this.maskFramebuffer = null;
  }

  /**
   * Sets a new masking Game Object for the Bitmap Mask.
   * @param renderable A renderable Game Object that uses a texture, such as a Sprite.
   */
  setBitmap(renderable: GameObject) {
    this.bitmapMask = renderable;
  }

  /**
   * Prepares the WebGL Renderer to render a Game Object with this mask applied.
   *
   * This renders the masking Game Object to the mask framebuffer and switches to the main framebuffer so that the masked Game Object will be rendered to it instead of being rendered directly to the frame.
   * @param renderer The WebGL Renderer to prepare.
   * @param maskedObject The masked Game Object which will be drawn.
   * @param camera The Camera to render to.
   */
  preRenderWebGL(
    renderer: WebGLRenderer,
    maskedObject: GameObject,
    camera: Camera
  ) {
    renderer.pipelines.BITMAPMASK_PIPELINE.endMask(this, camera);
  }

  /**
   * Finalizes rendering of a masked Game Object.
   *
   * This resets the previously bound framebuffer and switches the WebGL Renderer to the Bitmap Mask Pipeline, which uses a special fragment shader to apply the masking effect.
   * @param renderer The WebGL Renderer to clean up.
   */
  postRenderWebGL(renderer: WebGLRenderer, camera: Camera) {
    renderer.pipelines.BITMAPMASK_PIPELINE.endMask(this, camera);
  }

  /**
   * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
   */
  preRenderCanvas() {}

  /**
   * This is a NOOP method. Bitmap Masks are not supported by the Canvas Renderer.
   */
  postRenderCanvas() {}

  /**
   * Destroys this BitmapMask and nulls any references it holds.
   *
   * Note that if a Game Object is currently using this mask it will _not_ automatically detect you have destroyed it,
   * so be sure to call `clearMask` on any Game Object using it, before destroying it.
   */
  destroy() {
    this.clearMask();
    this.scene.sys.game.events.off(
      GameEvents.CONTEXT_RESTORED,
      this.createMask,
      this
    );
    if (this.renderer) {
      this.renderer.off(RenderEvents.RESIZE, this.createMask, this);
    }

    this.bitmapMask = null as any;
    this.renderer = null as any;
  }
}
