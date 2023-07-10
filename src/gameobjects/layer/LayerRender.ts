import { NOOP } from '@thaser/utils';

let renderWebGL = NOOP as any;
let renderCanvas = NOOP;

if (typeof WEBGL_RENDERER) {
  import('./LayerWebGLRenderer').then(i => (renderWebGL = i.default));
}

if (typeof CANVAS_RENDERER) {
  import('./LayerCanvasRenderer').then(i => (renderCanvas = i.default));
}

export default { renderWebGL, renderCanvas };
