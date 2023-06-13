import EventEmitter from "eventemitter3";

/**
 * A Base Camera class.
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
 * The Base Camera is extended by the Camera class, which adds in special effects including Fade,
 * Flash and Camera Shake, as well as the ability to follow Game Objects.
 *
 * The Base Camera was introduced in Phaser 3.12. It was split off from the Camera class, to allow
 * you to isolate special effects as needed. Therefore the 'since' values for properties of this class relate
 * to when they were added to the Camera class.
 */
export default class BaseCamera
  extends EventEmitter
  implements
    Phaser.GameObjects.Components.Alpha,
    Phaser.GameObjects.Components.Visible
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
   * A reference to the Scene this camera belongs to.
   */
  scene: Phaser.Scene;

  /**
   * A reference to the Game Scene Manager.
   */
  sceneManager: Phaser.Scenes.SceneManager;

  /**
   * A reference to the Game Scale Manager.
   */
  scaleManager: Phaser.Scale.ScaleManager;

  /**
   * A reference to the Scene's Camera Manager to which this Camera belongs.
   */
  cameraManager: Phaser.Cameras.Scene2D.CameraManager;

  /**
   * The Camera ID. Assigned by the Camera Manager and used to handle camera exclusion.
   * This value is a bitmask.
   */
  readonly id: number;

  /**
   * The name of the Camera. This is left empty for your own use.
   */
  name: string;

  /**
   * Should this camera round its pixel values to integers?
   */
  roundPixels: boolean;

  /**
   * Is this Camera visible or not?
   *
   * A visible camera will render and perform input tests.
   * An invisible camera will not render anything and will skip input tests.
   */
  visible: boolean;

  /**
   * Is this Camera using a bounds to restrict scrolling movement?
   *
   * Set this property along with the bounds via `Camera.setBounds`.
   */
  useBounds: boolean;

  /**
   * The World View is a Rectangle that defines the area of the 'world' the Camera is currently looking at.
   * This factors in the Camera viewport size, zoom and scroll position and is updated in the Camera preRender step.
   * If you have enabled Camera bounds the worldview will be clamped to those bounds accordingly.
   * You can use it for culling or intersection checks.
   */
  readonly worldView: Phaser.Geom.Rectangle;

  /**
   * Is this Camera dirty?
   *
   * A dirty Camera has had either its viewport size, bounds, scroll, rotation or zoom levels changed since the last frame.
   *
   * This flag is cleared during the `postRenderCamera` method of the renderer.
   */
  dirty: boolean;

  /**
   * Does this Camera have a transparent background?
   */
  transparent: boolean;

  /**
   * The background color of this Camera. Only used if `transparent` is `false`.
   */
  backgroundColor: Phaser.Display.Color;

  /**
   * The Camera alpha value. Setting this property impacts every single object that this Camera
   * renders. You can either set the property directly, i.e. via a Tween, to fade a Camera in or out,
   * or via the chainable `setAlpha` method instead.
   */
  alpha: number;

  /**
   * Should the camera cull Game Objects before checking them for input hit tests?
   * In some special cases it may be beneficial to disable this.
   */
  disableCull: boolean;

  /**
   * The mid-point of the Camera in 'world' coordinates.
   *
   * Use it to obtain exactly where in the world the center of the camera is currently looking.
   *
   * This value is updated in the preRender method, after the scroll values and follower
   * have been processed.
   */
  readonly midPoint: Phaser.Math.Vector2;

  /**
   * The horizontal origin of rotation for this Camera.
   *
   * By default the camera rotates around the center of the viewport.
   *
   * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
   * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
   *
   * See `setOrigin` to set both origins in a single, chainable call.
   */
  originX: number;

  /**
   * The vertical origin of rotation for this Camera.
   *
   * By default the camera rotates around the center of the viewport.
   *
   * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
   * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
   *
   * See `setOrigin` to set both origins in a single, chainable call.
   */
  originY: number;

  /**
   * The Mask this Camera is using during render.
   * Set the mask using the `setMask` method. Remove the mask using the `clearMask` method.
   */
  mask:
    | Phaser.Display.Masks.BitmapMask
    | Phaser.Display.Masks.GeometryMask
    | null;

  /**
   * This array is populated with all of the Game Objects that this Camera has rendered
   * in the previous (or current, depending on when you inspect it) frame.
   *
   * It is cleared at the start of `Camera.preUpdate`, or if the Camera is destroyed.
   *
   * You should not modify this array as it is used internally by the input system,
   * however you can read it as required. Note that Game Objects may appear in this
   * list multiple times if they belong to multiple non-exclusive Containers.
   */
  renderList: Phaser.GameObjects.GameObject[];

  /**
   * Adds the given Game Object to this cameras render list.
   *
   * This is invoked during the rendering stage. Only objects that are actually rendered
   * will appear in the render list.
   * @param child The Game Object to add to the render list.
   */
  addToRenderList(child: Phaser.GameObjects.GameObject): void;

  /**
   * Set the Alpha level of this Camera. The alpha controls the opacity of the Camera as it renders.
   * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
   * @param value The Camera alpha value. Default 1.
   */
  setAlpha(value?: number): this;

  /**
   * Sets the rotation origin of this Camera.
   *
   * The values are given in the range 0 to 1 and are only used when calculating Camera rotation.
   *
   * By default the camera rotates around the center of the viewport.
   *
   * Changing the origin allows you to adjust the point in the viewport from which rotation happens.
   * A value of 0 would rotate from the top-left of the viewport. A value of 1 from the bottom right.
   * @param x The horizontal origin value. Default 0.5.
   * @param y The vertical origin value. If not defined it will be set to the value of `x`. Default x.
   */
  setOrigin(x?: number, y?: number): this;

  /**
   * Calculates what the Camera.scrollX and scrollY values would need to be in order to move
   * the Camera so it is centered on the given x and y coordinates, without actually moving
   * the Camera there. The results are clamped based on the Camera bounds, if set.
   * @param x The horizontal coordinate to center on.
   * @param y The vertical coordinate to center on.
   * @param out A Vector2 to store the values in. If not given a new Vector2 is created.
   */
  getScroll(
    x: number,
    y: number,
    out?: Phaser.Math.Vector2
  ): Phaser.Math.Vector2;

  /**
   * Moves the Camera horizontally so that it is centered on the given x coordinate, bounds allowing.
   * Calling this does not change the scrollY value.
   * @param x The horizontal coordinate to center on.
   */
  centerOnX(x: number): this;

  /**
   * Moves the Camera vertically so that it is centered on the given y coordinate, bounds allowing.
   * Calling this does not change the scrollX value.
   * @param y The vertical coordinate to center on.
   */
  centerOnY(y: number): this;

  /**
   * Moves the Camera so that it is centered on the given coordinates, bounds allowing.
   * @param x The horizontal coordinate to center on.
   * @param y The vertical coordinate to center on.
   */
  centerOn(x: number, y: number): this;

  /**
   * Moves the Camera so that it is looking at the center of the Camera Bounds, if enabled.
   */
  centerToBounds(): this;

  /**
   * Moves the Camera so that it is re-centered based on its viewport size.
   */
  centerToSize(): this;

  /**
   * Takes an array of Game Objects and returns a new array featuring only those objects
   * visible by this camera.
   * @param renderableObjects An array of Game Objects to cull.
   */
  cull<G extends Phaser.GameObjects.GameObject[]>(renderableObjects: G): G;

  /**
   * Converts the given `x` and `y` coordinates into World space, based on this Cameras transform.
   * You can optionally provide a Vector2, or similar object, to store the results in.
   * @param x The x position to convert to world space.
   * @param y The y position to convert to world space.
   * @param output An optional object to store the results in. If not provided a new Vector2 will be created.
   */
  getWorldPoint<O extends Phaser.Math.Vector2>(
    x: number,
    y: number,
    output?: O
  ): O;

  /**
   * Given a Game Object, or an array of Game Objects, it will update all of their camera filter settings
   * so that they are ignored by this Camera. This means they will not be rendered by this Camera.
   * @param entries The Game Object, or array of Game Objects, to be ignored by this Camera.
   */
  ignore(
    entries:
      | Phaser.GameObjects.GameObject
      | Phaser.GameObjects.GameObject[]
      | Phaser.GameObjects.Group
  ): this;

  /**
   * Internal preRender step.
   */
  protected preRender(): void;

  /**
   * Takes an x value and checks it's within the range of the Camera bounds, adjusting if required.
   * Do not call this method if you are not using camera bounds.
   * @param x The value to horizontally scroll clamp.
   */
  clampX(x: number): number;

  /**
   * Takes a y value and checks it's within the range of the Camera bounds, adjusting if required.
   * Do not call this method if you are not using camera bounds.
   * @param y The value to vertically scroll clamp.
   */
  clampY(y: number): number;

  /**
   * If this Camera has previously had movement bounds set on it, this will remove them.
   */
  removeBounds(): this;

  /**
   * Set the rotation of this Camera. This causes everything it renders to appear rotated.
   *
   * Rotating a camera does not rotate the viewport itself, it is applied during rendering.
   * @param value The cameras angle of rotation, given in degrees. Default 0.
   */
  setAngle(value?: number): this;

  /**
   * Sets the background color for this Camera.
   *
   * By default a Camera has a transparent background but it can be given a solid color, with any level
   * of transparency, via this method.
   *
   * The color value can be specified using CSS color notation, hex or numbers.
   * @param color The color value. In CSS, hex or numeric color notation. Default 'rgba(0,0,0,0)'.
   */
  setBackgroundColor(
    color?: string | number | Phaser.Types.Display.InputColorObject
  ): this;

  /**
   * Set the bounds of the Camera. The bounds are an axis-aligned rectangle.
   *
   * The Camera bounds controls where the Camera can scroll to, stopping it from scrolling off the
   * edges and into blank space. It does not limit the placement of Game Objects, or where
   * the Camera viewport can be positioned.
   *
   * Temporarily disable the bounds by changing the boolean `Camera.useBounds`.
   *
   * Clear the bounds entirely by calling `Camera.removeBounds`.
   *
   * If you set bounds that are smaller than the viewport it will stop the Camera from being
   * able to scroll. The bounds can be positioned where-ever you wish. By default they are from
   * 0x0 to the canvas width x height. This means that the coordinate 0x0 is the top left of
   * the Camera bounds. However, you can position them anywhere. So if you wanted a game world
   * that was 2048x2048 in size, with 0x0 being the center of it, you can set the bounds x/y
   * to be -1024, -1024, with a width and height of 2048. Depending on your game you may find
   * it easier for 0x0 to be the top-left of the bounds, or you may wish 0x0 to be the middle.
   * @param x The top-left x coordinate of the bounds.
   * @param y The top-left y coordinate of the bounds.
   * @param width The width of the bounds, in pixels.
   * @param height The height of the bounds, in pixels.
   * @param centerOn If `true` the Camera will automatically be centered on the new bounds. Default false.
   */
  setBounds(
    x: number,
    y: number,
    width: number,
    height: number,
    centerOn?: boolean
  ): this;

  /**
   * Returns a rectangle containing the bounds of the Camera.
   *
   * If the Camera does not have any bounds the rectangle will be empty.
   *
   * The rectangle is a copy of the bounds, so is safe to modify.
   * @param out An optional Rectangle to store the bounds in. If not given, a new Rectangle will be created.
   */
  getBounds(out?: Phaser.Geom.Rectangle): Phaser.Geom.Rectangle;

  /**
   * Sets the name of this Camera.
   * This value is for your own use and isn't used internally.
   * @param value The name of the Camera. Default ''.
   */
  setName(value?: string): this;

  /**
   * Set the position of the Camera viewport within the game.
   *
   * This does not change where the camera is 'looking'. See `setScroll` to control that.
   * @param x The top-left x coordinate of the Camera viewport.
   * @param y The top-left y coordinate of the Camera viewport. Default x.
   */
  setPosition(x: number, y?: number): this;

  /**
   * Set the rotation of this Camera. This causes everything it renders to appear rotated.
   *
   * Rotating a camera does not rotate the viewport itself, it is applied during rendering.
   * @param value The rotation of the Camera, in radians. Default 0.
   */
  setRotation(value?: number): this;

  /**
   * Should the Camera round pixel values to whole integers when rendering Game Objects?
   *
   * In some types of game, especially with pixel art, this is required to prevent sub-pixel aliasing.
   * @param value `true` to round Camera pixels, `false` to not.
   */
  setRoundPixels(value: boolean): this;

  /**
   * Sets the Scene the Camera is bound to.
   * @param scene The Scene the camera is bound to.
   */
  setScene(scene: Phaser.Scene): this;

  /**
   * Set the position of where the Camera is looking within the game.
   * You can also modify the properties `Camera.scrollX` and `Camera.scrollY` directly.
   * Use this method, or the scroll properties, to move your camera around the game world.
   *
   * This does not change where the camera viewport is placed. See `setPosition` to control that.
   * @param x The x coordinate of the Camera in the game world.
   * @param y The y coordinate of the Camera in the game world. Default x.
   */
  setScroll(x: number, y?: number): this;

  /**
   * Set the size of the Camera viewport.
   *
   * By default a Camera is the same size as the game, but can be made smaller via this method,
   * allowing you to create mini-cam style effects by creating and positioning a smaller Camera
   * viewport within your game.
   * @param width The width of the Camera viewport.
   * @param height The height of the Camera viewport. Default width.
   */
  setSize(width: number, height?: number): this;

  /**
   * This method sets the position and size of the Camera viewport in a single call.
   *
   * If you're trying to change where the Camera is looking at in your game, then see
   * the method `Camera.setScroll` instead. This method is for changing the viewport
   * itself, not what the camera can see.
   *
   * By default a Camera is the same size as the game, but can be made smaller via this method,
   * allowing you to create mini-cam style effects by creating and positioning a smaller Camera
   * viewport within your game.
   * @param x The top-left x coordinate of the Camera viewport.
   * @param y The top-left y coordinate of the Camera viewport.
   * @param width The width of the Camera viewport.
   * @param height The height of the Camera viewport. Default width.
   */
  setViewport(x: number, y: number, width: number, height?: number): this;

  /**
   * Set the zoom value of the Camera.
   *
   * Changing to a smaller value, such as 0.5, will cause the camera to 'zoom out'.
   * Changing to a larger value, such as 2, will cause the camera to 'zoom in'.
   *
   * A value of 1 means 'no zoom' and is the default.
   *
   * Changing the zoom does not impact the Camera viewport in any way, it is only applied during rendering.
   *
   * As of Phaser 3.50 you can now set the horizontal and vertical zoom values independently.
   * @param x The horizontal zoom value of the Camera. The minimum it can be is 0.001. Default 1.
   * @param y The vertical zoom value of the Camera. The minimum it can be is 0.001. Default x.
   */
  setZoom(x?: number, y?: number): this;

  /**
   * Sets the mask to be applied to this Camera during rendering.
   *
   * The mask must have been previously created and can be either a GeometryMask or a BitmapMask.
   *
   * Bitmap Masks only work on WebGL. Geometry Masks work on both WebGL and Canvas.
   *
   * If a mask is already set on this Camera it will be immediately replaced.
   *
   * Masks have no impact on physics or input detection. They are purely a rendering component
   * that allows you to limit what is visible during the render pass.
   * @param mask The mask this Camera will use when rendering.
   * @param fixedPosition Should the mask translate along with the Camera, or be fixed in place and not impacted by the Cameras transform? Default true.
   */
  setMask(
    mask: Phaser.Display.Masks.BitmapMask | Phaser.Display.Masks.GeometryMask,
    fixedPosition?: boolean
  ): this;

  /**
   * Clears the mask that this Camera was using.
   * @param destroyMask Destroy the mask before clearing it? Default false.
   */
  clearMask(destroyMask?: boolean): this;

  /**
   * Sets the visibility of this Camera.
   *
   * An invisible Camera will skip rendering and input tests of everything it can see.
   * @param value The visible state of the Camera.
   */
  setVisible(value: boolean): this;

  /**
   * Returns an Object suitable for JSON storage containing all of the Camera viewport and rendering properties.
   */
  toJSON(): Phaser.Types.Cameras.Scene2D.JSONCamera;

  /**
   * Internal method called automatically by the Camera Manager.
   * @param time The current timestamp as generated by the Request Animation Frame or SetTimeout.
   * @param delta The delta time, in ms, elapsed since the last frame.
   */
  protected update(time: number, delta: number): void;

  /**
   * Destroys this Camera instance and its internal properties and references.
   * Once destroyed you cannot use this Camera again, even if re-added to a Camera Manager.
   *
   * This method is called automatically by `CameraManager.remove` if that methods `runDestroy` argument is `true`, which is the default.
   *
   * Unless you have a specific reason otherwise, always use `CameraManager.remove` and allow it to handle the camera destruction,
   * rather than calling this method directly.
   */
  destroy(): void;

  /**
   * The x position of the Camera viewport, relative to the top-left of the game canvas.
   * The viewport is the area into which the camera renders.
   * To adjust the position the camera is looking at in the game world, see the `scrollX` value.
   */
  x: number;

  /**
   * The y position of the Camera viewport, relative to the top-left of the game canvas.
   * The viewport is the area into which the camera renders.
   * To adjust the position the camera is looking at in the game world, see the `scrollY` value.
   */
  y: number;

  /**
   * The width of the Camera viewport, in pixels.
   *
   * The viewport is the area into which the Camera renders. Setting the viewport does
   * not restrict where the Camera can scroll to.
   */
  width: number;

  /**
   * The height of the Camera viewport, in pixels.
   *
   * The viewport is the area into which the Camera renders. Setting the viewport does
   * not restrict where the Camera can scroll to.
   */
  height: number;

  /**
   * The horizontal scroll position of this Camera.
   *
   * Change this value to cause the Camera to scroll around your Scene.
   *
   * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
   * will automatically adjust the Camera scroll values accordingly.
   *
   * You can set the bounds within which the Camera can scroll via the `setBounds` method.
   */
  scrollX: number;

  /**
   * The vertical scroll position of this Camera.
   *
   * Change this value to cause the Camera to scroll around your Scene.
   *
   * Alternatively, setting the Camera to follow a Game Object, via the `startFollow` method,
   * will automatically adjust the Camera scroll values accordingly.
   *
   * You can set the bounds within which the Camera can scroll via the `setBounds` method.
   */
  scrollY: number;

  /**
   * The Camera zoom value. Change this value to zoom in, or out of, a Scene.
   *
   * A value of 0.5 would zoom the Camera out, so you can now see twice as much
   * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
   * now takes up 2 pixels when rendered.
   *
   * Set to 1 to return to the default zoom level.
   *
   * Be careful to never set this value to zero.
   */
  zoom: number;

  /**
   * The Camera horizontal zoom value. Change this value to zoom in, or out of, a Scene.
   *
   * A value of 0.5 would zoom the Camera out, so you can now see twice as much
   * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
   * now takes up 2 pixels when rendered.
   *
   * Set to 1 to return to the default zoom level.
   *
   * Be careful to never set this value to zero.
   */
  zoomX: number;

  /**
   * The Camera vertical zoom value. Change this value to zoom in, or out of, a Scene.
   *
   * A value of 0.5 would zoom the Camera out, so you can now see twice as much
   * of the Scene as before. A value of 2 would zoom the Camera in, so every pixel
   * now takes up 2 pixels when rendered.
   *
   * Set to 1 to return to the default zoom level.
   *
   * Be careful to never set this value to zero.
   */
  zoomY: number;

  /**
   * The horizontal position of the center of the Camera's viewport, relative to the left of the game canvas.
   */
  readonly centerX: number;

  /**
   * The vertical position of the center of the Camera's viewport, relative to the top of the game canvas.
   */
  readonly centerY: number;

  /**
   * The displayed width of the camera viewport, factoring in the camera zoom level.
   *
   * If a camera has a viewport width of 800 and a zoom of 0.5 then its display width
   * would be 1600, as it's displaying twice as many pixels as zoom level 1.
   *
   * Equally, a camera with a width of 800 and zoom of 2 would have a display width
   * of 400 pixels.
   */
  readonly displayWidth: number;

  /**
   * The displayed height of the camera viewport, factoring in the camera zoom level.
   *
   * If a camera has a viewport height of 600 and a zoom of 0.5 then its display height
   * would be 1200, as it's displaying twice as many pixels as zoom level 1.
   *
   * Equally, a camera with a height of 600 and zoom of 2 would have a display height
   * of 300 pixels.
   */
  readonly displayHeight: number;

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
}
