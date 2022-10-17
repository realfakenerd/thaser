import { Scene } from '@phaser/scene';

interface CreateSceneFromObjectConfig {
  /**
   * The scene's init callback.
   */
  init?: SceneInitCallback;
  /**
   * The scene's preload callback.
   */
  preload?: ScenePreloadCallback;
  /**
   * The scene's create callback.
   */
  create?: SceneCreateCallback;
  /**
   * The scene's update callback. See {@link Phaser.Scene#update}.
   */
  update?: SceneUpdateCallback;
  /**
   * Any additional properties, which will be copied to the Scene after it's created (except `data` or `sys`).
   */
  extend?: any;
  /**
   * Any values, which will be merged into the Scene's Data Manager store.
   */
  'extend.data'?: any;
}

/**
 * Can be defined on your own Scenes. Use it to create your game objects.
 * This method is called by the Scene Manager when the scene starts, after `init()` and `preload()`.
 * If the LoaderPlugin started after `preload()`, then this method is called only after loading is complete.
 */
type SceneCreateCallback = (this: Scene, data: object) => void;

/**
 * Can be defined on your own Scenes.
 * This method is called by the Scene Manager when the scene starts, before `preload()` and `create()`.
 */
type SceneInitCallback = (this: Scene, data: object) => void;

/**
 * Can be defined on your own Scenes. Use it to load assets.
 * This method is called by the Scene Manager, after `init()` and before `create()`, only if the Scene has a LoaderPlugin.
 * After this method completes, if the LoaderPlugin's queue isn't empty, the LoaderPlugin will start automatically.
 */
type ScenePreloadCallback = (this: Scene) => void;

interface SceneTransitionConfig {
  /**
   * The Scene key to transition to.
   */
  target: string;
  /**
   * The duration, in ms, for the transition to last.
   */
  duration?: number;
  /**
   * Will the Scene responsible for the transition be sent to sleep on completion (`true`), or stopped? (`false`)
   */
  sleep?: boolean;
  /**
   * Will the Scene responsible for the transition be removed from the Scene Manager after the transition completes?
   */
  remove?: boolean;
  /**
   * Will the Scenes Input system be able to process events while it is transitioning in or out?
   */
  allowInput?: boolean;
  /**
   * Move the target Scene to be above this one before the transition starts.
   */
  moveAbove?: boolean;
  /**
   * Move the target Scene to be below this one before the transition starts.
   */
  moveBelow?: boolean;
  /**
   * This callback is invoked every frame for the duration of the transition.
   */
  onUpdate?: Function;
  /**
   * The context in which the callback is invoked.
   */
  onUpdateScope?: any;
  /**
   * An object containing any data you wish to be passed to the target scene's init / create methods (if sleep is false) or to the target scene's wake event callback (if sleep is true).
   */
  data?: any;
}

type SceneUpdateCallback = (this: Scene, time: number, delta: number) => void;

interface SettingsConfig {
  /**
   * The unique key of this Scene. Must be unique within the entire Game instance.
   */
  key?: string;
  /**
   * Does the Scene start as active or not? An active Scene updates each step.
   */
  active?: boolean;
  /**
   * Does the Scene start as visible or not? A visible Scene renders each step.
   */
  visible?: boolean;
  /**
   * Files to be loaded before the Scene begins.
   */
  pack?: false | PackFileSection;
  /**
   * An optional Camera configuration object.
   */
  cameras?: JSONCamera | JSONCamera[];
  /**
   * Overwrites the default injection map for a scene.
   */
  map?: { [key: string]: string };
  /**
   * Extends the injection map for a scene.
   */
  mapAdd?: { [key: string]: string };
  /**
   * The physics configuration object for the Scene.
   */
  physics?: PhysicsConfig;
  /**
   * The loader configuration object for the Scene.
   */
  loader?: LoaderConfig;
  /**
   * The plugin configuration object for the Scene.
   */
  plugins?: false | any;
}

interface SettingsObject {
  /**
   * The current status of the Scene. Maps to the Scene constants.
   */
  status: number;
  /**
   * The unique key of this Scene. Unique within the entire Game instance.
   */
  key: string;
  /**
   * The active state of this Scene. An active Scene updates each step.
   */
  active: boolean;
  /**
   * The visible state of this Scene. A visible Scene renders each step.
   */
  visible: boolean;
  /**
   * Has the Scene finished booting?
   */
  isBooted: boolean;
  /**
   * Is the Scene in a state of transition?
   */
  isTransition: boolean;
  /**
   * The Scene this Scene is transitioning from, if set.
   */
  transitionFrom: Scene;
  /**
   * The duration of the transition, if set.
   */
  transitionDuration: number;
  /**
   * Is this Scene allowed to receive input during transitions?
   */
  transitionAllowInput: boolean;
  /**
   * a data bundle passed to this Scene from the Scene Manager.
   */
  data: object;
  /**
   * Files to be loaded before the Scene begins.
   */
  pack: false | PackFileSection;
  /**
   * The Camera configuration object.
   */
  cameras: JSONCamera | JSONCamera[];
  /**
   * The Scene's Injection Map.
   */
  map: { [key: string]: string };
  /**
   * The physics configuration object for the Scene.
   */
  physics: PhysicsConfig;
  /**
   * The loader configuration object for the Scene.
   */
  loader: LoaderConfig;
  /**
   * The plugin configuration object for the Scene.
   */
  plugins: false | any;
}
