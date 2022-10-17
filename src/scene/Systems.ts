import { SettingsConfig, SettingsObject } from '../types/scene';
import { NOOP } from '../utils';
import { CONST } from './const';
import GetScenePlugins from './GetScenePlugins';
import GetPhysicsPlugins from './GetPhysicsPlugins';
import Scene from './Scene';
import Settings from './Settings';
import Events from './events';
import { DefaultPlugins, PluginManager, ScenePlugin } from '../plugins';
import { CacheManager } from '../cache';
import { EventEmitter } from '../events';
import GLOBAL_CONST from '../const'; 

/**
 * The Scene Systems class.
 *
 * This class is available from within a Scene under the property `sys`.
 * It is responsible for managing all of the plugins a Scene has running, including the display list, and
 * handling the update step and renderer. It also contains references to global systems belonging to Game.
 */
export default class Systems {
  /**
   *
   * @param scene The Scene that owns this Systems instance.
   * @param config Scene specific configuration settings.
   */
  constructor(scene: Scene, config: string | SettingsConfig) {
    this.scene = scene;
    this.config = config;

    this.settings = Settings.create(config);
  }

  /**
   * The Scene Update function.
   *
   * This starts out as NOOP during init, preload and create, and at the end of create
   * it swaps to be whatever the Scene.update function is.
   */
  private sceneUpdate = NOOP;

  /**
   * A reference to the Scene that these Systems belong to.
   */
  scene: Scene;

  /**
   * A reference to the Phaser Game instance.
   */
  game: Game;

  /**
   * A reference to either the Canvas or WebGL Renderer that this Game is using.
   */
  renderer:
    | Phaser.Renderer.Canvas.CanvasRenderer
    | Phaser.Renderer.WebGL.WebGLRenderer;

  /**
   * The Scene Configuration object, as passed in when creating the Scene.
   */
  config: string | Phaser.Types.Scenes.SettingsConfig;

  /**
   * The Scene Settings. This is the parsed output based on the Scene configuration.
   */
  settings: SettingsObject;

  /**
   * A handy reference to the Scene canvas / context.
   */
  canvas: HTMLCanvasElement;

  /**
   * A reference to the Canvas Rendering Context being used by the renderer.
   */
  context: CanvasRenderingContext2D;

  /**
   * A reference to the global Animations Manager.
   *
   * In the default set-up you can access this from within a Scene via the `this.anims` property.
   */
  anims: Phaser.Animations.AnimationManager;

  /**
   * A reference to the global Cache. The Cache stores all files bought in to Phaser via
   * the Loader, with the exception of images. Images are stored in the Texture Manager.
   *
   * In the default set-up you can access this from within a Scene via the `this.cache` property.
   */
  cache!: CacheManager;

  /**
   * A reference to the global Plugins Manager.
   *
   * In the default set-up you can access this from within a Scene via the `this.plugins` property.
   */
  plugins!: PluginManager;

  /**
   * A reference to the global registry. This is a game-wide instance of the Data Manager, allowing
   * you to exchange data between Scenes via a universal and shared point.
   *
   * In the default set-up you can access this from within a Scene via the `this.registry` property.
   */
  registry: Phaser.Data.DataManager;

  /**
   * A reference to the global Scale Manager.
   *
   * In the default set-up you can access this from within a Scene via the `this.scale` property.
   */
  scale: Phaser.Scale.ScaleManager;

  /**
   * A reference to the global Sound Manager.
   *
   * In the default set-up you can access this from within a Scene via the `this.sound` property.
   */
  sound:
    | Phaser.Sound.NoAudioSoundManager
    | Phaser.Sound.HTML5AudioSoundManager
    | Phaser.Sound.WebAudioSoundManager;

  /**
   * A reference to the global Texture Manager.
   *
   * In the default set-up you can access this from within a Scene via the `this.textures` property.
   */
  textures: Phaser.Textures.TextureManager;

  /**
   * A reference to the Scene's Game Object Factory.
   *
   * Use this to quickly and easily create new Game Object's.
   *
   * In the default set-up you can access this from within a Scene via the `this.add` property.
   */
  add: Phaser.GameObjects.GameObjectFactory;

  /**
   * A reference to the Scene's Camera Manager.
   *
   * Use this to manipulate and create Cameras for this specific Scene.
   *
   * In the default set-up you can access this from within a Scene via the `this.cameras` property.
   */
  cameras: Phaser.Cameras.Scene2D.CameraManager;

  /**
   * A reference to the Scene's Display List.
   *
   * Use this to organize the children contained in the display list.
   *
   * In the default set-up you can access this from within a Scene via the `this.children` property.
   */
  displayList: Phaser.GameObjects.DisplayList;

  /**
   * A reference to the Scene's Event Manager.
   *
   * Use this to listen for Scene specific events, such as `pause` and `shutdown`.
   *
   * In the default set-up you can access this from within a Scene via the `this.events` property.
   */
  events!: EventEmitter;

