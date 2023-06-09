/**
 * Adds the given element to the DOM. If a parent is provided the element is added as a child of the parent, providing it was able to access it.
 * If no parent was given it falls back to using `document.body`.
 * @param element The element to be added to the DOM. Usually a Canvas object.
 * @param parent The parent in which to add the element. Can be a string which is passed to `getElementById` or an actual DOM object.
 */
function AddToDOM(
  element: HTMLElement,
  parent?: string | HTMLElement
): HTMLElement {
  let target: HTMLElement | null;

  if (parent) {
    if (typeof parent === 'string') {
      target = document.getElementById(parent);
    } else if (typeof parent === 'object' && parent.nodeType === 1) {
      target = parent;
    }
  } else if (element.parentElement || parent === null) return element;

  //  Fallback, covers an invalid ID and a non HTMLElement object
  if (!target) {
    target = document.body;
  }

  target.appendChild(element);

  return element;
}

export default AddToDOM;
