import { Scene } from '@thaser/scene';

export interface GameConfig {
  scaleMode: any;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
  /**
   * The width of the game, in game pixels.
   */
  width?: number | string;
  /**
   * The height of the game, in game pixels.
   */
  height?: number | string;
  /**
   * Simple scale applied to the game canvas. 2 is double size, 0.5 is half size, etc.
   */
  zoom?: number;
  /**
   * Which renderer to use. Phaser.AUTO, Phaser.CANVAS, Phaser.HEADLESS, or Phaser.WEBGL. AUTO picks WEBGL if available, otherwise CANVAS.
   */
  type?: number;
  /**
   * The DOM element that will contain the game canvas, or its `id`. If undefined, or if the named element doesn't exist, the game canvas is appended to the document body. If `null` no parent will be used and you are responsible for adding the canvas to the dom.
   */
  parent?: HTMLElement | string;
  /**
   * Provide your own Canvas element for Phaser to use instead of creating one.
   */
  canvas?: HTMLCanvasElement;
  /**
   * CSS styles to apply to the game canvas instead of Phasers default styles.
   */
  canvasStyle?: string;
  /**
   * Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
   */
  customEnvironment?: boolean;
  /**
   * Provide your own Canvas Context for Phaser to use, instead of creating one.
   */
  context?: CanvasRenderingContext2D;
  /**
   * A scene or scenes to add to the game. If several are given, the first is started; the remainder are started only if they have `{ active: true }`. See the `sceneConfig` argument in `Scenes.SceneManager#add`.
   */
  scene?:
    | Scene
    | Scene[]
    | SettingsConfig
    | SettingsConfig[]
    | Phaser.Types.Scenes.CreateSceneFromObjectConfig
    | Phaser.Types.Scenes.CreateSceneFromObjectConfig[]
    | Function
    | Function[];
  /**
   * Seed for the random number generator.
   */
  seed?: string[];
  /**
   * The title of the game. Shown in the browser console.
   */
  title?: string;
  /**
   * The URL of the game. Shown in the browser console.
   */
  url?: string;
  /**
   * The version of the game. Shown in the browser console.
   */
  version?: string;
  /**
   * Automatically call window.focus() when the game boots. Usually necessary to capture input events if the game is in a separate frame.
   */
  autoFocus?: boolean;
  /**
   * Input configuration, or `false` to disable all game input.
   */
  input?: boolean | Phaser.Types.Core.InputConfig;
  /**
   * Disable the browser's default 'contextmenu' event (usually triggered by a right-button mouse click).
   */
  disableContextMenu?: boolean;
  /**
   * Configuration for the banner printed in the browser console when the game starts.
   */
  banner?: boolean | Phaser.Types.Core.BannerConfig;
  /**
   * The DOM Container configuration object.
   */
  dom?: Phaser.Types.Core.DOMContainerConfig;
  /**
   * Game loop configuration.
   */
  fps?: Phaser.Types.Core.FPSConfig;
  /**
   * Game renderer configuration.
   */
  render?: Phaser.Types.Core.RenderConfig;
  /**
   * Optional callbacks to run before or after game boot.
   */
  callbacks?: Phaser.Types.Core.CallbacksConfig;
  /**
   * Loader configuration.
   */
  loader?: Phaser.Types.Core.LoaderConfig;
  /**
   * Images configuration.
   */
  images?: Phaser.Types.Core.ImagesConfig;
  /**
   * Physics configuration.
   */
  physics?: Phaser.Types.Core.PhysicsConfig;
  /**
   * Plugins to install.
   */
  plugins?:
    | Phaser.Types.Core.PluginObject
    | Phaser.Types.Core.PluginObjectItem[];
  /**
   * The Scale Manager configuration.
   */
  scale?: Phaser.Types.Core.ScaleConfig;
  /**
   * The Audio Configuration object.
   */
  audio?: Phaser.Types.Core.AudioConfig;
  /**
   * A WebGL Pipeline configuration object. Can also be part of the `RenderConfig`.
   */
  pipeline?: Phaser.Types.Core.PipelineConfig;
  /**
   * The background color of the game canvas. The default is black.
   */
  backgroundColor?: string | number;
  /**
   * When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
   */
  antialias?: boolean;
  /**
   * Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
   */
  antialiasGL?: boolean;
  /**
   * When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
   */
  desynchronized?: boolean;
  /**
   * Sets `antialias` to false and `roundPixels` to true. This is the best setting for pixel-art games.
   */
  pixelArt?: boolean;
  /**
   * Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
   */
  roundPixels?: boolean;
  /**
   * Whether the game canvas will be transparent. Boolean that indicates if the canvas contains an alpha channel. If set to false, the browser now knows that the backdrop is always opaque, which can speed up drawing of transparent content and images.
   */
  transparent?: boolean;
  /**
   * Whether the game canvas will be cleared between each rendering frame.
   */
  clearBeforeRender?: boolean;
  /**
   * If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
   */
  preserveDrawingBuffer?: boolean;
  /**
   * In WebGL mode, the drawing buffer contains colors with pre-multiplied alpha.
   */
  premultipliedAlpha?: boolean;
  /**
   * Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
   */
  failIfMajorPerformanceCaveat?: boolean;
  /**
   * "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
   */
  powerPreference?: string;
  /**
   * The default WebGL batch size. Represents the number of _quads_ that can be added to a single batch.
   */
  batchSize?: number;
  /**
   * The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
   */
  maxLights?: number;
  /**
   * When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
   */
  maxTextures?: number;
  /**
   * The mipmap magFilter to be used when creating WebGL textures.
   */
  mipmapFilter?: string;
  /**
   * Is the Scale Manager allowed to adjust the CSS height property of the parent and/or document body to be 100%?
   */
  expandParent?: boolean;
  /**
   * The scale mode.
   */
  mode?: Phaser.Scale.ScaleModeType;
  /**
   * The minimum width and height the canvas can be scaled down to.
   */
  min?: WidthHeight;
  /**
   * The maximum width the canvas can be scaled up to.
   */
  max?: WidthHeight;
  /**
   * Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
   */
  autoRound?: boolean;
  /**
   * Automatically center the canvas within the parent?
   */
  autoCenter?: Phaser.Scale.CenterType;
  /**
   * How many ms should elapse before checking if the browser size has changed?
   */
  resizeInterval?: number;
  /**
   * The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
   */
  fullscreenTarget?: HTMLElement | string | null;
}
