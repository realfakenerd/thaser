import CONST from '../../const';
import Smoothing from './Smoothing';

const pool: any[] = [];

let _disableContextSmoothing = false;

/**
 * The CanvasPool is a global static object, that allows Phaser to recycle and pool 2D Context Canvas DOM elements.
 * It does not pool WebGL Contexts, because once the context options are set they cannot be modified again,
 * which is useless for some of the Phaser pipelines / renderer.
 *
 * This singleton is instantiated as soon as Phaser loads, before a Phaser.Game instance has even been created.
 * Which means all instances of Phaser Games on the same page can share the one single pool.
 */
function CanvasPool() {
  /**
   * Creates a new Canvas DOM element, or pulls one from the pool if free.
   * @param parent The parent of the Canvas object.
   * @param width The width of the Canvas. Default 1.
   * @param height The height of the Canvas. Default 1.
   * @param canvasType The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`. Default Phaser.CANVAS.
   * @param selfParent Use the generated Canvas element as the parent? Default false.
   */
  function create(
    parent: any,
    width = 1,
    height = 1,
    canvasType = CONST.CANVAS,
    selfParent = false
  ): HTMLCanvasElement {
    let canvas: HTMLCanvasElement;
    let container = first(canvasType);

    if (container === null) {
      container = {
        parent,
        canvas: document.createElement('canvas'),
        type: canvasType
      };

      if (canvasType === CONST.CANVAS) {
        pool.push(container);
      }

      canvas = container.canvas;
    } else {
      container.parent = parent;
      canvas = container.canvas;
    }

    if (selfParent) {
      container.parent = canvas;
    }

    canvas.width = width;
    canvas.height = height;

    if (_disableContextSmoothing && canvasType === CONST.CANVAS) {
      Smoothing.disable(canvas.getContext('2d') as CanvasRenderingContext2D);
    }

    return canvas;
  }

  /**
   * Creates a new Canvas DOM element, or pulls one from the pool if free.
   * @param parent The parent of the Canvas object.
   * @param width The width of the Canvas. Default 1.
   * @param height The height of the Canvas. Default 1.
   */
  function create2D(parent: any, width = 1, height = 1): HTMLCanvasElement {
    return create(parent, width, height, CONST.CANVAS);
  }

  /**
   * Creates a new Canvas DOM element, or pulls one from the pool if free.
   * @param parent The parent of the Canvas object.
   * @param width The width of the Canvas. Default 1.
   * @param height The height of the Canvas. Default 1.
   */
  function createWebGL(parent: any, width = 1, height = 1): HTMLCanvasElement {
    return create(parent, width, height, CONST.WEBGL);
  }

  /**
   * Gets the first free canvas index from the pool.
   * @param canvasType The type of the Canvas. Either `Phaser.CANVAS` or `Phaser.WEBGL`. Default Phaser.CANVAS.
   */
  function first(canvasType = CONST.CANVAS) {
    if (canvasType === CONST.WEBGL) return null;

    let i = 0;
    for (i; i < pool.length; i++) {
      const container = pool[i];
      if (!container.parent && container.type === canvasType) return container;
    }

    return null;
  }

  /**
   * Looks up a canvas based on its parent, and if found puts it back in the pool, freeing it up for re-use.
   * The canvas has its width and height set to 1, and its parent attribute nulled.
   * @param parent The canvas or the parent of the canvas to free.
   */
  function remove(parent: any): void {
    const isCanvas = parent instanceof HTMLCanvasElement;
    pool.forEach(container => {
      if (
        (isCanvas && container.canvas === parent) ||
        (!isCanvas && container.parent === parent)
      ) {
        container.parent = null;
        container.canvas.width = 1;
        container.canvas.height = 1;
      }
    });
  }

  /**
   * Gets the total number of used canvas elements in the pool.
   */
  function total(): number {
    let c = 0;
    pool.forEach((container) => {
        if(container.parent) {
            c++;
        }
    })
    return c;
  }

  /**
   * Gets the total number of free canvas elements in the pool.
   */
  function free(): number {
    return pool.length - total();
  }

  /**
   * Disable context smoothing on any new Canvas element created.
   */
  function disableSmoothing(): void {
    _disableContextSmoothing = true;
  }

  /**
   * Enable context smoothing on any new Canvas element created.
   */
  function enableSmoothing(): void {
    _disableContextSmoothing = false;
  }

   return {
    create2D,
    create,
    createWebGL,
    disableSmoothing,
    enableSmoothing,
    first,
    free,
    pool,
    remove,
    total
   }
}
export default CanvasPool();