/**
 * Attempts to determine the document inner height across iOS and standard devices.
 * Based on code by @tylerjpeterson
 * @param iOS Is this running on iOS?
 */
function GetInnerHeight(iOS: boolean): number {
  if (!iOS) return window.innerHeight;

  const axis = Math.abs(window.orientation);

  const size = { w: 0, h: 0 };

  let ruler = document.createElement('div');

  ruler.setAttribute(
    'style',
    'position: fixed; height: 100vh; width: 0; top: 0'
  );

  document.documentElement.appendChild(ruler);

  size.w = axis === 90 ? ruler.offsetHeight : window.innerWidth;
  size.h = axis === 90 ? window.innerWidth : ruler.offsetHeight;

  document.documentElement.removeChild(ruler);

  ruler = null as any;

  if (Math.abs(window.orientation) !== 90) return size.h;
  else return size.w;
}

export default GetInnerHeight;