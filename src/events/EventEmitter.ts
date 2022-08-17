import { EventEmitter as EE } from 'eventemitter3';
import PluginCache from '../plugins/PluginCache';

/**
 * EventEmitter is a Scene Systems plugin compatible version of eventemitter3.
 */
class EventEmitter extends EE {
  constructor() {
    super();
  }

  /**
   * Removes all listeners.
   */
  shutdown(): void {
    this.removeAllListeners();
  }

  /**
   * Removes all listeners.
   */
  destroy(): void {
    this.removeAllListeners();
  }
}
PluginCache.register('EventEmitter', EventEmitter, 'events');
export default EventEmitter;
