import { DefaultPlugins } from '@thaser/plugins';
import { GameConfig } from '@thaser/types/core';
import { GetFastValue, GetValue, IsPlainObject, NOOP } from '@thaser/utils';
import CONST from '../const';
/**
 * The active game configuration settings, parsed from a {@link Phaser.Types.Core.GameConfig} object.
 */
export class Config {
  /**
   *
   * @param gameConfig The configuration object for your Phaser Game instance.
   */
  constructor(gameConfig: GameConfig = {}) {
    const defaultBannerColor = [
      '#ff0000',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#000000'
    ];

    const defaultBannerTextColor = '#ffffff';

    const scaleConfig = GetValue(gameConfig, 'scale', null);

    this.width = GetValue(scaleConfig, 'width', 1024, gameConfig);
    this.height = GetValue(scaleConfig, 'height', 768, gameConfig);
    this.zoom = GetValue(scaleConfig, 'zoom', 1, gameConfig);
    this.parent = GetValue(scaleConfig, 'parent', undefined, gameConfig);
    this.scaleMode = GetValue(
      scaleConfig,
      scaleConfig ? 'mode' : 'scaleMode',
      0,
      gameConfig
    );
    this.autoRound = GetValue(scaleConfig, 'autoRound', false, gameConfig);
    this.autoCenter = GetValue(scaleConfig, 'autoCenter', 0, gameConfig);
    this.resizeInterval = GetValue(
      scaleConfig,
      'resizeInterval',
      500,
      gameConfig
    );
    this.fullscreenTarget = GetValue(
      scaleConfig,
      'fullscreenTarget',
      null,
      gameConfig
    );
    this.minWidth = GetValue(scaleConfig, 'minWidth', 0, gameConfig);
    this.maxWidth = GetValue(scaleConfig, 'maxWidth', 0, gameConfig);
    this.minHeight = GetValue(scaleConfig, 'minHeight', 0, gameConfig);
    this.maxHeight = GetValue(scaleConfig, 'maxHeight', 0, gameConfig);
    this.renderType = GetValue(gameConfig, 'type', CONST.AUTO);
    this.canvas = GetValue(gameConfig, 'canvas', null);
    this.context = GetValue(gameConfig, 'context', null);
    this.canvasStyle = GetValue(gameConfig, 'canvasStyle', null);
    this.customEnvironment = GetValue(gameConfig, 'customEnvironment', false);
    this.sceneConfig = GetValue(gameConfig, 'scene', null);
    this.seed = GetValue(gameConfig, 'seed', [
      (Date.now() * Math.random()).toString()
    ]);
    PhaserMath.RND = new PhaserMath.RandomDataGenerator(this.seed);
    this.gameTitle = GetValue(gameConfig, 'title', '');
    this.gameURL = GetValue(
      gameConfig,
      'url',
      'https://github.com/realfakenerd/thaser'
    );
    this.gameVersion = GetValue(gameConfig, 'version', '0.0.1');
    this.autoFocus = GetValue(gameConfig, 'autoFocus', true);
    this.domCreateContainer = GetValue(
      gameConfig,
      'dom.createComtainer',
      false
    );
    this.domPointerEvents = GetValue(gameConfig, 'dom.pointerEvents', 'none');
    this.inputKeyboard = GetValue(gameConfig, 'input.keyboard', true);
    this.inputKeyboardEventTarget = GetValue(
      gameConfig,
      'input.keyboard.target',
      window
    );

    this.inputKeyboardCapture = GetValue(
      gameConfig,
      'input.keyboard.capture',
      []
    );

    this.inputMouse = GetValue(gameConfig, 'input.mouse', true);

    this.inputMouseEventTarget = GetValue(
      gameConfig,
      'input.mouse.target',
      null
    );

    this.inputMousePreventDefaultDown = GetValue(
      gameConfig,
      'input.mouse.preventDefaultDown',
      true
    );

    this.inputMousePreventDefaultUp = GetValue(
      gameConfig,
      'input.mouse.preventDefaultUp',
      true
    );

    this.inputMousePreventDefaultMove = GetValue(
      gameConfig,
      'input.mouse.preventDefaultMove',
      true
    );

    this.inputMousePreventDefaultWheel = GetValue(
      gameConfig,
      'input.mouse.preventDefaultWheel',
      true
    );

    this.inputTouch = GetValue(gameConfig, 'input.touch', Device.input.touch);

    this.inputTouchEventTarget = GetValue(
      gameConfig,
      'input.touch.target',
      null
    );

    this.inputTouchCapture = GetValue(gameConfig, 'input.touch.capture', true);

    this.inputActivePointers = GetValue(gameConfig, 'input.activePointers', 1);

    this.inputSmoothFactor = GetValue(gameConfig, 'input.smoothFactor', 0);

    this.inputWindowEvents = GetValue(gameConfig, 'input.windowEvents', true);

    this.inputGamepad = GetValue(gameConfig, 'input.gamepad', false);

    this.inputGamepadEventTarget = GetValue(
      gameConfig,
      'input.gamepad.target',
      window
    );

    this.disableContextMenu = GetValue(gameConfig, 'disableContextMenu', false);

    this.audio = GetValue(gameConfig, 'audio', {});

    this.hideBanner = GetValue(gameConfig, 'banner', null) === false;

    this.hidePhaser = GetValue(gameConfig, 'banner.hidePhaser', false);

    this.bannerTextColor = GetValue(
      gameConfig,
      'banner.text',
      defaultBannerTextColor
    );

    this.bannerBackgroundColor = GetValue(
      gameConfig,
      'banner.background',
      defaultBannerColor
    );

    if (this.gameTitle === '' && this.hidePhaser) {
      this.hideBanner = true;
    }

    this.fps = GetValue(gameConfig, 'fps', null);

    const renderConfig = GetValue(gameConfig, 'render', null);

   this.pipeline = GetValue(renderConfig, 'pipeline', null, gameConfig);

    this.antialias = GetValue(renderConfig, 'antialias', true, gameConfig);

    this.antialiasGL = GetValue(renderConfig, 'antialiasGL', true, gameConfig);

    this.mipmapFilter = GetValue(
      renderConfig,
      'mipmapFilter',
      'LINEAR',
      gameConfig
    );

    this.desynchronized = GetValue(
      renderConfig,
      'desynchronized',
      false,
      gameConfig
    );

    this.roundPixels = GetValue(renderConfig, 'roundPixels', false, gameConfig);

    this.pixelArt = GetValue(renderConfig, 'pixelArt', this.zoom !== 1, gameConfig);

    if (this.pixelArt) {
      this.antialias = false;
      this.antialiasGL = false;
      this.roundPixels = true;
    }

    this.transparent = GetValue(renderConfig, 'transparent', false, gameConfig);

    this.clearBeforeRender = GetValue(
      renderConfig,
      'clearBeforeRender',
      true,
      gameConfig
    );

    this.preserveDrawingBuffer = GetValue(
      renderConfig,
      'preserveDrawingBuffer',
      false,
        gameConfig
    );

    this.premultipliedAlpha = GetValue(
      renderConfig,
      'premultipliedAlpha',
      true,
      gameConfig
    );

    this.failIfMajorPerformanceCaveat = GetValue(
      renderConfig,
      'failIfMajorPerformanceCaveat',
      false,
      gameConfig
    );

    this.powerPreference = GetValue(
      renderConfig,
      'powerPreference',
      'default',
      gameConfig
    );

    this.batchSize = GetValue(renderConfig, 'batchSize', 4096, gameConfig);

    this.maxTextures = GetValue(renderConfig, 'maxTextures', -1, gameConfig);

    this.maxLights = GetValue(renderConfig, 'maxLights', 10, gameConfig);

    const bgc = GetValue(gameConfig, 'backgroundColor', 0);

    this.backgroundColor = ValueToColor(bgc);

    if (this.transparent) {
      this.backgroundColor = ValueToColor(0x000000);
      this.backgroundColor.alpha = 0;
    }

    this.preBoot = GetValue(gameConfig, 'callbacks.preBoot', NOOP);

    this.postBoot = GetValue(gameConfig, 'callbacks.postBoot', NOOP);

    this.physics = GetValue(gameConfig, 'physics', {});

    this.defaultPhysicsSystem = GetValue(this.physics, 'default', false);

    this.loaderBaseURL = GetValue(gameConfig, 'loader.baseURL', '');

    this.loaderPath = GetValue(gameConfig, 'loader.path', '');

    this.loaderMaxParallelDownloads = GetValue(
      gameConfig,
      'loader.maxParallelDownloads',
      Device.os.android ? 6 : 32
    );

    this.loaderCrossOrigin = GetValue(
      gameConfig,
      'loader.crossOrigin',
      undefined
    );

    this.loaderResponseType = GetValue(gameConfig, 'loader.responseType', '');

    this.loaderAsync = GetValue(gameConfig, 'loader.async', true);

    this.loaderUser = GetValue(gameConfig, 'loader.user', '');

    this.loaderPassword = GetValue(gameConfig, 'loader.password', '');

    this.loaderTimeout = GetValue(gameConfig, 'loader.timeout', 0);

    this.loaderWithCredentials = GetValue(
      gameConfig,
      'loader.withCredentials',
      false
    );

    this.loaderImageLoadType = GetValue(
      gameConfig,
      'loader.imageLoadType',
      'XHR'
    );

    this.loaderLocalScheme = GetValue(gameConfig, 'loader.localScheme', [
      'file://',
      'capacitor://'
    ]);

    this.installGlobalPlugins = [];

    this.installScenePlugins = [];

    const plugins = GetValue(gameConfig, 'plugins', null);
    let defaultPlugins = DefaultPlugins.DefaultScene;

    if (plugins) {
      if (Array.isArray(plugins)) {
        this.defaultPlugins = plugins;
      } else if (IsPlainObject(plugins)) {
        this.installGlobalPlugins = GetFastValue(plugins, 'global', []);
        this.installScenePlugins = GetFastValue(plugins, 'scene', []);

        if (Array.isArray(plugins.default)) {
          defaultPlugins = plugins.default;
        } else if (Array.isArray(plugins.defaultMerge)) {
          defaultPlugins = defaultPlugins.concat(plugins.defaultMerge);
        }
      }
    }

    this.defaultPlugins = defaultPlugins;

    const pngPrefix = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAg';

    this.defaultImage = GetValue(
      gameConfig,
      'images.default',
      pngPrefix +
        'AQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg=='
    );

    this.missingImage = GetValue(
      gameConfig,
      'images.missing',
      pngPrefix +
        'CAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg=='
    );

    this.whiteImage = GetValue(
      gameConfig,
      'images.white',
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAIAAAAmkwkpAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABdJREFUeNpi/P//PwMMMDEgAdwcgAADAJZuAwXJYZOzAAAAAElFTkSuQmCC'
    );

    this.expandParent = GetValue(scaleConfig, 'expandParent', true, gameConfig);

    if (window) {
      if (window.FORCE_WEBGL) {
        this.renderType = CONST.WEBGL;
      } else if (window.FORCE_CANVAS) {
        this.renderType = CONST.CANVAS;
      }
    }
  }

