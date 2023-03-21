/**
 * Attempts to get the target DOM element based on the given value, which can be either
 * a string, in which case it will be looked-up by ID, or an element node. If nothing
 * can be found it will return a reference to the document.body.
 * @param element The DOM element to look-up.
 */
function GetTarget(element: HTMLElement | string) {
  let target: HTMLElement | null = null;

  if (element !== '') {
    if (typeof element === 'string') target = document.getElementById(element)!;
    else if (element && element.nodeType === 1) target = element;
  }

  if (!target) target = document.body;

  return target;
}

export default GetTarget;
