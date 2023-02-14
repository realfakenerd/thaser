export default class CanvasInterpolation {
  /**
   * Sets the CSS image-rendering property on the given canvas to be 'crisp' (aka 'optimize contrast' on webkit).
   * @param canvas The canvas object to have the style set on.
   */
  setCrisp(canvas: HTMLCanvasElement) {
    const types = [
      'optimizeSpeed',
      '-moz-crisp-edges',
      '-o-crisp-edges',
      '-webkit-optimize-contrast',
      'optimize-contrast',
      'crisp-edges',
      'pixelated'
    ];
    types.forEach(type => {
      canvas.style.imageRendering = type;
    });

    (canvas.style as any).msInterpolationMode = 'nearest-neighbor';

    return canvas;
  }

  /**
   * Sets the CSS image-rendering property on the given canvas to be 'bicubic' (aka 'auto').
   * @param canvas The canvas object to have the style set on.
   */
  setBicubic(canvas: HTMLCanvasElement) {
    canvas.style.imageRendering = 'auto';
    (canvas.style as any).msInterpolationMode = 'bicubic';
    return canvas;
  }
}