  /**
   * The width of the underlying canvas, in pixels.
   */
  readonly width: number | string;

  /**
   * The height of the underlying canvas, in pixels.
   */
  readonly height: number | string;

  /**
   * The zoom factor, as used by the Scale Manager.
   */
  readonly zoom: Phaser.Scale.ZoomType | number;

  /**
   * A parent DOM element into which the canvas created by the renderer will be injected.
   */
  readonly parent: any | null;

  /**
   * The scale mode as used by the Scale Manager. The default is zero, which is no scaling.
   */
  readonly scaleMode: Phaser.Scale.ScaleModeType;

  /**
   * Is the Scale Manager allowed to adjust the CSS height property of the parent to be 100%?
   */
  readonly expandParent: boolean;

  /**
   * Automatically round the display and style sizes of the canvas. This can help with performance in lower-powered devices.
   */
  readonly autoRound: boolean;

  /**
   * Automatically center the canvas within the parent?
   */
  readonly autoCenter: Phaser.Scale.CenterType;

  /**
   * How many ms should elapse before checking if the browser size has changed?
   */
  readonly resizeInterval: number;

  /**
   * The DOM element that will be sent into full screen mode, or its `id`. If undefined Phaser will create its own div and insert the canvas into it when entering fullscreen mode.
   */
  readonly fullscreenTarget: HTMLElement | string | null;

