import { Game } from "@thaser/core";
import { DataManager } from "@thaser/data";
import { DisplayList } from "@thaser/gameobjects";
import { CanvasRenderer } from "@thaser/renderer/canvas";
import { WebGLRenderer } from "@thaser/renderer/webgl";
import { CacheManager } from "../cache";
import { EventEmitter } from "../events";
import LoaderPlugin from "../loader/LoaderPlugin";
import { PluginManager, ScenePlugin } from "../plugins";
import { SettingsConfig } from "../types/scene";
import Systems from "./Systems";

/**
 * A base Phaser.Scene class which can be extended for your own use.
 *
 * You can also define the optional methods {@link Phaser.Types.Scenes.SceneInitCallback init()}, {@link Phaser.Types.Scenes.ScenePreloadCallback preload()}, and {@link Phaser.Types.Scenes.SceneCreateCallback create()}.
 */
export default class Scene {
  /**
   *
   * @param config The scene key or scene specific configuration settings.
   */
  constructor(config?: string | SettingsConfig) {
    this.sys = new Systems(this, config!);
  }

  /**
   * The Scene Systems. You must never overwrite this property, or all hell will break lose.
   */
  sys: Systems;

  /**
   * A reference to the Phaser.Game instance.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  game!: Game;

  /**
   * A reference to the global Animation Manager.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  anims: Phaser.Animations.AnimationManager;

  /**
   * A reference to the global Cache.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  cache!: CacheManager;

  /**
   * A reference to the global Data Manager.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  registry!: DataManager;

  /**
   * A reference to the Sound Manager.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  sound:
    | Phaser.Sound.NoAudioSoundManager
    | Phaser.Sound.HTML5AudioSoundManager
    | Phaser.Sound.WebAudioSoundManager;

  /**
   * A reference to the Texture Manager.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  textures: Phaser.Textures.TextureManager;

  /**
   * A Scene specific Event Emitter.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  events!: EventEmitter;

  /**
   * The Scene Camera Manager.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  cameras: Phaser.Cameras.Scene2D.CameraManager;

  /**
   * The Scene Game Object Factory.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  add: Phaser.GameObjects.GameObjectFactory;

  /**
   * The Scene Game Object Creator.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  make: Phaser.GameObjects.GameObjectCreator;

  /**
   * A reference to the Scene Manager Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  scene!: ScenePlugin;

  /**
   * The Game Object Display List belonging to this Scene.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  children!: DisplayList;

  /**
   * The Scene Lights Manager Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  lights: Phaser.GameObjects.LightsManager;

  /**
   * A Scene specific Data Manager Plugin.
   *
   * See the `registry` property for the global Data Manager.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  data!: DataManager;

  /**
   * The Scene Input Manager Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  input: Phaser.Input.InputPlugin;

  /**
   * The Scene Loader Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  load!: LoaderPlugin;

  /**
   * The Scene Time and Clock Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  time: Phaser.Time.Clock;

  /**
   * The Scene Tween Manager Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map and the plugin is installed.
   */
  tweens: Phaser.Tweens.TweenManager;

  /**
   * The Scene Arcade Physics Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
   */
  physics: Phaser.Physics.Arcade.ArcadePhysics;

  /**
   * The Scene Matter Physics Plugin.
   *
   * This property will only be available if defined in the Scene Injection Map, the plugin is installed and configured.
   */
  matter: Phaser.Physics.Matter.MatterPhysics;

  /**
   * A reference to the global Scale Manager.
   *
   * This property will only be available if defined in the Scene Injection Map.
   */
  scale: Phaser.Scale.ScaleManager;

  /**
   * A reference to the global Plugin Manager.
   *
   * The Plugin Manager is a global system that allows plugins to register themselves with it, and can then install
   * those plugins into Scenes as required.
   */
  plugins!: PluginManager;

  /**
   * A reference to the renderer instance Phaser is using, either Canvas Renderer or WebGL Renderer.
   */
  renderer!:
    | CanvasRenderer
    | WebGLRenderer;

  /**
   * This method should be overridden by your own Scenes.
   *
   * This method is called once per game step while the scene is running.
   * @param time The current time. Either a High Resolution Timer value if it comes from Request Animation Frame, or Date.now if using SetTimeout.
   * @param delta The delta time in ms since the last frame. This is a smoothed and capped value based on the FPS rate.
   */
  update(time: number, delta: number): void {}
}
