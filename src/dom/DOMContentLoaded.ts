import { ContentLoadedCallback } from '@thaser/types/dom';
import {OS} from '@thaser/device';
/**
 * Inspects the readyState of the document. If the document is already complete then it invokes the given callback.
 * If not complete it sets up several event listeners such as `deviceready`, and once those fire, it invokes the callback.
 * Called automatically by the Phaser.Game instance. Should not usually be accessed directly.
 * @param callback The callback to be invoked when the device is ready and the DOM content is loaded.
 */
function DOMContentLoaded(callback: ContentLoadedCallback): void {
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    callback();
    return;
  }

  function check () {
    document.removeEventListener('deviceready', check, true);
    document.removeEventListener('DOMContentLoaded', check, true);
    window.removeEventListener('load', check, true);

    callback();
  };

  if (!document.body) {
    window.setTimeout(check, 20);
  } else if (OS.cordova) {
    document.addEventListener('deviceready', check, false);
  } else {
    document.addEventListener('DOMContentLoaded', check, true);
    window.addEventListener('load', check, true);
  }
}

export default DOMContentLoaded;