  /**
   * The minimum width, in pixels, the canvas will scale down to. A value of zero means no minimum.
   */
  readonly minWidth: number;

  /**
   * The maximum width, in pixels, the canvas will scale up to. A value of zero means no maximum.
   */
  readonly maxWidth: number;

  /**
   * The minimum height, in pixels, the canvas will scale down to. A value of zero means no minimum.
   */
  readonly minHeight: number;

  /**
   * The maximum height, in pixels, the canvas will scale up to. A value of zero means no maximum.
   */
  readonly maxHeight: number;

  /**
   * Force Phaser to use a specific renderer. Can be `CONST.CANVAS`, `CONST.WEBGL`, `CONST.HEADLESS` or `CONST.AUTO` (default)
   */
  readonly renderType: number;

  /**
   * Force Phaser to use your own Canvas element instead of creating one.
   */
  readonly canvas: HTMLCanvasElement | null;

  /**
   * Force Phaser to use your own Canvas context instead of creating one.
   */
  readonly context: CanvasRenderingContext2D | WebGLRenderingContext | null;

  /**
   * Optional CSS attributes to be set on the canvas object created by the renderer.
   */
  readonly canvasStyle: string | null;

  /**
   * Is Phaser running under a custom (non-native web) environment? If so, set this to `true` to skip internal Feature detection. If `true` the `renderType` cannot be left as `AUTO`.
   */
  readonly customEnvironment: boolean;

