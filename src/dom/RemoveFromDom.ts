/**
 * Attempts to remove the element from its parentNode in the DOM.
 * @param element The DOM element to remove from its parent node.
 */
function RemoveFromDOM(element: HTMLElement) {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

export default RemoveFromDOM;