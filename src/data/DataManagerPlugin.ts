import { PluginCache } from '@thaser/plugins';
import { Scene, Events as SceneEvents } from '@thaser/scene';
import DataManager from './DataManager';

/**
 * The Data Component features a means to store pieces of data specific to a Game Object, System or Plugin.
 * You can then search, query it, and retrieve the data. The parent must either extend EventEmitter,
 * or have a property called `events` that is an instance of it.
 */
export default class DataManagerPlugin extends DataManager {
  /**
   *
   * @param scene A reference to the Scene that this DataManager belongs to.
   */
  constructor(scene: Scene) {
    super(scene, scene.sys.events);
    this.scene = scene;
    this.systems = scene.sys;

    scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
    scene.sys.events.on(SceneEvents.START, this.start, this);
  }

  /**
   * A reference to the Scene that this DataManager belongs to.
   */
  scene: Scene;

  /**
   * A reference to the Scene's Systems.
   */
  systems: Scene['sys'];

  private boot() {
    this.events = this.systems.events;
    this.events.once(SceneEvents.DESTROY, this.destroy, this);
  }

  private start() {
    this.events.once(SceneEvents.SHUTDOWN, this.shutdown, this);
  }

  private shutdown() {
    this.systems.events.off(SceneEvents.SHUTDOWN, this.shutdown, this);
  }

  /**
   * The Scene that owns this plugin is being destroyed.
   * We need to shutdown and then kill off all external references.
   */
  destroy(): void {
    DataManager.prototype.destroy.call(this);
    this.events.off(SceneEvents.START, this.start, this);

    this.scene = null as any;
    this.systems = null as any;
  }
}

PluginCache.register('DataManagerPlugin', DataManagerPlugin, 'data');