  /**
   * A reference to the Scene's Game Object Creator.
   *
   * Use this to quickly and easily create new Game Object's. The difference between this and the
   * Game Object Factory, is that the Creator just creates and returns Game Object instances, it
   * doesn't then add them to the Display List or Update List.
   *
   * In the default set-up you can access this from within a Scene via the `this.make` property.
   */
  make: Phaser.GameObjects.GameObjectCreator;

  /**
   * A reference to the Scene Manager Plugin.
   *
   * Use this to manipulate both this and other Scene's in your game, for example to launch a parallel Scene,
   * or pause or resume a Scene, or switch from this Scene to another.
   *
   * In the default set-up you can access this from within a Scene via the `this.scene` property.
   */
  scenePlugin!: ScenePlugin;

  /**
   * A reference to the Scene's Update List.
   *
   * Use this to organize the children contained in the update list.
   *
   * The Update List is responsible for managing children that need their `preUpdate` methods called,
   * in order to process so internal components, such as Sprites with Animations.
   *
   * In the default set-up there is no reference to this from within the Scene itself.
   */
  updateList: Phaser.GameObjects.UpdateList;

  /**
   * This method is called only once by the Scene Manager when the Scene is instantiated.
   * It is responsible for setting up all of the Scene plugins and references.
   * It should never be called directly.
   * @param game A reference to the Phaser Game instance.
   */
  protected init(game: Game): void {
    this.settings.status = CONST.INIT;

    this.sceneUpdate = NOOP;

    this.game = game;
    this.renderer = game.renderer;

    this.canvas = game.canvas;
    this.context = game.context;

    const pluginManager = game.plugins;

    this.plugins = pluginManager;

    pluginManager.addToScene(this, DefaultPlugins.Global, [
      DefaultPlugins.CoreScene,
      GetScenePlugins(this),
      GetPhysicsPlugins(this)
    ]);

    this.events.emit(Events.BOOT, this);

    this.settings.isBooted = true;
  }

  /**
   * A single game step. Called automatically by the Scene Manager as a result of a Request Animation
   * Frame or Set Timeout call to the main Game instance.
   * @param time The time value from the most recent Game step. Typically a high-resolution timer value, or Date.now().
   * @param delta The delta value since the last frame. This is smoothed to avoid delta spikes by the TimeStep class.
   */
  step(time: number, delta: number): void {
    const events = this.events;
    events.emit(Events.PRE_UPDATE, time, delta);
    events.emit(Events.UPDATE, time, delta);
    this.sceneUpdate.call(this.scene, time, delta);
    events.emit(Events.POST_UPDATE, time, delta);
  }

  /**
   * Called automatically by the Scene Manager.
   * Instructs the Scene to render itself via its Camera Manager to the renderer given.
   * @param renderer The renderer that invoked the render call.
   */
  render(
    renderer:
      | Phaser.Renderer.Canvas.CanvasRenderer
      | Phaser.Renderer.WebGL.WebGLRenderer
  ): void {
    const displayList = this.displayList;
    displayList.depthSort();
    this.events.emit(Events.PRE_RENDER, renderer);
    this.cameras.render(renderer, displayList);
    this.events.emit(Events.RENDER, renderer);
  }

  /**
   * Force a sort of the display list on the next render.
   */
  queueDepthSort(): void {
    this.displayList.queueDepthSort();
  }

  /**
   * Immediately sorts the display list if the flag is set.
   */
  depthSort(): void {
    this.displayList.depthSort();
  }

  /**
   * Pause this Scene.
   *
   * A paused Scene still renders, it just doesn't run any of its update handlers or systems.
   * @param data A data object that will be passed in the 'pause' event.
   */
  pause(data?: object): Systems {
    const settings = this.settings;
    const status = this.getStatus();

    if (status !== CONST.CREATING && status !== CONST.RUNNING) {
      console.warn('Cannot pause non-running Scene', settings.key);
    } else if (this.settings.active) {
      settings.status = CONST.PAUSED;
      settings.active = false;
      this.events.emit(Events.PAUSE, this, data);
    }

    return this;
  }

  /**
   * Resume this Scene from a paused state.
   * @param data A data object that will be passed in the 'resume' event.
   */
  resume(data?: object): Systems {
    const events = this.events;
    const settings = this.settings;
    if (!this.settings.active) {
      settings.status = CONST.RUNNING;
      settings.active = true;
      events.emit(Events.RESUME, this, data);
    }

    return this;
  }

  /**
   * Send this Scene to sleep.
   *
   * A sleeping Scene doesn't run its update step or render anything, but it also isn't shut down
   * or has any of its systems or children removed, meaning it can be re-activated at any point and
   * will carry on from where it left off. It also keeps everything in memory and events and callbacks
   * from other Scenes may still invoke changes within it, so be careful what is left active.
   * @param data A data object that will be passed in the 'sleep' event.
   */
  sleep(data?: object): Systems {
    const settings = this.settings;
    const status = this.getStatus();

    if (status !== CONST.CREATING && status !== CONST.RUNNING) {
      console.warn('Cannot sleep non-running Scene', settings.key);
    } else {
      settings.status = CONST.SLEEPING;
      settings.active = false;
      settings.visible = false;
      this.events.emit(Events.SLEEP, this, data);
    }

    return this;
  }

