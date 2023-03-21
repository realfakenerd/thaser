import { ORIENTATION } from '@thaser/scale';

/**
 * Attempts to determine the screen orientation using the Orientation API.
 * @param width The width of the viewport.
 * @param height The height of the viewport.
 */
function GetScreenOrientation(width: number, height: number) {
  const screen = window.screen;
  const orientation = screen
    ? screen.orientation ||
      screen.mozOrientation ||
      screen.msOrientation ||
      screen.webkitOrientation
    : false;

  if (orientation && typeof orientation.type === 'string')
    return orientation.type;
  else if (typeof orientation === 'string') return orientation;

  if (typeof window.orientation === 'string') return orientation;

  if (typeof window.orientation === 'number')
    return window.orientation === 0 || window.orientation === 180
      ? ORIENTATION.PORTRAIT
      : ORIENTATION.LANDSCAPE;
  else if (window.matchMedia) {
    if (window.matchMedia('(orientation: portrait)').matches)
      return ORIENTATION.PORTRAIT;
    else if (window.matchMedia('(orientation: landscape)').matches)
      return ORIENTATION.LANDSCAPE;
  } else return height > width ? ORIENTATION.PORTRAIT : ORIENTATION.LANDSCAPE;
}
export default GetScreenOrientation;
