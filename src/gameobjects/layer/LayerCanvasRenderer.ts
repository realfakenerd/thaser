import { CanvasRenderer } from '@thaser/renderer/canvas';
import Layer from './Layer';
import { Camera } from '@thaser/cameras';

/**
 * Renders this Game Object with the Canvas Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @param renderer - A reference to the current active Canvas renderer.
 * @param layer - The Game Object being rendered in this call.
 * @param camera - The Camera that is rendering the Game Object.
 */
function LayerCanvasRenderer (
  renderer: CanvasRenderer,
  layer: Layer,
  camera: Camera
) {
  const children = layer.list;

  if (children.length === 0) return;

  layer.depthSort();

  const layerHasBlendMode = layer.blendMode !== -1;

  if (!layerHasBlendMode) {
    renderer.setBlendMode(0);
  }

  const alpha = layer._alpha;

  if (layer.mask) {
    layer.mask.preRenderCanvas(renderer, null, camera);
  }

  for (let i = 0; i < children.length; i++) {
    const child = children[i];

    if (!child.willRender(camera)) {
      continue;
    }

    const childAlpha = child.alpha;

    if (!layerHasBlendMode && child.blendMode !== renderer.currentBlendMode) {
      //  If Layer doesn't have its own blend mode, then a child can have one
      renderer.setBlendMode(child.blendMode);
    }

    //  Set parent values
    child.setAlpha(childAlpha * alpha);

    //  Render
    child.renderCanvas(renderer, child, camera);

    //  Restore original values
    child.setAlpha(childAlpha);
  }

  if (layer.mask) {
    layer.mask.postRenderCanvas(renderer);
  }
};

export default LayerCanvasRenderer;