  /**
   * Wake-up this Scene if it was previously asleep.
   * @param data A data object that will be passed in the 'wake' event.
   */
  wake(data?: object): Systems {
    const events = this.events;
    const settings = this.settings;

    settings.status = CONST.RUNNING;

    settings.active = true;
    settings.visivle = true;

    events.emit(Events.WAKE, this, data);
    if (settings.isTransition) {
      events.emit(
        Events.TRANSITION_WAKE,
        settings.transitionFrom,
        settings.transitionDuration
      );
    }
    return this;
  }

  /**
   * Returns any data that was sent to this Scene by another Scene.
   *
   * The data is also passed to `Scene.init` and in various Scene events, but
   * you can access it at any point via this method.
   */
  getData(): any {
    return this.settings.data;
  }

  /**
   * Returns the current status of this Scene.
   */
  getStatus(): number {
    return this.settings.status;
  }

  /**
   * Is this Scene sleeping?
   */
  isSleeping(): boolean {
    return this.settings.status === CONST.SLEEPING;
  }

  /**
   * Is this Scene running?
   */
  isActive(): boolean {
    return this.settings.status === CONST.PAUSED;
  }

  /**
   * Is this Scene paused?
   */
  isPaused(): boolean {
    return this.settings.status === CONST.PAUSED;
  }

  /**
   * Is this Scene currently transitioning out to, or in from another Scene?
   */
  isTransitioning(): boolean {
    return (
      this.settings.isTransition || (this.scenePlugin as any)._target !== null
    );
  }

  /**
   * Is this Scene currently transitioning out from itself to another Scene?
   */
  isTransitionOut(): boolean {
    return (
      (this.scenePlugin as any)._target !== null &&
      (this.scenePlugin as any)._duration > 0
    );
  }

  /**
   * Is this Scene currently transitioning in from another Scene?
   */
  isTransitionIn(): boolean {
    return this.settings.isTransition;
  }

  /**
   * Is this Scene visible and rendering?
   */
  isVisible(): boolean {
    return this.settings.visible;
  }

  /**
   * Sets the visible state of this Scene.
   * An invisible Scene will not render, but will still process updates.
   * @param value `true` to render this Scene, otherwise `false`.
   */
  setVisible(value: boolean): Systems {
    this.settings.visible = value;
    return this;
  }

  /**
   * Set the active state of this Scene.
   *
   * An active Scene will run its core update loop.
   * @param value If `true` the Scene will be resumed, if previously paused. If `false` it will be paused.
   * @param data A data object that will be passed in the 'resume' or 'pause' events.
   */
  setActive(value: boolean, data?: object): Systems {
    if (value) return this.resume(data);
    else return this.pause(data);
  }

  /**
   * Start this Scene running and rendering.
   * Called automatically by the SceneManager.
   * @param data Optional data object that may have been passed to this Scene from another.
   */
  start(data: object): void {
    const events = this.events;
    const settings = this.settings;

    if (data) {
      settings.data = data;
    }

    settings.status = CONST.START;

    settings.active = true;
    settings.visible = true;

    events.emit(Events.START, this);
    events.emit(Events.READY, this, data);
  }

  /**
   * Shutdown this Scene and send a shutdown event to all of its systems.
   * A Scene that has been shutdown will not run its update loop or render, but it does
   * not destroy any of its plugins or references. It is put into hibernation for later use.
   * If you don't ever plan to use this Scene again, then it should be destroyed instead
   * to free-up resources.
   * @param data A data object that will be passed in the 'shutdown' event.
   */
  shutdown(data?: object): void {
    const events = this.events;
    const settings = this.settings;

    events.off(Events.TRANSITION_INIT);
    events.off(Events.TRANSITION_START);
    events.off(Events.TRANSITION_COMPLETE);
    events.off(Events.TRANSITION_OUT);

    settings.status = CONST.SHUTDOWN;

    settings.active = false;
    settings.visible = false;

    if (this.renderer === GLOBAL_CONST.WEBGL) {
      this.renderer.resetTextures(true);
    }

    events.emit(Events.SHUTDOWN, this, data);
  }

  /**
   * Destroy this Scene and send a destroy event all of its systems.
   * A destroyed Scene cannot be restarted.
   * You should not call this directly, instead use `SceneManager.remove`.
   */
  destroy() {
    const events = this.events;
    const settings = this.settings;

    settings.status = CONST.DESTROYED;

    settings.active = false;
    settings.visible = false;

    events.emit(Events.DESTROY, this);

    events.removeAllListeners();

    const props = [
      'scene',
      'game',
      'anims',
      'cache',
      'plugins',
      'registry',
      'sound',
      'textures',
      'add',
      'camera',
      'displayList',
      'events',
      'make',
      'scenePlugin',
      'updateList'
    ];

    let i = 0;
    const length = props.length;
    for (i; i < length; i++) {
      this[props[i] as keyof Systems] = null;
    }
  }
}
