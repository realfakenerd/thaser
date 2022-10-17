import BasePlugin from './BasePlugin';
import {Scene} from '../scene';
import PluginManager from './PluginManager';
import Systems from '../scene/Systems';
import {Events as SceneEvents} from '../scene'

/**
 * A Scene Level Plugin is installed into every Scene and belongs to that Scene.
 * It can listen for Scene events and respond to them.
 * It can map itself to a Scene property, or into the Scene Systems, or both.
 */
export default class ScenePlugin extends BasePlugin {
  /**
   *
   * @param scene A reference to the Scene that has installed this plugin.
   * @param pluginManager A reference to the Plugin Manager.
   * @param pluginKey The key under which this plugin has been installed into the Scene Systems.
   */
  constructor(scene: Scene, pluginManager: PluginManager, pluginKey: string) {
    super(pluginManager);
    this.scene = scene;
    this.systems = scene.sys;
    this.pluginKey = pluginKey;

    scene.sys.events.once(SceneEvents.BOOT, this.boot, this);
  }

  /**
   * A reference to the Scene that has installed this plugin.
   * Only set if it's a Scene Plugin, otherwise `null`.
   * This property is only set when the plugin is instantiated and added to the Scene, not before.
   * You can use it during the `boot` method.
   */
  protected scene: Scene;

  /**
   * A reference to the Scene Systems of the Scene that has installed this plugin.
   * Only set if it's a Scene Plugin, otherwise `null`.
   * This property is only set when the plugin is instantiated and added to the Scene, not before.
   * You can use it during the `boot` method.
   */
  protected systems: Systems;

  /**
   * The key under which this plugin was installed into the Scene Systems.
   *
   * This property is only set when the plugin is instantiated and added to the Scene, not before.
   * You can use it during the `boot` method.
   */
  readonly pluginKey: string;

  /**
   * This method is called when the Scene boots. It is only ever called once.
   *
   * By this point the plugin properties `scene` and `systems` will have already been set.
   *
   * In here you can listen for {@link Phaser.Scenes.Events Scene events} and set-up whatever you need for this plugin to run.
   * Here are the Scene events you can listen to:
   *
   * - start
   * - ready
   * - preupdate
   * - update
   * - postupdate
   * - resize
   * - pause
   * - resume
   * - sleep
   * - wake
   * - transitioninit
   * - transitionstart
   * - transitioncomplete
   * - transitionout
   * - shutdown
   * - destroy
   *
   * At the very least you should offer a destroy handler for when the Scene closes down, i.e:
   *
   * ```javascript
   * var eventEmitter = this.systems.events;
   * eventEmitter.once('destroy', this.sceneDestroy, this);
   * ```
   */
  boot(): void {}

  /**
   * Game instance has been destroyed.
   *
   * You must release everything in here, all references, all objects, free it all up.
   */
  destroy(): void {
    this.pluginManager = null as any;
    this.game = null as any;
    this.scene = null as any;
    this.systems = null as any;
  }
}