  /**
   * The default Scene configuration object.
   */
  readonly sceneConfig: object | null;

  /**
   * A seed which the Random Data Generator will use. If not given, a dynamic seed based on the time is used.
   */
  readonly seed: string[];

  /**
   * The title of the game.
   */
  readonly gameTitle: string;

  /**
   * The URL of the game.
   */
  readonly gameURL: string;

  /**
   * The version of the game.
   */
  readonly gameVersion: string;

  /**
   * If `true` the window will automatically be given focus immediately and on any future mousedown event.
   */
  readonly autoFocus: boolean;

  /**
   * Should the game create a div element to act as a DOM Container? Only enable if you're using DOM Element objects. You must provide a parent object if you use this feature.
   */
  readonly domCreateContainer: boolean | null;

  /**
   * The default `pointerEvents` attribute set on the DOM Container.
   */
  readonly domPointerEvents: string | null;

  /**
   * Enable the Keyboard Plugin. This can be disabled in games that don't need keyboard input.
   */
  readonly inputKeyboard: boolean;

  /**
   * The DOM Target to listen for keyboard events on. Defaults to `window` if not specified.
   */
  readonly inputKeyboardEventTarget: any;

  /**
   * `preventDefault` will be called on every non-modified key which has a key code in this array. By default, it is empty.
   */
  readonly inputKeyboardCapture: number[] | null;

  /**
   * Enable the Mouse Plugin. This can be disabled in games that don't need mouse input.
   */
  readonly inputMouse: boolean | object;

  /**
   * The DOM Target to listen for mouse events on. Defaults to the game canvas if not specified.
   */
  readonly inputMouseEventTarget: any | null;

  /**
   * Should `mousedown` DOM events have `preventDefault` called on them?
   */
  readonly inputMousePreventDefaultDown: boolean;

  /**
   * Should `mouseup` DOM events have `preventDefault` called on them?
   */
  readonly inputMousePreventDefaultUp: boolean;

  /**
   * Should `mousemove` DOM events have `preventDefault` called on them?
   */
  readonly inputMousePreventDefaultMove: boolean;

