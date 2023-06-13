import BaseCamera from "./BaseCamera";

/**
 * A Camera.
 *
 * The Camera is the way in which all games are rendered in Phaser. They provide a view into your game world,
 * and can be positioned, rotated, zoomed and scrolled accordingly.
 *
 * A Camera consists of two elements: The viewport and the scroll values.
 *
 * The viewport is the physical position and size of the Camera within your game. Cameras, by default, are
 * created the same size as your game, but their position and size can be set to anything. This means if you
 * wanted to create a camera that was 320x200 in size, positioned in the bottom-right corner of your game,
 * you'd adjust the viewport to do that (using methods like `setViewport` and `setSize`).
 *
 * If you wish to change where the Camera is looking in your game, then you scroll it. You can do this
 * via the properties `scrollX` and `scrollY` or the method `setScroll`. Scrolling has no impact on the
 * viewport, and changing the viewport has no impact on the scrolling.
 *
 * By default a Camera will render all Game Objects it can see. You can change this using the `ignore` method,
 * allowing you to filter Game Objects out on a per-Camera basis.
 *
 * A Camera also has built-in special effects including Fade, Flash and Camera Shake.
 */
export default class Camera
  extends BaseCamera
  implements Phaser.GameObjects.Components.Pipeline
{
  /**
   *
   * @param x The x position of the Camera, relative to the top-left of the game canvas.
   * @param y The y position of the Camera, relative to the top-left of the game canvas.
   * @param width The width of the Camera, in pixels.
   * @param height The height of the Camera, in pixels.
   */
  constructor(x: number, y: number, width: number, height: number);

  /**
   * Does this Camera allow the Game Objects it renders to receive input events?
   */
  inputEnabled: boolean;

  /**
   * The Camera Fade effect handler.
   * To fade this camera see the `Camera.fade` methods.
   */
  fadeEffect: Phaser.Cameras.Scene2D.Effects.Fade;

  /**
   * The Camera Flash effect handler.
   * To flash this camera see the `Camera.flash` method.
   */
  flashEffect: Phaser.Cameras.Scene2D.Effects.Flash;

  /**
   * The Camera Shake effect handler.
   * To shake this camera see the `Camera.shake` method.
   */
  shakeEffect: Phaser.Cameras.Scene2D.Effects.Shake;

  /**
   * The Camera Pan effect handler.
   * To pan this camera see the `Camera.pan` method.
   */
  panEffect: Phaser.Cameras.Scene2D.Effects.Pan;

  /**
   * The Camera Rotate To effect handler.
   * To rotate this camera see the `Camera.rotateTo` method.
   */
  rotateToEffect: Phaser.Cameras.Scene2D.Effects.RotateTo;

  /**
   * The Camera Zoom effect handler.
   * To zoom this camera see the `Camera.zoom` method.
   */
  zoomEffect: Phaser.Cameras.Scene2D.Effects.Zoom;

  /**
   * The linear interpolation value to use when following a target.
   *
   * Can also be set via `setLerp` or as part of the `startFollow` call.
   *
   * The default values of 1 means the camera will instantly snap to the target coordinates.
   * A lower value, such as 0.1 means the camera will more slowly track the target, giving
   * a smooth transition. You can set the horizontal and vertical values independently, and also
   * adjust this value in real-time during your game.
   *
   * Be sure to keep the value between 0 and 1. A value of zero will disable tracking on that axis.
   */
  lerp: Phaser.Math.Vector2;

  /**
   * The values stored in this property are subtracted from the Camera targets position, allowing you to
   * offset the camera from the actual target x/y coordinates by this amount.
   * Can also be set via `setFollowOffset` or as part of the `startFollow` call.
   */
  followOffset: Phaser.Math.Vector2;

  /**
   * The Camera dead zone.
   *
   * The deadzone is only used when the camera is following a target.
   *
   * It defines a rectangular region within which if the target is present, the camera will not scroll.
   * If the target moves outside of this area, the camera will begin scrolling in order to follow it.
   *
   * The `lerp` values that you can set for a follower target also apply when using a deadzone.
   *
   * You can directly set this property to be an instance of a Rectangle. Or, you can use the
   * `setDeadzone` method for a chainable approach.
   *
   * The rectangle you provide can have its dimensions adjusted dynamically, however, please
   * note that its position is updated every frame, as it is constantly re-centered on the cameras mid point.
   *
   * Calling `setDeadzone` with no arguments will reset an active deadzone, as will setting this property
   * to `null`.
   */
  deadzone: Phaser.Geom.Rectangle | null;

  /**
   * Sets the Camera dead zone.
   *
   * The deadzone is only used when the camera is following a target.
   *
   * It defines a rectangular region within which if the target is present, the camera will not scroll.
   * If the target moves outside of this area, the camera will begin scrolling in order to follow it.
   *
   * The deadzone rectangle is re-positioned every frame so that it is centered on the mid-point
   * of the camera. This allows you to use the object for additional game related checks, such as
   * testing if an object is within it or not via a Rectangle.contains call.
   *
   * The `lerp` values that you can set for a follower target also apply when using a deadzone.
   *
   * Calling this method with no arguments will reset an active deadzone.
   * @param width The width of the deadzone rectangle in pixels. If not specified the deadzone is removed.
   * @param height The height of the deadzone rectangle in pixels.
   */
  setDeadzone(width?: number, height?: number): this;

  /**
   * Fades the Camera in from the given color over the duration specified.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param red The amount to fade the red channel towards. A value between 0 and 255. Default 0.
   * @param green The amount to fade the green channel towards. A value between 0 and 255. Default 0.
   * @param blue The amount to fade the blue channel towards. A value between 0 and 255. Default 0.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  fadeIn(
    duration?: number,
    red?: number,
    green?: number,
    blue?: number,
    callback?: Function,
    context?: any
  ): this;

  /**
   * Fades the Camera out to the given color over the duration specified.
   * This is an alias for Camera.fade that forces the fade to start, regardless of existing fades.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param red The amount to fade the red channel towards. A value between 0 and 255. Default 0.
   * @param green The amount to fade the green channel towards. A value between 0 and 255. Default 0.
   * @param blue The amount to fade the blue channel towards. A value between 0 and 255. Default 0.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  fadeOut(
    duration?: number,
    red?: number,
    green?: number,
    blue?: number,
    callback?: Function,
    context?: any
  ): this;

  /**
   * Fades the Camera from the given color to transparent over the duration specified.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param red The amount to fade the red channel towards. A value between 0 and 255. Default 0.
   * @param green The amount to fade the green channel towards. A value between 0 and 255. Default 0.
   * @param blue The amount to fade the blue channel towards. A value between 0 and 255. Default 0.
   * @param force Force the effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  fadeFrom(
    duration?: number,
    red?: number,
    green?: number,
    blue?: number,
    force?: boolean,
    callback?: Function,
    context?: any
  ): this;

  /**
   * Fades the Camera from transparent to the given color over the duration specified.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param red The amount to fade the red channel towards. A value between 0 and 255. Default 0.
   * @param green The amount to fade the green channel towards. A value between 0 and 255. Default 0.
   * @param blue The amount to fade the blue channel towards. A value between 0 and 255. Default 0.
   * @param force Force the effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  fade(
    duration?: number,
    red?: number,
    green?: number,
    blue?: number,
    force?: boolean,
    callback?: Function,
    context?: any
  ): this;

  /**
   * Flashes the Camera by setting it to the given color immediately and then fading it away again quickly over the duration specified.
   * @param duration The duration of the effect in milliseconds. Default 250.
   * @param red The amount to fade the red channel towards. A value between 0 and 255. Default 255.
   * @param green The amount to fade the green channel towards. A value between 0 and 255. Default 255.
   * @param blue The amount to fade the blue channel towards. A value between 0 and 255. Default 255.
   * @param force Force the effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  flash(
    duration?: number,
    red?: number,
    green?: number,
    blue?: number,
    force?: boolean,
    callback?: Function,
    context?: any
  ): this;

  /**
   * Shakes the Camera by the given intensity over the duration specified.
   * @param duration The duration of the effect in milliseconds. Default 100.
   * @param intensity The intensity of the shake. Default 0.05.
   * @param force Force the shake effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent two arguments: A reference to the camera and a progress amount between 0 and 1 indicating how complete the effect is.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  shake(
    duration?: number,
    intensity?: number | Phaser.Math.Vector2,
    force?: boolean,
    callback?: Function,
    context?: any
  ): this;

  /**
   * This effect will scroll the Camera so that the center of its viewport finishes at the given destination,
   * over the duration and with the ease specified.
   * @param x The destination x coordinate to scroll the center of the Camera viewport to.
   * @param y The destination y coordinate to scroll the center of the Camera viewport to.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param ease The ease to use for the pan. Can be any of the Phaser Easing constants or a custom function. Default 'Linear'.
   * @param force Force the pan effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent four arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
   * the current camera scroll x coordinate and the current camera scroll y coordinate.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  pan(
    x: number,
    y: number,
    duration?: number,
    ease?: string | Function,
    force?: boolean,
    callback?: Phaser.Types.Cameras.Scene2D.CameraPanCallback,
    context?: any
  ): this;

  /**
   * This effect will rotate the Camera so that the viewport finishes at the given angle in radians,
   * over the duration and with the ease specified.
   * @param radians The destination angle in radians to rotate the Camera viewport to. If the angle is positive then the rotation is clockwise else anticlockwise
   * @param shortestPath If shortest path is set to true the camera will rotate in the quickest direction clockwise or anti-clockwise. Default false.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param ease The ease to use for the rotation. Can be any of the Phaser Easing constants or a custom function. Default 'Linear'.
   * @param force Force the rotation effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent four arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
   * the current camera rotation angle in radians.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  rotateTo(
    radians: number,
    shortestPath?: boolean,
    duration?: number,
    ease?: string | Function,
    force?: boolean,
    callback?: CameraRotateCallback,
    context?: any
  ): Phaser.Cameras.Scene2D.Camera;

  /**
   * This effect will zoom the Camera to the given scale, over the duration and with the ease specified.
   * @param zoom The target Camera zoom value.
   * @param duration The duration of the effect in milliseconds. Default 1000.
   * @param ease The ease to use for the pan. Can be any of the Phaser Easing constants or a custom function. Default 'Linear'.
   * @param force Force the pan effect to start immediately, even if already running. Default false.
   * @param callback This callback will be invoked every frame for the duration of the effect.
   * It is sent four arguments: A reference to the camera, a progress amount between 0 and 1 indicating how complete the effect is,
   * the current camera scroll x coordinate and the current camera scroll y coordinate.
   * @param context The context in which the callback is invoked. Defaults to the Scene to which the Camera belongs.
   */
  zoomTo(
    zoom: number,
    duration?: number,
    ease?: string | Function,
    force?: boolean,
    callback?: Phaser.Types.Cameras.Scene2D.CameraPanCallback,
    context?: any
  ): this;

  /**
   * Internal preRender step.
   */
  protected preRender(): void;

  /**
   * Sets the linear interpolation value to use when following a target.
   *
   * The default values of 1 means the camera will instantly snap to the target coordinates.
   * A lower value, such as 0.1 means the camera will more slowly track the target, giving
   * a smooth transition. You can set the horizontal and vertical values independently, and also
   * adjust this value in real-time during your game.
   *
   * Be sure to keep the value between 0 and 1. A value of zero will disable tracking on that axis.
   * @param x The amount added to the horizontal linear interpolation of the follow target. Default 1.
   * @param y The amount added to the vertical linear interpolation of the follow target. Default 1.
   */
  setLerp(x?: number, y?: number): this;

  /**
   * Sets the horizontal and vertical offset of the camera from its follow target.
   * The values are subtracted from the targets position during the Cameras update step.
   * @param x The horizontal offset from the camera follow target.x position. Default 0.
   * @param y The vertical offset from the camera follow target.y position. Default 0.
   */
  setFollowOffset(x?: number, y?: number): this;

  /**
   * Sets the Camera to follow a Game Object.
   *
   * When enabled the Camera will automatically adjust its scroll position to keep the target Game Object
   * in its center.
   *
   * You can set the linear interpolation value used in the follow code.
   * Use low lerp values (such as 0.1) to automatically smooth the camera motion.
   *
   * If you find you're getting a slight "jitter" effect when following an object it's probably to do with sub-pixel
   * rendering of the targets position. This can be rounded by setting the `roundPixels` argument to `true` to
   * force full pixel rounding rendering. Note that this can still be broken if you have specified a non-integer zoom
   * value on the camera. So be sure to keep the camera zoom to integers.
   * @param target The target for the Camera to follow.
   * @param roundPixels Round the camera position to whole integers to avoid sub-pixel rendering? Default false.
   * @param lerpX A value between 0 and 1. This value specifies the amount of linear interpolation to use when horizontally tracking the target. The closer the value to 1, the faster the camera will track. Default 1.
   * @param lerpY A value between 0 and 1. This value specifies the amount of linear interpolation to use when vertically tracking the target. The closer the value to 1, the faster the camera will track. Default 1.
   * @param offsetX The horizontal offset from the camera follow target.x position. Default 0.
   * @param offsetY The vertical offset from the camera follow target.y position. Default 0.
   */
  startFollow(
    target: Phaser.GameObjects.GameObject | object,
    roundPixels?: boolean,
    lerpX?: number,
    lerpY?: number,
    offsetX?: number,
    offsetY?: number
  ): this;

  /**
   * Stops a Camera from following a Game Object, if previously set via `Camera.startFollow`.
   */
  stopFollow(): this;

  /**
   * Resets any active FX, such as a fade, flash or shake. Useful to call after a fade in order to
   * remove the fade.
   */
  resetFX(): this;

  /**
   * Internal method called automatically by the Camera Manager.
   * @param time The current timestamp as generated by the Request Animation Frame or SetTimeout.
   * @param delta The delta time, in ms, elapsed since the last frame.
   */
  protected update(time: number, delta: number): void;

  /**
   * Destroys this Camera instance. You rarely need to call this directly.
   *
   * Called by the Camera Manager. If you wish to destroy a Camera please use `CameraManager.remove` as
   * cameras are stored in a pool, ready for recycling later, and calling this directly will prevent that.
   */
  destroy(): void;

  /**
   * Clears all alpha values associated with this Game Object.
   *
   * Immediately sets the alpha levels back to 1 (fully opaque).
   */
  clearAlpha(): this;

  /**
   * The alpha value starting from the top-left of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  alphaTopLeft: number;

  /**
   * The alpha value starting from the top-right of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  alphaTopRight: number;

  /**
   * The alpha value starting from the bottom-left of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  alphaBottomLeft: number;

  /**
   * The alpha value starting from the bottom-right of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   */
  alphaBottomRight: number;

  /**
   * The initial WebGL pipeline of this Game Object.
   *
   * If you call `resetPipeline` on this Game Object, the pipeline is reset to this default.
   */
  defaultPipeline: Phaser.Renderer.WebGL.WebGLPipeline;

  /**
   * The current WebGL pipeline of this Game Object.
   */
  pipeline: Phaser.Renderer.WebGL.WebGLPipeline;

  /**
   * Does this Game Object have any Post Pipelines set?
   */
  hasPostPipeline: boolean;

  /**
   * The WebGL Post FX Pipelines this Game Object uses for post-render effects.
   *
   * The pipelines are processed in the order in which they appear in this array.
   *
   * If you modify this array directly, be sure to set the
   * `hasPostPipeline` property accordingly.
   */
  postPipelines: Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[];

  /**
   * An object to store pipeline specific data in, to be read by the pipelines this Game Object uses.
   */
  pipelineData: object;

  /**
   * Sets the initial WebGL Pipeline of this Game Object.
   *
   * This should only be called during the instantiation of the Game Object. After that, use `setPipeline`.
   * @param pipeline Either the string-based name of the pipeline, or a pipeline instance to set.
   */
  initPipeline(pipeline: string | Phaser.Renderer.WebGL.WebGLPipeline): boolean;

  /**
   * Sets the main WebGL Pipeline of this Game Object.
   *
   * Also sets the `pipelineData` property, if the parameter is given.
   *
   * Both the pipeline and post pipelines share the same pipeline data object.
   * @param pipeline Either the string-based name of the pipeline, or a pipeline instance to set.
   * @param pipelineData Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
   * @param copyData Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead. Default true.
   */
  setPipeline(
    pipeline: string | Phaser.Renderer.WebGL.WebGLPipeline,
    pipelineData?: object,
    copyData?: boolean
  ): this;

  /**
   * Sets one, or more, Post Pipelines on this Game Object.
   *
   * Post Pipelines are invoked after this Game Object has rendered to its target and
   * are commonly used for post-fx.
   *
   * The post pipelines are appended to the `postPipelines` array belonging to this
   * Game Object. When the renderer processes this Game Object, it iterates through the post
   * pipelines in the order in which they appear in the array. If you are stacking together
   * multiple effects, be aware that the order is important.
   *
   * If you call this method multiple times, the new pipelines will be appended to any existing
   * post pipelines already set. Use the `resetPostPipeline` method to clear them first, if required.
   *
   * You can optionally also set the `pipelineData` property, if the parameter is given.
   *
   * Both the pipeline and post pipelines share the pipeline data object together.
   * @param pipelines Either the string-based name of the pipeline, or a pipeline instance, or class, or an array of them.
   * @param pipelineData Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
   * @param copyData Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead. Default true.
   */
  setPostPipeline(
    pipelines:
      | string
      | string[]
      | Function
      | Function[]
      | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
      | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[],
    pipelineData?: object,
    copyData?: boolean
  ): this;

  /**
   * Adds an entry to the `pipelineData` object belonging to this Game Object.
   *
   * If the 'key' already exists, its value is updated. If it doesn't exist, it is created.
   *
   * If `value` is undefined, and `key` exists, `key` is removed from the data object.
   *
   * Both the pipeline and post pipelines share the pipeline data object together.
   * @param key The key of the pipeline data to set, update, or delete.
   * @param value The value to be set with the key. If `undefined` then `key` will be deleted from the object.
   */
  setPipelineData(key: string, value?: any): this;

  /**
   * Gets a Post Pipeline instance from this Game Object, based on the given name, and returns it.
   * @param pipeline The string-based name of the pipeline, or a pipeline class.
   */
  getPostPipeline(
    pipeline: string | Function | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
  ):
    | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
    | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[];

  /**
   * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
   * @param resetPostPipelines Reset all of the post pipelines? Default false.
   * @param resetData Reset the `pipelineData` object to being an empty object? Default false.
   */
  resetPipeline(resetPostPipelines?: boolean, resetData?: boolean): boolean;

  /**
   * Resets the WebGL Post Pipelines of this Game Object. It does this by calling
   * the `destroy` method on each post pipeline and then clearing the local array.
   * @param resetData Reset the `pipelineData` object to being an empty object? Default false.
   */
  resetPostPipeline(resetData?: boolean): void;

  /**
   * Removes a type of Post Pipeline instances from this Game Object, based on the given name, and destroys them.
   *
   * If you wish to remove all Post Pipelines use the `resetPostPipeline` method instead.
   * @param pipeline The string-based name of the pipeline, or a pipeline class.
   */
  removePostPipeline(
    pipeline: string | Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
  ): this;

  /**
   * Gets the name of the WebGL Pipeline this Game Object is currently using.
   */
  getPipelineName(): string;
}
