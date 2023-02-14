/**
 * Sets the user-select property on the canvas style. Can be used to disable default browser selection actions.
 * @param canvas The canvas element to have the style applied to.
 * @param value The touch callout value to set on the canvas. Set to `none` to disable touch callouts. Default 'none'.
 */
function UserSelect(canvas: HTMLCanvasElement, value = 'none') {
  const vendors = ['-webkit-', '-khtml-', '-moz-', '-ms-', ''];

  vendors.forEach(vendors => {
    // @ts-ignore
    canvas.style[vendors + 'user-select'] = value;
  });

  // @ts-ignore
  canvas.style['-webkit-touch-callout'] = value;
  // @ts-ignore
  canvas.style['-webkit-tap-highlight-color'] = 'rgba(0, 0, 0, 0)';

  return canvas;
}
export default UserSelect;