  /**
   * Should `wheel` DOM events have `preventDefault` called on them?
   */
  readonly inputMousePreventDefaultWheel: boolean;

  /**
   * Enable the Touch Plugin. This can be disabled in games that don't need touch input.
   */
  readonly inputTouch: boolean;

  /**
   * The DOM Target to listen for touch events on. Defaults to the game canvas if not specified.
   */
  readonly inputTouchEventTarget: any | null;

  /**
   * Should touch events be captured? I.e. have prevent default called on them.
   */
  readonly inputTouchCapture: boolean;

  /**
   * The number of Pointer objects created by default. In a mouse-only, or non-multi touch game, you can leave this as 1.
   */
  readonly inputActivePointers: number;

  /**
   * The smoothing factor to apply during Pointer movement. See {@link Phaser.Input.Pointer#smoothFactor}.
   */
  readonly inputSmoothFactor: number;

  /**
   * Should Phaser listen for input events on the Window? If you disable this, events like 'POINTER_UP_OUTSIDE' will no longer fire.
   */
  readonly inputWindowEvents: boolean;

  /**
   * Enable the Gamepad Plugin. This can be disabled in games that don't need gamepad input.
   */
  readonly inputGamepad: boolean;

  /**
   * The DOM Target to listen for gamepad events on. Defaults to `window` if not specified.
   */
  readonly inputGamepadEventTarget: any;

  /**
   * Set to `true` to disable the right-click context menu.
   */
  readonly disableContextMenu: boolean;

  /**
   * The Audio Configuration object.
   */
  readonly audio: Phaser.Types.Core.AudioConfig;

  /**
   * Don't write the banner line to the console.log.
   */
  readonly hideBanner: boolean;

  /**
   * Omit Phaser's name and version from the banner.
   */
  readonly hidePhaser: boolean;

  /**
   * The color of the banner text.
   */
  readonly bannerTextColor: string;

  /**
   * The background colors of the banner.
   */
  readonly bannerBackgroundColor: string[];

  /**
   * The Frame Rate Configuration object, as parsed by the Timestep class.
   */
  readonly fps: Phaser.Types.Core.FPSConfig;

  /**
   * An object mapping WebGL names to WebGLPipeline classes. These should be class constructors, not instances.
   */
  readonly pipeline: Phaser.Types.Core.PipelineConfig;

  /**
   * When set to `true`, WebGL uses linear interpolation to draw scaled or rotated textures, giving a smooth appearance. When set to `false`, WebGL uses nearest-neighbor interpolation, giving a crisper appearance. `false` also disables antialiasing of the game canvas itself, if the browser supports it, when the game canvas is scaled.
   */
  readonly antialias: boolean;

  /**
   * Sets the `antialias` property when the WebGL context is created. Setting this value does not impact any subsequent textures that are created, or the canvas style attributes.
   */
  readonly antialiasGL: boolean;

  /**
   * Sets the `mipmapFilter` property when the WebGL renderer is created.
   */
  readonly mipmapFilter: string;

  /**
   * When set to `true` it will create a desynchronized context for both 2D and WebGL. See https://developers.google.com/web/updates/2019/05/desynchronized for details.
   */
  readonly desynchronized: boolean;

  /**
   * Draw texture-based Game Objects at only whole-integer positions. Game Objects without textures, like Graphics, ignore this property.
   */
  readonly roundPixels: boolean;

  /**
   * Prevent pixel art from becoming blurred when scaled. It will remain crisp (tells the WebGL renderer to automatically create textures using a linear filter mode).
   */
  readonly pixelArt: boolean;

  /**
   * Whether the game canvas will have a transparent background.
   */
  readonly transparent: boolean;

  /**
   * Whether the game canvas will be cleared between each rendering frame. You can disable this if you have a full-screen background image or game object.
   */
  readonly clearBeforeRender: boolean;

  /**
   * If the value is true the WebGL buffers will not be cleared and will preserve their values until cleared or overwritten by the author.
   */
  readonly preserveDrawingBuffer: boolean;

