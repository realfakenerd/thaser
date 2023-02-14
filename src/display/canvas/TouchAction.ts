/**
 * Sets the touch-action property on the canvas style. Can be used to disable default browser touch actions.
 * @param canvas The canvas element to have the style applied to.
 * @param value The touch action value to set on the canvas. Set to `none` to disable touch actions. Default 'none'.
 */
function TouchAction(canvas: HTMLCanvasElement, value = 'none') {
  //@ts-ignore
  canvas.style['msTouchAction'] = value;
  //@ts-ignore
  canvas.style['ms-touch-action'] = value;
  canvas.style.touchAction = value;

  return canvas;
}
export default TouchAction;
