import { WebGLRenderer } from '@thaser/renderer/webgl';
import Layer from './Layer';
import { Camera } from '@thaser/cameras';

/**
 * Renders this Game Object with the WebGL Renderer to the given Camera.
 * The object will not render if any of its renderFlags are set or it is being actively filtered out by the Camera.
 * This method should not be called directly. It is a utility function of the Render module.
 *
 * @param renderer - A reference to the current active WebGL renderer.
 * @param layer - The Game Object being rendered in this call.
 * @param camera - The Camera that is rendering the Game Object.
 */
function LayerWebGLRenderer(
  renderer: WebGLRenderer,
  layer: Layer,
  camera: Camera
) {
  const children = layer.list;
  const childCount = children.length;

  if (childCount === 0) return;

  layer.depthSort();

  renderer.pipelines.preBatch(layer);

  const layerHasBlendMode = layer.blendMode !== -1;

  if (!layerHasBlendMode) {
    renderer.setBlendMode(0);
  }

  const alpha = layer.alpha;

  for (let i = 0; i < childCount; i++) {
    const child = children[i];

    if (!child.willRender(camera)) continue;

    let childAlphaTopLeft;
    let childAlphaTopRight;
    let childAlphaBottomLeft;
    let childAlphaBottomRight;

    if (child.alphaTopLeft !== undefined) {
      childAlphaTopLeft = child.alphaTopLeft;
      childAlphaTopRight = child.alphaTopRight;
      childAlphaBottomLeft = child.alphaBottomLeft;
      childAlphaBottomRight = child.alphaBottomRight;
    } else {
      const childAlpha = child.alpha;

      childAlphaTopLeft = childAlpha;
      childAlphaTopRight = childAlpha;
      childAlphaBottomLeft = childAlpha;
      childAlphaBottomRight = childAlpha;
    }

    if (!layerHasBlendMode && child.blendMode !== renderer.currentBlendMode) {
      //  If Layer doesn't have its own blend mode, then a child can have one
      renderer.setBlendMode(child.blendMode);
    }

    const mask = child.mask;

    if (mask) {
      mask.preRenderWebGL(renderer, child, camera);
    }

    const type = child.type;

    if (type !== renderer.currentType) {
      renderer.newType = true;
      renderer.currentType = type;
    }

    renderer.nextTypeMatch =
      i < childCount - 1
        ? children[i + 1].type === renderer.currentType
        : false;

    child.setAlpha(
      childAlphaTopLeft * alpha,
      childAlphaTopRight * alpha,
      childAlphaBottomLeft * alpha,
      childAlphaBottomRight * alpha
    );

    //  Render
    child.renderWebGL(renderer, child, camera);

    //  Restore original values
    child.setAlpha(
      childAlphaTopLeft,
      childAlphaTopRight,
      childAlphaBottomLeft,
      childAlphaBottomRight
    );

    if (mask) {
      mask.postRenderWebGL(renderer, camera);
    }

    renderer.newType = false;
  }

  renderer.pipelines.postBatch(layer);
}

export default LayerWebGLRenderer;
