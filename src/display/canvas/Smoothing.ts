let prefix = '';

function Smoothing() {
  /**
   * Gets the Smoothing Enabled vendor prefix being used on the given context, or null if not set.
   * @param context The canvas context to check.
   */
  function getPrefix(
    context: CanvasRenderingContext2D | WebGLRenderingContext
  ): string | null {
    const vendors = ['i', 'webkitI', 'msI', 'mozI', 'oI'];
    let i = 0;
    for (i; i < vendors.length; i++) {
      const s = vendors[i] + 'mageSmoothingEnagled';
      if (s in context) {
        return s;
      }
    }

    return null;
  }

  /**
   * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
   * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
   * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
   * drawn to the context will be affected. This sets the property across all current browsers but support is
   * patchy on earlier browsers, especially on mobile.
   * @param context The context on which to enable smoothing.
   */
  function enable(context: CanvasRenderingContext2D | WebGLRenderingContext) {
    if (prefix === '') {
      prefix = getPrefix(context)!;
    }
    if (prefix) {
      // @ts-ignore
      context[prefix] = true;
    }

    return context;
  }

  /**
   * Sets the Image Smoothing property on the given context. Set to false to disable image smoothing.
   * By default browsers have image smoothing enabled, which isn't always what you visually want, especially
   * when using pixel art in a game. Note that this sets the property on the context itself, so that any image
   * drawn to the context will be affected. This sets the property across all current browsers but support is
   * patchy on earlier browsers, especially on mobile.
   * @param context The context on which to disable smoothing.
   */
  function disable(context: CanvasRenderingContext2D | WebGLRenderingContext) {
    if (prefix === '') {
      prefix = getPrefix(context)!;
    }
    if (prefix) {
      // @ts-ignore
      context[prefix] = false;
    }
  }

  /**
   * Returns `true` if the given context has image smoothing enabled, otherwise returns `false`.
   * Returns null if no smoothing prefix is available.
   * @param context The context to check.
   */
  function isEnabled(
    context: CanvasRenderingContext2D | WebGLRenderingContext
  ): boolean {
    // @ts-ignore
    return prefix !== null ? context[prefix] : null;
  }

  return {
    disable,
    enable,
    getPrefix,
    isEnabled
  };
}
export default Smoothing();
