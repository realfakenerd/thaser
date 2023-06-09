/**
 * Attempts to determine the screen orientation using the Orientation API.
 * @param width The width of the viewport.
 * @param height The height of the viewport.
 */
function GetScreenOrientation(width: number, height: number): string {
  var screen = window.screen;
  var orientation = screen
    ? screen.orientation || screen.mozOrientation || screen.msOrientation
    : false;

  if (orientation && typeof orientation.type === 'string')
    return orientation.type;
  else if (typeof orientation === 'string') return orientation;

  if (typeof window.orientation === 'number') {
    //  Do this check first, as iOS supports this, but also has an incomplete window.screen implementation
    //  This may change by device based on "natural" orientation.
    return window.orientation === 0 || window.orientation === 180
      ? CONST.ORIENTATION.PORTRAIT
      : CONST.ORIENTATION.LANDSCAPE;
  } else if (window.matchMedia) {
    if (window.matchMedia('(orientation: portrait)').matches)
      return CONST.ORIENTATION.PORTRAIT;
    else if (window.matchMedia('(orientation: landscape)').matches)
      return CONST.ORIENTATION.LANDSCAPE;
  } else
    return height > width
      ? CONST.ORIENTATION.PORTRAIT
      : CONST.ORIENTATION.LANDSCAPE;
}

export default GetScreenOrientation;