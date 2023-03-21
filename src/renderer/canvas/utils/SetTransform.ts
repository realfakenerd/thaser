import { GameObject, GetCalcMatrix, TransformMatrix } from '@thaser/gameobjects';
import CanvasRenderer from '../CanvasRenderer';

/**
 * Takes a reference to the Canvas Renderer, a Canvas Rendering Context, a Game Object, a Camera and a parent matrix
 * and then performs the following steps:
 *
 * 1. Checks the alpha of the source combined with the Camera alpha. If 0 or less it aborts.
 * 2. Takes the Camera and Game Object matrix and multiplies them, combined with the parent matrix if given.
 * 3. Sets the blend mode of the context to be that used by the Game Object.
 * 4. Sets the alpha value of the context to be that used by the Game Object combined with the Camera.
 * 5. Saves the context state.
 * 6. Sets the final matrix values into the context via setTransform.
 * 7. If the Game Object has a texture frame, imageSmoothingEnabled is set based on frame.source.scaleMode.
 * 8. If the Game Object does not have a texture frame, imageSmoothingEnabled is set based on Renderer.antialias.
 *
 * This function is only meant to be used internally. Most of the Canvas Renderer classes use it.
 * @param renderer A reference to the current active Canvas renderer.
 * @param ctx The canvas context to set the transform on.
 * @param src The Game Object being rendered. Can be any type that extends the base class.
 * @param camera The Camera that is rendering the Game Object.
 * @param parentMatrix A parent transform matrix to apply to the Game Object before rendering.
 */
function SetTransform(
  renderer: CanvasRenderer,
  ctx: CanvasRenderingContext2D,
  src: GameObject,
  camera: Phaser.Cameras.Scene2D.Camera,
  parentMatrix?: TransformMatrix
) {
  const alpha = camera.alpha * src.alpha;
  if (alpha <= 0) return false;

  const calcMatrix = GetCalcMatrix(src, camera, parentMatrix).calc;
  ctx.globalCompositeOperation = renderer.blendModes[src.blendMode];

  ctx.globalAlpha = alpha;
  ctx.save();
  calcMatrix.setToContext(ctx);

  ctx.imageSmoothingEnabled = src.frame
    ? !src.removeFromUpdateList.source.scaleMode
    : renderer.antialias;

  return true;
}

export default SetTransform;
