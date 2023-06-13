import { List } from '@thaser/structs';
import GameObject from './GameObject';
import { Scene, Systems } from '@thaser/scene';
import { EventEmitter } from '@thaser/events';
import { Events as SceneEvents } from '@thaser/scene';
import GameObjectEvents from './events';
import { StableSort } from '@thaser/utils';
import { PluginCache } from '@thaser/plugins';
/**
 * The Display List plugin.
 *
 * Display Lists belong to a Scene and maintain the list of Game Objects to render every frame.
 *
 * Some of these Game Objects may also be part of the Scene's [Update List]{@link Phaser.GameObjects.UpdateList}, for updating.
 */
export default class DisplayList extends List<GameObject> {
  /**
   *
   * @param scene The Scene that this Display List belongs to.
   */
  constructor(scene: Scene) {
    super(scene);

    this.scene = scene;
    this.systems = scene.sys;
    this.events = scene.sys.events;

    this.addCallback = this.addChildCallback;
    this.removeCallback = this.removeChildCallback;

    this.events.once(SceneEvents.BOOT, this.boot, this);
    this.events.on(SceneEvents.START, this.start, this);
  }

  /**
   * The flag the determines whether Game Objects should be sorted when `depthSort()` is called.
   */
  sortChildrenFlag = false;

  /**
   * The Scene that this Display List belongs to.
   */
  scene: Scene;

  /**
   * The Scene's Systems.
   */
  systems: Systems;

  /**
   * The Scene's Event Emitter.
   */
  events: EventEmitter;

  /**
   * This method is called automatically, only once, when the Scene is first created.
   * Do not invoke it directly.
   */
  private boot() {
    this.events.once(SceneEvents.DESTROY, this.destroy, this);
  }

  /**
   * Internal method called from `List.addCallback`.
   * @param gameObject - The Game Object that was added to the list.
   */
  addChildCallback(gameObject: GameObject) {
    if (gameObject.displayList && gameObject.displayList !== this) {
      gameObject.removeFromDisplayList();
    }

    if (gameObject.parentContainer) {
      gameObject.parentContainer.remove(gameObject);
    }

    if (!gameObject.displayList) {
      this.queueDepthSort();

      gameObject.displayList = this;

      gameObject.emit(GameObjectEvents.ADDED_TO_SCENE, gameObject, this.scene);

      this.events.emit(SceneEvents.ADDED_TO_SCENE, gameObject, this.scene);
    }
  }

  /**
   * Internal method called from `List.removeCallback`.
   *
   * @param gameObject - The Game Object that was removed from the list.
   */
  removeChildCallback(gameObject: GameObject) {
    this.queueDepthSort();

    gameObject.displayList = null;

    gameObject.emit(
      GameObjectEvents.REMOVED_FROM_SCENE,
      gameObject,
      this.scene
    );

    this.events.emit(SceneEvents.REMOVED_FROM_SCENE, gameObject, this.scene);
  }

  /**
     * This method is called automatically by the Scene when it is starting up.
     * It is responsible for creating local systems, properties and listening for Scene events.
     * Do not invoke it directly.

     */
  start() {
    this.events.once(SceneEvents.SHUTDOWN, this.shutdown, this);
  }

  /**
   * Force a sort of the display list on the next call to depthSort.
   */
  queueDepthSort() {
    this.sortChildrenFlag = true;
  }

  /**
   * Immediately sorts the display list if the flag is set.
   */
  depthSort() {
    if (this.sortChildrenFlag) {
      StableSort(this.list, this.sortByDepth);
      this.sortChildrenFlag = false;
    }
  }

  /**
   * Compare the depth of two Game Objects.
   * @param childA The first Game Object.
   * @param childB The second Game Object.
   */
  sortByDepth(childA: GameObject, childB: GameObject): number {
    return childA.depth - childB.depth;
  }

  /**
   * Returns an array which contains all objects currently on the Display List.
   * This is a reference to the main list array, not a copy of it, so be careful not to modify it.
   */
  getChildren(): GameObject[] {
    return this.list;
  }

  /**
   * The Scene that owns this plugin is shutting down.
   *
   * We need to kill and reset all internal properties as well as stop listening to Scene events.
   */
  shutdown() {
    const list = this.list;
    while (list.length) {
      list[0].destroy(true);
    }
    this.events.off(SceneEvents.SHUTDOWN, this.shutdown, this);
  }

  /**
   * The Scene that owns this plugin is being destroyed.
   * We need to shutdown and then kill off all external references.
   */
  destroy() {
    this.shutdown();

    this.events.off(SceneEvents.START, this.start, this);

    this.scene = null as any;
    this.systems = null as any;
    this.events = null as any;
  }
}

PluginCache.register('DisplayList', DisplayList, 'displayList');