  /**
   * In WebGL mode, sets the drawing buffer to contain colors with pre-multiplied alpha.
   */
  readonly premultipliedAlpha: boolean;

  /**
   * Let the browser abort creating a WebGL context if it judges performance would be unacceptable.
   */
  readonly failIfMajorPerformanceCaveat: boolean;

  /**
   * "high-performance", "low-power" or "default". A hint to the browser on how much device power the game might use.
   */
  readonly powerPreference: string;

  /**
   * The default WebGL Batch size. Represents the number of _quads_ that can be added to a single batch.
   */
  readonly batchSize: number;

  /**
   * When in WebGL mode, this sets the maximum number of GPU Textures to use. The default, -1, will use all available units. The WebGL1 spec says all browsers should provide a minimum of 8.
   */
  readonly maxTextures: number;

  /**
   * The maximum number of lights allowed to be visible within range of a single Camera in the LightManager.
   */
  readonly maxLights: number;

  /**
   * The background color of the game canvas. The default is black. This value is ignored if `transparent` is set to `true`.
   */
  readonly backgroundColor: Phaser.Display.Color;

  /**
   * Called before Phaser boots. Useful for initializing anything not related to Phaser that Phaser may require while booting.
   */
  readonly preBoot: Phaser.Types.Core.BootCallback;

  /**
   * A function to run at the end of the boot sequence. At this point, all the game systems have started and plugins have been loaded.
   */
  readonly postBoot: Phaser.Types.Core.BootCallback;

  /**
   * The Physics Configuration object.
   */
  readonly physics: Phaser.Types.Core.PhysicsConfig;

  /**
   * The default physics system. It will be started for each scene. Either 'arcade', 'impact' or 'matter'.
   */
  readonly defaultPhysicsSystem: boolean | string;

  /**
   * A URL used to resolve paths given to the loader. Example: 'http://labs.phaser.io/assets/'.
   */
  readonly loaderBaseURL: string;

  /**
   * A URL path used to resolve relative paths given to the loader. Example: 'images/sprites/'.
   */
  readonly loaderPath: string;

  /**
   * Maximum parallel downloads allowed for resources (Default to 32).
   */
  readonly loaderMaxParallelDownloads: number;

  /**
   * 'anonymous', 'use-credentials', or `undefined`. If you're not making cross-origin requests, leave this as `undefined`. See {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes}.
   */
  readonly loaderCrossOrigin: string | undefined;

  /**
   * The response type of the XHR request, e.g. `blob`, `text`, etc.
   */
  readonly loaderResponseType: string;

  /**
   * Should the XHR request use async or not?
   */
  readonly loaderAsync: boolean;

  /**
   * Optional username for all XHR requests.
   */
  readonly loaderUser: string;

  /**
   * Optional password for all XHR requests.
   */
  readonly loaderPassword: string;

  /**
   * Optional XHR timeout value, in ms.
   */
  readonly loaderTimeout: number;

  /**
   * Optional XHR withCredentials value.
   */
  readonly loaderWithCredentials: boolean;

  /**
   * Optional load type for image, `XHR` is default, or `HTMLImageElement` for a lightweight way.
   */
  readonly loaderImageLoadType: string;

  /**
   * An array of schemes that the Loader considers as being 'local' files. Defaults to: `[ 'file://', 'capacitor://' ]`.
   */
  readonly loaderLocalScheme: string[];

  /**
   * An array of global plugins to be installed.
   */
  readonly installGlobalPlugins: any;

  /**
   * An array of Scene level plugins to be installed.
   */
  readonly installScenePlugins: any;

  /**
   * The plugins installed into every Scene (in addition to CoreScene and Global).
   */
  readonly defaultPlugins: any;

  /**
   * A base64 encoded PNG that will be used as the default blank texture.
   */
  readonly defaultImage: string;

  /**
   * A base64 encoded PNG that will be used as the default texture when a texture is assigned that is missing or not loaded.
   */
  readonly missingImage: string;

  /**
   * A base64 encoded PNG that will be used as the default texture when a texture is assigned that is white or not loaded.
   */
  readonly whiteImage: string;
}
