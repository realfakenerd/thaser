import { GameObject, Graphics } from '@thaser/gameobjects';
import { WebGLRenderer } from '@thaser/renderer/webgl';
import { Camera } from '@thaser/cameras';
import { CanvasRenderer } from '@thaser/renderer/canvas';
import { Scene } from '@thaser/scene';
/**
 * A Geometry Mask can be applied to a Game Object to hide any pixels of it which don't intersect
 * a visible pixel from the geometry mask. The mask is essentially a clipping path which can only
 * make a masked pixel fully visible or fully invisible without changing its alpha (opacity).
 *
 * A Geometry Mask uses a Graphics Game Object to determine which pixels of the masked Game Object(s)
 * should be clipped. For any given point of a masked Game Object's texture, the pixel will only be displayed
 * if the Graphics Game Object of the Geometry Mask has a visible pixel at the same position. The color and
 * alpha of the pixel from the Geometry Mask do not matter.
 *
 * The Geometry Mask's location matches the location of its Graphics object, not the location of the masked objects.
 * Moving or transforming the underlying Graphics object will change the mask (and affect the visibility
 * of any masked objects), whereas moving or transforming a masked object will not affect the mask.
 * You can think of the Geometry Mask (or rather, of its Graphics object) as an invisible curtain placed
 * in front of all masked objects which has its own visual properties and, naturally, respects the camera's
 * visual properties, but isn't affected by and doesn't follow the masked objects by itself.
 */
export default class GeometryMask {
  /**
   *
   * @param scene This parameter is not used.
   * @param graphicsGeometry The Graphics Game Object to use for the Geometry Mask. Doesn't have to be in the Display List.
   */
  constructor(scene: Scene, graphicsGeometry: Graphics) {
    this.geometryMask = graphicsGeometry;
  }

  /**
   * The Graphics object which describes the Geometry Mask.
   */
  geometryMask: Graphics;

  /**
   * Similar to the BitmapMasks invertAlpha setting this to true will then hide all pixels
   * drawn to the Geometry Mask.
   *
   * This is a WebGL only feature.
   */
  invertAlpha = false;

  /**
   * Is this mask a stencil mask?
   */
  readonly isStencil = true;

  /**
   * Sets a new Graphics object for the Geometry Mask.
   * @param graphicsGeometry The Graphics object which will be used for the Geometry Mask.
   */
  setShape(graphicsGeometry: Graphics) {
    this.geometryMask = graphicsGeometry;
    return this;
  }

  /**
   * Sets the `invertAlpha` property of this Geometry Mask.
   *
   * Inverting the alpha essentially flips the way the mask works.
   *
   * This is a WebGL only feature.
   * @param value Invert the alpha of this mask? Default true.
   */
  setInvertAlpha(value = true) {
    this.invertAlpha = value;
    return this;
  }

  /**
   * Renders the Geometry Mask's underlying Graphics object to the OpenGL stencil buffer and enables the stencil test, which clips rendered pixels according to the mask.
   * @param renderer The WebGL Renderer instance to draw to.
   * @param child The Game Object being rendered.
   * @param camera The camera the Game Object is being rendered through.
   */
  preRenderWebGL(renderer: WebGLRenderer, child: GameObject, camera: Camera) {
    const gl = renderer.gl;
    renderer.flush();
    if (renderer.maskStack.length === 0) {
      gl.enable(gl.STENCIL_TEST);
      gl.clear(gl.STENCIL_BUFFER_BIT);
      renderer.maskCount = 0;
    }

    if (renderer.currentCameraMask.mask !== this) {
      renderer.currentMask.mask = this;
    }

    renderer.maskStack.push({ mask: this, camera });
    this.applyStencil(renderer, camera, true);

    renderer.maskCount++;
  }

  /**
   * Applies the current stencil mask to the renderer.
   * @param renderer The WebGL Renderer instance to draw to.
   * @param camera The camera the Game Object is being rendered through.
   * @param inc Is this an INCR stencil or a DECR stencil?
   */
  applyStencil(renderer: WebGLRenderer, camera: Camera, inc: boolean) {
    const gl = renderer.gl;
    const geometryMask = this.geometryMask;
    const level = renderer.maskCount;

    gl.colorMask(false, false, false, false);

    if (inc) {
      gl.stencilFunc(gl.EQUAL, level, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.INCR);
    } else {
      gl.stencilFunc(gl.EQUAL, level + 1, 0xff);
      gl.stencilOp(gl.KEEP, gl.KEEP, gl.DECR);
    }

    geometryMask.renderWebGL(renderer, geometryMask, camera);

    renderer.flush();

    gl.colorMask(true, true, true, true);
    gl.stencilOp(gl.KEEP, gl.KEEP, gl.KEEP);

    if (inc) {
      if (this.invertAlpha) {
        gl.stencilFunc(gl.NOTEQUAL, level + 1, 0xff);
      } else {
        gl.stencilFunc(gl.EQUAL, level + 1, 0xff);
      }
    } else if (this.invertAlpha) {
      gl.stencilFunc(gl.NOTEQUAL, level, 0xff);
    } else {
      gl.stencilFunc(gl.EQUAL, level, 0xff);
    }
  }

  /**
   * Flushes all rendered pixels and disables the stencil test of a WebGL context, thus disabling the mask for it.
   * @param renderer The WebGL Renderer instance to draw flush.
   */
  postRenderWebGL(renderer: WebGLRenderer) {
    const gl = renderer.gl;
    renderer.maskStack.pop();

    renderer.maskCount--;
    renderer.flush();

    const current = renderer.currentMask;

    if (renderer.maskStack.length === 0) {
      current.mask = null;

      gl.disable(gl.STENCIL_TEST);
    } else {
      const prev = renderer.maskStack[renderer.maskStack.length - 1];

      prev.mask.applyStencil(renderer, prev.camera, false);

      if (renderer.currentCameraMask.mask !== prev.mask) {
        current.mask = prev.mask;
        current.camera = prev.camera;
      } else {
        current.mask = null;
      }
    }
  }

  /**
   * Sets the clipping path of a 2D canvas context to the Geometry Mask's underlying Graphics object.
   * @param renderer The Canvas Renderer instance to set the clipping path on.
   * @param mask The Game Object being rendered.
   * @param camera The camera the Game Object is being rendered through.
   */
  preRenderCanvas(renderer: CanvasRenderer, mask: GameObject, camera: Camera) {
    const geometryMask = this.geometryMask;
    renderer.currentContext.save();
    geometryMask.renderCanvas(renderer, geometryMask, camera, null, null, true);

    renderer.currentContext.clip();
  }

  /**
   * Restore the canvas context's previous clipping path, thus turning off the mask for it.
   * @param renderer The Canvas Renderer instance being restored.
   */
  postRenderCanvas(renderer: CanvasRenderer) {
    renderer.currentContext.restore();
  }

  /**
   * Destroys this GeometryMask and nulls any references it holds.
   *
   * Note that if a Game Object is currently using this mask it will _not_ automatically detect you have destroyed it,
   * so be sure to call `clearMask` on any Game Object using it, before destroying it.
   */
  destroy() {
    this.geometryMask = null as any;
  }
}
