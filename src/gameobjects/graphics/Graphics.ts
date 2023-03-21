import GameObject from "../GameObject";

/**
 * A Graphics object is a way to draw primitive shapes to your game. Primitives include forms of geometry, such as
 * Rectangles, Circles, and Polygons. They also include lines, arcs and curves. When you initially create a Graphics
 * object it will be empty.
 *
 * To draw to it you must first specify a line style or fill style (or both), draw shapes using paths, and finally
 * fill or stroke them. For example:
 *
 * ```javascript
 * graphics.lineStyle(5, 0xFF00FF, 1.0);
 * graphics.beginPath();
 * graphics.moveTo(100, 100);
 * graphics.lineTo(200, 200);
 * graphics.closePath();
 * graphics.strokePath();
 * ```
 *
 * There are also many helpful methods that draw and fill/stroke common shapes for you.
 *
 * ```javascript
 * graphics.lineStyle(5, 0xFF00FF, 1.0);
 * graphics.fillStyle(0xFFFFFF, 1.0);
 * graphics.fillRect(50, 50, 400, 200);
 * graphics.strokeRect(50, 50, 400, 200);
 * ```
 *
 * When a Graphics object is rendered it will render differently based on if the game is running under Canvas or WebGL.
 * Under Canvas it will use the HTML Canvas context drawing operations to draw the path.
 * Under WebGL the graphics data is decomposed into polygons. Both of these are expensive processes, especially with
 * complex shapes.
 *
 * If your Graphics object doesn't change much (or at all) once you've drawn your shape to it, then you will help
 * performance by calling {@link Phaser.GameObjects.Graphics#generateTexture}. This will 'bake' the Graphics object into
 * a Texture, and return it. You can then use this Texture for Sprites or other display objects. If your Graphics object
 * updates frequently then you should avoid doing this, as it will constantly generate new textures, which will consume
 * memory.
 *
 * As you can tell, Graphics objects are a bit of a trade-off. While they are extremely useful, you need to be careful
 * in their complexity and quantity of them in your game.
 */
export default class Graphics
  extends GameObject
  implements
    Phaser.GameObjects.Components.AlphaSingle,
    Phaser.GameObjects.Components.BlendMode,
    Phaser.GameObjects.Components.Depth,
    Phaser.GameObjects.Components.Mask,
    Phaser.GameObjects.Components.Pipeline,
    Phaser.GameObjects.Components.Transform,
    Phaser.GameObjects.Components.Visible,
    Phaser.GameObjects.Components.ScrollFactor
{
  /**
   *
   * @param scene The Scene to which this Graphics object belongs.
   * @param options Options that set the position and default style of this Graphics object.
   */
  constructor(
    scene: Phaser.Scene,
    options?: Phaser.Types.GameObjects.Graphics.Options
  );

  /**
   * The horizontal display origin of the Graphics.
   */
  displayOriginX: number;

  /**
   * The vertical display origin of the Graphics.
   */
  displayOriginY: number;

  /**
   * The array of commands used to render the Graphics.
   */
  commandBuffer: any[];

  /**
   * The default fill color for shapes rendered by this Graphics object.
   */
  defaultFillColor: number;

  /**
   * The default fill alpha for shapes rendered by this Graphics object.
   */
  defaultFillAlpha: number;

  /**
   * The default stroke width for shapes rendered by this Graphics object.
   */
  defaultStrokeWidth: number;

  /**
   * The default stroke color for shapes rendered by this Graphics object.
   */
  defaultStrokeColor: number;

  /**
   * The default stroke alpha for shapes rendered by this Graphics object.
   */
  defaultStrokeAlpha: number;

  /**
   * Set the default style settings for this Graphics object.
   * @param options The styles to set as defaults.
   */
  setDefaultStyles(options: Phaser.Types.GameObjects.Graphics.Styles): this;

  /**
   * Set the current line style. Used for all 'stroke' related functions.
   * @param lineWidth The stroke width.
   * @param color The stroke color.
   * @param alpha The stroke alpha. Default 1.
   */
  lineStyle(lineWidth: number, color: number, alpha?: number): this;

  /**
   * Set the current fill style. Used for all 'fill' related functions.
   * @param color The fill color.
   * @param alpha The fill alpha. Default 1.
   */
  fillStyle(color: number, alpha?: number): this;

  /**
   * Sets a gradient fill style. This is a WebGL only feature.
   *
   * The gradient color values represent the 4 corners of an untransformed rectangle.
   * The gradient is used to color all filled shapes and paths drawn after calling this method.
   * If you wish to turn a gradient off, call `fillStyle` and provide a new single fill color.
   *
   * When filling a triangle only the first 3 color values provided are used for the 3 points of a triangle.
   *
   * This feature is best used only on rectangles and triangles. All other shapes will give strange results.
   *
   * Note that for objects such as arcs or ellipses, or anything which is made out of triangles, each triangle used
   * will be filled with a gradient on its own. There is no ability to gradient fill a shape or path as a single
   * entity at this time.
   * @param topLeft The top left fill color.
   * @param topRight The top right fill color.
   * @param bottomLeft The bottom left fill color.
   * @param bottomRight The bottom right fill color. Not used when filling triangles.
   * @param alphaTopLeft The top left alpha value. If you give only this value, it's used for all corners. Default 1.
   * @param alphaTopRight The top right alpha value. Default 1.
   * @param alphaBottomLeft The bottom left alpha value. Default 1.
   * @param alphaBottomRight The bottom right alpha value. Default 1.
   */
  fillGradientStyle(
    topLeft: number,
    topRight: number,
    bottomLeft: number,
    bottomRight: number,
    alphaTopLeft?: number,
    alphaTopRight?: number,
    alphaBottomLeft?: number,
    alphaBottomRight?: number
  ): this;

  /**
   * Sets a gradient line style. This is a WebGL only feature.
   *
   * The gradient color values represent the 4 corners of an untransformed rectangle.
   * The gradient is used to color all stroked shapes and paths drawn after calling this method.
   * If you wish to turn a gradient off, call `lineStyle` and provide a new single line color.
   *
   * This feature is best used only on single lines. All other shapes will give strange results.
   *
   * Note that for objects such as arcs or ellipses, or anything which is made out of triangles, each triangle used
   * will be filled with a gradient on its own. There is no ability to gradient stroke a shape or path as a single
   * entity at this time.
   * @param lineWidth The stroke width.
   * @param topLeft The tint being applied to the top-left of the Game Object.
   * @param topRight The tint being applied to the top-right of the Game Object.
   * @param bottomLeft The tint being applied to the bottom-left of the Game Object.
   * @param bottomRight The tint being applied to the bottom-right of the Game Object.
   * @param alpha The fill alpha. Default 1.
   */
  lineGradientStyle(
    lineWidth: number,
    topLeft: number,
    topRight: number,
    bottomLeft: number,
    bottomRight: number,
    alpha?: number
  ): this;

  /**
   * Start a new shape path.
   */
  beginPath(): this;

  /**
   * Close the current path.
   */
  closePath(): this;

  /**
   * Fill the current path.
   */
  fillPath(): this;

  /**
   * Fill the current path.
   *
   * This is an alias for `Graphics.fillPath` and does the same thing.
   * It was added to match the CanvasRenderingContext 2D API.
   */
  fill(): this;

  /**
   * Stroke the current path.
   */
  strokePath(): this;

  /**
   * Stroke the current path.
   *
   * This is an alias for `Graphics.strokePath` and does the same thing.
   * It was added to match the CanvasRenderingContext 2D API.
   */
  stroke(): this;

  /**
   * Fill the given circle.
   * @param circle The circle to fill.
   */
  fillCircleShape(circle: Phaser.Geom.Circle): this;

  /**
   * Stroke the given circle.
   * @param circle The circle to stroke.
   */
  strokeCircleShape(circle: Phaser.Geom.Circle): this;

  /**
   * Fill a circle with the given position and radius.
   * @param x The x coordinate of the center of the circle.
   * @param y The y coordinate of the center of the circle.
   * @param radius The radius of the circle.
   */
  fillCircle(x: number, y: number, radius: number): this;

  /**
   * Stroke a circle with the given position and radius.
   * @param x The x coordinate of the center of the circle.
   * @param y The y coordinate of the center of the circle.
   * @param radius The radius of the circle.
   */
  strokeCircle(x: number, y: number, radius: number): this;

  /**
   * Fill the given rectangle.
   * @param rect The rectangle to fill.
   */
  fillRectShape(rect: Phaser.Geom.Rectangle): this;

  /**
   * Stroke the given rectangle.
   * @param rect The rectangle to stroke.
   */
  strokeRectShape(rect: Phaser.Geom.Rectangle): this;

  /**
   * Fill a rectangle with the given position and size.
   * @param x The x coordinate of the top-left of the rectangle.
   * @param y The y coordinate of the top-left of the rectangle.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   */
  fillRect(x: number, y: number, width: number, height: number): this;

  /**
   * Stroke a rectangle with the given position and size.
   * @param x The x coordinate of the top-left of the rectangle.
   * @param y The y coordinate of the top-left of the rectangle.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   */
  strokeRect(x: number, y: number, width: number, height: number): this;

  /**
   * Fill a rounded rectangle with the given position, size and radius.
   * @param x The x coordinate of the top-left of the rectangle.
   * @param y The y coordinate of the top-left of the rectangle.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   * @param radius The corner radius; It can also be an object to specify different radii for corners. Default 20.
   */
  fillRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: Phaser.Types.GameObjects.Graphics.RoundedRectRadius | number
  ): this;

  /**
   * Stroke a rounded rectangle with the given position, size and radius.
   * @param x The x coordinate of the top-left of the rectangle.
   * @param y The y coordinate of the top-left of the rectangle.
   * @param width The width of the rectangle.
   * @param height The height of the rectangle.
   * @param radius The corner radius; It can also be an object to specify different radii for corners. Default 20.
   */
  strokeRoundedRect(
    x: number,
    y: number,
    width: number,
    height: number,
    radius?: Phaser.Types.GameObjects.Graphics.RoundedRectRadius | number
  ): this;

  /**
   * Fill the given point.
   *
   * Draws a square at the given position, 1 pixel in size by default.
   * @param point The point to fill.
   * @param size The size of the square to draw. Default 1.
   */
  fillPointShape(
    point: Phaser.Geom.Point | Phaser.Math.Vector2 | object,
    size?: number
  ): this;

  /**
   * Fill a point at the given position.
   *
   * Draws a square at the given position, 1 pixel in size by default.
   * @param x The x coordinate of the point.
   * @param y The y coordinate of the point.
   * @param size The size of the square to draw. Default 1.
   */
  fillPoint(x: number, y: number, size?: number): this;

  /**
   * Fill the given triangle.
   * @param triangle The triangle to fill.
   */
  fillTriangleShape(triangle: Phaser.Geom.Triangle): this;

  /**
   * Stroke the given triangle.
   * @param triangle The triangle to stroke.
   */
  strokeTriangleShape(triangle: Phaser.Geom.Triangle): this;

  /**
   * Fill a triangle with the given points.
   * @param x0 The x coordinate of the first point.
   * @param y0 The y coordinate of the first point.
   * @param x1 The x coordinate of the second point.
   * @param y1 The y coordinate of the second point.
   * @param x2 The x coordinate of the third point.
   * @param y2 The y coordinate of the third point.
   */
  fillTriangle(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): this;

  /**
   * Stroke a triangle with the given points.
   * @param x0 The x coordinate of the first point.
   * @param y0 The y coordinate of the first point.
   * @param x1 The x coordinate of the second point.
   * @param y1 The y coordinate of the second point.
   * @param x2 The x coordinate of the third point.
   * @param y2 The y coordinate of the third point.
   */
  strokeTriangle(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): this;

  /**
   * Draw the given line.
   * @param line The line to stroke.
   */
  strokeLineShape(line: Phaser.Geom.Line): this;

  /**
   * Draw a line between the given points.
   * @param x1 The x coordinate of the start point of the line.
   * @param y1 The y coordinate of the start point of the line.
   * @param x2 The x coordinate of the end point of the line.
   * @param y2 The y coordinate of the end point of the line.
   */
  lineBetween(x1: number, y1: number, x2: number, y2: number): this;

  /**
   * Draw a line from the current drawing position to the given position.
   *
   * Moves the current drawing position to the given position.
   * @param x The x coordinate to draw the line to.
   * @param y The y coordinate to draw the line to.
   */
  lineTo(x: number, y: number): this;

  /**
   * Move the current drawing position to the given position.
   * @param x The x coordinate to move to.
   * @param y The y coordinate to move to.
   */
  moveTo(x: number, y: number): this;

  /**
   * Stroke the shape represented by the given array of points.
   *
   * Pass `closeShape` to automatically close the shape by joining the last to the first point.
   *
   * Pass `closePath` to automatically close the path before it is stroked.
   * @param points The points to stroke.
   * @param closeShape When `true`, the shape is closed by joining the last point to the first point. Default false.
   * @param closePath When `true`, the path is closed before being stroked. Default false.
   * @param endIndex The index of `points` to stop drawing at. Defaults to `points.length`.
   */
  strokePoints(
    points: any[] | Phaser.Geom.Point[],
    closeShape?: boolean,
    closePath?: boolean,
    endIndex?: number
  ): this;

  /**
   * Fill the shape represented by the given array of points.
   *
   * Pass `closeShape` to automatically close the shape by joining the last to the first point.
   *
   * Pass `closePath` to automatically close the path before it is filled.
   * @param points The points to fill.
   * @param closeShape When `true`, the shape is closed by joining the last point to the first point. Default false.
   * @param closePath When `true`, the path is closed before being stroked. Default false.
   * @param endIndex The index of `points` to stop at. Defaults to `points.length`.
   */
  fillPoints(
    points: any[] | Phaser.Geom.Point[],
    closeShape?: boolean,
    closePath?: boolean,
    endIndex?: number
  ): this;

  /**
   * Stroke the given ellipse.
   * @param ellipse The ellipse to stroke.
   * @param smoothness The number of points to draw the ellipse with. Default 32.
   */
  strokeEllipseShape(ellipse: Phaser.Geom.Ellipse, smoothness?: number): this;

  /**
   * Stroke an ellipse with the given position and size.
   * @param x The x coordinate of the center of the ellipse.
   * @param y The y coordinate of the center of the ellipse.
   * @param width The width of the ellipse.
   * @param height The height of the ellipse.
   * @param smoothness The number of points to draw the ellipse with. Default 32.
   */
  strokeEllipse(
    x: number,
    y: number,
    width: number,
    height: number,
    smoothness?: number
  ): this;

  /**
   * Fill the given ellipse.
   * @param ellipse The ellipse to fill.
   * @param smoothness The number of points to draw the ellipse with. Default 32.
   */
  fillEllipseShape(ellipse: Phaser.Geom.Ellipse, smoothness?: number): this;

  /**
   * Fill an ellipse with the given position and size.
   * @param x The x coordinate of the center of the ellipse.
   * @param y The y coordinate of the center of the ellipse.
   * @param width The width of the ellipse.
   * @param height The height of the ellipse.
   * @param smoothness The number of points to draw the ellipse with. Default 32.
   */
  fillEllipse(
    x: number,
    y: number,
    width: number,
    height: number,
    smoothness?: number
  ): this;

  /**
   * Draw an arc.
   *
   * This method can be used to create circles, or parts of circles.
   *
   * Make sure you call `beginPath` before starting the arc unless you wish for the arc to automatically
   * close when filled or stroked.
   *
   * Use the optional `overshoot` argument increase the number of iterations that take place when
   * the arc is rendered in WebGL. This is useful if you're drawing an arc with an especially thick line,
   * as it will allow the arc to fully join-up. Try small values at first, i.e. 0.01.
   *
   * Call {@link Phaser.GameObjects.Graphics#fillPath} or {@link Phaser.GameObjects.Graphics#strokePath} after calling
   * this method to draw the arc.
   * @param x The x coordinate of the center of the circle.
   * @param y The y coordinate of the center of the circle.
   * @param radius The radius of the circle.
   * @param startAngle The starting angle, in radians.
   * @param endAngle The ending angle, in radians.
   * @param anticlockwise Whether the drawing should be anticlockwise or clockwise. Default false.
   * @param overshoot This value allows you to increase the segment iterations in WebGL rendering. Useful if the arc has a thick stroke and needs to overshoot to join-up cleanly. Use small numbers such as 0.01 to start with and increase as needed. Default 0.
   */
  arc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean,
    overshoot?: number
  ): this;

  /**
   * Creates a pie-chart slice shape centered at `x`, `y` with the given radius.
   * You must define the start and end angle of the slice.
   *
   * Setting the `anticlockwise` argument to `true` creates a shape similar to Pacman.
   * Setting it to `false` creates a shape like a slice of pie.
   *
   * This method will begin a new path and close the path at the end of it.
   * To display the actual slice you need to call either `strokePath` or `fillPath` after it.
   * @param x The horizontal center of the slice.
   * @param y The vertical center of the slice.
   * @param radius The radius of the slice.
   * @param startAngle The start angle of the slice, given in radians.
   * @param endAngle The end angle of the slice, given in radians.
   * @param anticlockwise Whether the drawing should be anticlockwise or clockwise. Default false.
   * @param overshoot This value allows you to overshoot the endAngle by this amount. Useful if the arc has a thick stroke and needs to overshoot to join-up cleanly. Default 0.
   */
  slice(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
    anticlockwise?: boolean,
    overshoot?: number
  ): this;

  /**
   * Saves the state of the Graphics by pushing the current state onto a stack.
   *
   * The most recently saved state can then be restored with {@link Phaser.GameObjects.Graphics#restore}.
   */
  save(): this;

  /**
   * Restores the most recently saved state of the Graphics by popping from the state stack.
   *
   * Use {@link Phaser.GameObjects.Graphics#save} to save the current state, and call this afterwards to restore that state.
   *
   * If there is no saved state, this command does nothing.
   */
  restore(): this;

  /**
   * Inserts a translation command into this Graphics objects command buffer.
   *
   * All objects drawn _after_ calling this method will be translated
   * by the given amount.
   *
   * This does not change the position of the Graphics object itself,
   * only of the objects drawn by it after calling this method.
   * @param x The horizontal translation to apply.
   * @param y The vertical translation to apply.
   */
  translateCanvas(x: number, y: number): this;

  /**
   * Inserts a scale command into this Graphics objects command buffer.
   *
   * All objects drawn _after_ calling this method will be scaled
   * by the given amount.
   *
   * This does not change the scale of the Graphics object itself,
   * only of the objects drawn by it after calling this method.
   * @param x The horizontal scale to apply.
   * @param y The vertical scale to apply.
   */
  scaleCanvas(x: number, y: number): this;

  /**
   * Inserts a rotation command into this Graphics objects command buffer.
   *
   * All objects drawn _after_ calling this method will be rotated
   * by the given amount.
   *
   * This does not change the rotation of the Graphics object itself,
   * only of the objects drawn by it after calling this method.
   * @param radians The rotation angle, in radians.
   */
  rotateCanvas(radians: number): this;

  /**
   * Clear the command buffer and reset the fill style and line style to their defaults.
   */
  clear(): this;

  /**
   * Generate a texture from this Graphics object.
   *
   * If `key` is a string it'll generate a new texture using it and add it into the
   * Texture Manager (assuming no key conflict happens).
   *
   * If `key` is a Canvas it will draw the texture to that canvas context. Note that it will NOT
   * automatically upload it to the GPU in WebGL mode.
   *
   * Please understand that the texture is created via the Canvas API of the browser, therefore some
   * Graphics features, such as `fillGradientStyle`, will not appear on the resulting texture,
   * as they're unsupported by the Canvas API.
   * @param key The key to store the texture with in the Texture Manager, or a Canvas to draw to.
   * @param width The width of the graphics to generate.
   * @param height The height of the graphics to generate.
   */
  generateTexture(
    key: string | HTMLCanvasElement,
    width?: number,
    height?: number
  ): this;

  /**
   * Internal destroy handler, called as part of the destroy process.
   */
  protected preDestroy(): void;

  /**
   * A Camera used specifically by the Graphics system for rendering to textures.
   */
  static TargetCamera: Phaser.Cameras.Scene2D.Camera;

  /**
   * Clears all alpha values associated with this Game Object.
   *
   * Immediately sets the alpha levels back to 1 (fully opaque).
   */
  clearAlpha(): this;

  /**
   * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders.
   * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
   * @param value The alpha value applied across the whole Game Object. Default 1.
   */
  setAlpha(value?: number): this;

  /**
   * The alpha value of the Game Object.
   *
   * This is a global value, impacting the entire Game Object, not just a region of it.
   */
  alpha: number;

  /**
   * Sets the Blend Mode being used by this Game Object.
   *
   * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
   *
   * Under WebGL only the following Blend Modes are available:
   *
   * * ADD
   * * MULTIPLY
   * * SCREEN
   * * ERASE
   *
   * Canvas has more available depending on browser support.
   *
   * You can also create your own custom Blend Modes in WebGL.
   *
   * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
   * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
   * reasons try to be careful about the construction of your Scene and the frequency of which blend modes
   * are used.
   */
  blendMode: Phaser.BlendModes | string;

  /**
   * Sets the Blend Mode being used by this Game Object.
   *
   * This can be a const, such as `Phaser.BlendModes.SCREEN`, or an integer, such as 4 (for Overlay)
   *
   * Under WebGL only the following Blend Modes are available:
   *
   * * ADD
   * * MULTIPLY
   * * SCREEN
   * * ERASE (only works when rendering to a framebuffer, like a Render Texture)
   *
   * Canvas has more available depending on browser support.
   *
   * You can also create your own custom Blend Modes in WebGL.
   *
   * Blend modes have different effects under Canvas and WebGL, and from browser to browser, depending
   * on support. Blend Modes also cause a WebGL batch flush should it encounter a new blend mode. For these
   * reasons try to be careful about the construction of your Scene and the frequency in which blend modes
   * are used.
   * @param value The BlendMode value. Either a string or a CONST.
   */
  setBlendMode(value: string | Phaser.BlendModes): this;

  /**
   * The depth of this Game Object within the Scene. Ensure this value is only ever set to a number data-type.
   *
   * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
   * of Game Objects, without actually moving their position in the display list.
   *
   * The default depth is zero. A Game Object with a higher depth
   * value will always render in front of one with a lower value.
   *
   * Setting the depth will queue a depth sort event within the Scene.
   */
  depth: number;

  /**
   * The depth of this Game Object within the Scene.
   *
   * The depth is also known as the 'z-index' in some environments, and allows you to change the rendering order
   * of Game Objects, without actually moving their position in the display list.
   *
   * The default depth is zero. A Game Object with a higher depth
   * value will always render in front of one with a lower value.
   *
   * Setting the depth will queue a depth sort event within the Scene.
   * @param value The depth of this Game Object. Ensure this value is only ever a number data-type.
   */
  setDepth(value: number): this;

  /**
   * The Mask this Game Object is using during render.
   */
  mask: Phaser.Display.Masks.BitmapMask | Phaser.Display.Masks.GeometryMask;

  /**
   * Sets the mask that this Game Object will use to render with.
   *
   * The mask must have been previously created and can be either a GeometryMask or a BitmapMask.
   * Note: Bitmap Masks only work on WebGL. Geometry Masks work on both WebGL and Canvas.
   *
   * If a mask is already set on this Game Object it will be immediately replaced.
   *
   * Masks are positioned in global space and are not relative to the Game Object to which they
   * are applied. The reason for this is that multiple Game Objects can all share the same mask.
   *
   * Masks have no impact on physics or input detection. They are purely a rendering component
   * that allows you to limit what is visible during the render pass.
   * @param mask The mask this Game Object will use when rendering.
   */
  setMask(
    mask: Phaser.Display.Masks.BitmapMask | Phaser.Display.Masks.GeometryMask
  ): this;

  /**
   * Clears the mask that this Game Object was using.
   * @param destroyMask Destroy the mask before clearing it? Default false.
   */
  clearMask(destroyMask?: boolean): this;

  /**
   * Creates and returns a Bitmap Mask. This mask can be used by any Game Object,
   * including this one.
   *
   * Note: Bitmap Masks only work on WebGL. Geometry Masks work on both WebGL and Canvas.
   *
   * To create the mask you need to pass in a reference to a renderable Game Object.
   * A renderable Game Object is one that uses a texture to render with, such as an
   * Image, Sprite, Render Texture or BitmapText.
   *
   * If you do not provide a renderable object, and this Game Object has a texture,
   * it will use itself as the object. This means you can call this method to create
   * a Bitmap Mask from any renderable Game Object.
   * @param renderable A renderable Game Object that uses a texture, such as a Sprite.
   */
  createBitmapMask(
    renderable?: Phaser.GameObjects.GameObject
  ): Phaser.Display.Masks.BitmapMask;

  /**
   * Creates and returns a Geometry Mask. This mask can be used by any Game Object,
   * including this one.
   *
   * To create the mask you need to pass in a reference to a Graphics Game Object.
   *
   * If you do not provide a graphics object, and this Game Object is an instance
   * of a Graphics object, then it will use itself to create the mask.
   *
   * This means you can call this method to create a Geometry Mask from any Graphics Game Object.
   * @param graphics A Graphics Game Object, or any kind of Shape Game Object. The geometry within it will be used as the mask.
   */
  createGeometryMask(
    graphics?: Phaser.GameObjects.Graphics | Phaser.GameObjects.Shape
  ): Phaser.Display.Masks.GeometryMask;

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

  /**
   * A property indicating that a Game Object has this component.
   */
  readonly hasTransformComponent: boolean;

  /**
   * The x position of this Game Object.
   */
  x: number;

  /**
   * The y position of this Game Object.
   */
  y: number;

  /**
   * The z position of this Game Object.
   *
   * Note: The z position does not control the rendering order of 2D Game Objects. Use
   * {@link Phaser.GameObjects.Components.Depth#depth} instead.
   */
  z: number;

  /**
   * The w position of this Game Object.
   */
  w: number;

  /**
   * This is a special setter that allows you to set both the horizontal and vertical scale of this Game Object
   * to the same value, at the same time. When reading this value the result returned is `(scaleX + scaleY) / 2`.
   *
   * Use of this property implies you wish the horizontal and vertical scales to be equal to each other. If this
   * isn't the case, use the `scaleX` or `scaleY` properties instead.
   */
  scale: number;

  /**
   * The horizontal scale of this Game Object.
   */
  scaleX: number;

  /**
   * The vertical scale of this Game Object.
   */
  scaleY: number;

  /**
   * The angle of this Game Object as expressed in degrees.
   *
   * Phaser uses a right-hand clockwise rotation system, where 0 is right, 90 is down, 180/-180 is left
   * and -90 is up.
   *
   * If you prefer to work in radians, see the `rotation` property instead.
   */
  angle: number;

  /**
   * The angle of this Game Object in radians.
   *
   * Phaser uses a right-hand clockwise rotation system, where 0 is right, PI/2 is down, +-PI is left
   * and -PI/2 is up.
   *
   * If you prefer to work in degrees, see the `angle` property instead.
   */
  rotation: number;

  /**
   * Sets the position of this Game Object.
   * @param x The x position of this Game Object. Default 0.
   * @param y The y position of this Game Object. If not set it will use the `x` value. Default x.
   * @param z The z position of this Game Object. Default 0.
   * @param w The w position of this Game Object. Default 0.
   */
  setPosition(x?: number, y?: number, z?: number, w?: number): this;

  /**
   * Copies an object's coordinates to this Game Object's position.
   * @param source An object with numeric 'x', 'y', 'z', or 'w' properties. Undefined values are not copied.
   */
  copyPosition(
    source:
      | Phaser.Types.Math.Vector2Like
      | Phaser.Types.Math.Vector3Like
      | Phaser.Types.Math.Vector4Like
  ): this;

  /**
   * Sets the position of this Game Object to be a random position within the confines of
   * the given area.
   *
   * If no area is specified a random position between 0 x 0 and the game width x height is used instead.
   *
   * The position does not factor in the size of this Game Object, meaning that only the origin is
   * guaranteed to be within the area.
   * @param x The x position of the top-left of the random area. Default 0.
   * @param y The y position of the top-left of the random area. Default 0.
   * @param width The width of the random area.
   * @param height The height of the random area.
   */
  setRandomPosition(
    x?: number,
    y?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * Sets the rotation of this Game Object.
   * @param radians The rotation of this Game Object, in radians. Default 0.
   */
  setRotation(radians?: number): this;

  /**
   * Sets the angle of this Game Object.
   * @param degrees The rotation of this Game Object, in degrees. Default 0.
   */
  setAngle(degrees?: number): this;

  /**
   * Sets the scale of this Game Object.
   * @param x The horizontal scale of this Game Object.
   * @param y The vertical scale of this Game Object. If not set it will use the `x` value. Default x.
   */
  setScale(x: number, y?: number): this;

  /**
   * Sets the x position of this Game Object.
   * @param value The x position of this Game Object. Default 0.
   */
  setX(value?: number): this;

  /**
   * Sets the y position of this Game Object.
   * @param value The y position of this Game Object. Default 0.
   */
  setY(value?: number): this;

  /**
   * Sets the z position of this Game Object.
   *
   * Note: The z position does not control the rendering order of 2D Game Objects. Use
   * {@link Phaser.GameObjects.Components.Depth#setDepth} instead.
   * @param value The z position of this Game Object. Default 0.
   */
  setZ(value?: number): this;

  /**
   * Sets the w position of this Game Object.
   * @param value The w position of this Game Object. Default 0.
   */
  setW(value?: number): this;

  /**
   * Gets the local transform matrix for this Game Object.
   * @param tempMatrix The matrix to populate with the values from this Game Object.
   */
  getLocalTransformMatrix(
    tempMatrix?: Phaser.GameObjects.Components.TransformMatrix
  ): Phaser.GameObjects.Components.TransformMatrix;

  /**
   * Gets the world transform matrix for this Game Object, factoring in any parent Containers.
   * @param tempMatrix The matrix to populate with the values from this Game Object.
   * @param parentMatrix A temporary matrix to hold parent values during the calculations.
   */
  getWorldTransformMatrix(
    tempMatrix?: Phaser.GameObjects.Components.TransformMatrix,
    parentMatrix?: Phaser.GameObjects.Components.TransformMatrix
  ): Phaser.GameObjects.Components.TransformMatrix;

  /**
   * Takes the given `x` and `y` coordinates and converts them into local space for this
   * Game Object, taking into account parent and local transforms, and the Display Origin.
   *
   * The returned Vector2 contains the translated point in its properties.
   *
   * A Camera needs to be provided in order to handle modified scroll factors. If no
   * camera is specified, it will use the `main` camera from the Scene to which this
   * Game Object belongs.
   * @param x The x position to translate.
   * @param y The y position to translate.
   * @param point A Vector2, or point-like object, to store the results in.
   * @param camera The Camera which is being tested against. If not given will use the Scene default camera.
   */
  getLocalPoint(
    x: number,
    y: number,
    point?: Phaser.Math.Vector2,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Math.Vector2;

  /**
   * Gets the sum total rotation of all of this Game Objects parent Containers.
   *
   * The returned value is in radians and will be zero if this Game Object has no parent container.
   */
  getParentRotation(): number;

  /**
   * The visible state of the Game Object.
   *
   * An invisible Game Object will skip rendering, but will still process update logic.
   */
  visible: boolean;

  /**
   * Sets the visibility of this Game Object.
   *
   * An invisible Game Object will skip rendering, but will still process update logic.
   * @param value The visible state of the Game Object.
   */
  setVisible(value: boolean): this;

  /**
   * The horizontal scroll factor of this Game Object.
   *
   * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
   *
   * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
   * It does not change the Game Objects actual position values.
   *
   * A value of 1 means it will move exactly in sync with a camera.
   * A value of 0 means it will not move at all, even if the camera moves.
   * Other values control the degree to which the camera movement is mapped to this Game Object.
   *
   * Please be aware that scroll factor values other than 1 are not taken in to consideration when
   * calculating physics collisions. Bodies always collide based on their world position, but changing
   * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
   * them from physics bodies if not accounted for in your code.
   */
  scrollFactorX: number;

  /**
   * The vertical scroll factor of this Game Object.
   *
   * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
   *
   * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
   * It does not change the Game Objects actual position values.
   *
   * A value of 1 means it will move exactly in sync with a camera.
   * A value of 0 means it will not move at all, even if the camera moves.
   * Other values control the degree to which the camera movement is mapped to this Game Object.
   *
   * Please be aware that scroll factor values other than 1 are not taken in to consideration when
   * calculating physics collisions. Bodies always collide based on their world position, but changing
   * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
   * them from physics bodies if not accounted for in your code.
   */
  scrollFactorY: number;

  /**
   * Sets the scroll factor of this Game Object.
   *
   * The scroll factor controls the influence of the movement of a Camera upon this Game Object.
   *
   * When a camera scrolls it will change the location at which this Game Object is rendered on-screen.
   * It does not change the Game Objects actual position values.
   *
   * A value of 1 means it will move exactly in sync with a camera.
   * A value of 0 means it will not move at all, even if the camera moves.
   * Other values control the degree to which the camera movement is mapped to this Game Object.
   *
   * Please be aware that scroll factor values other than 1 are not taken in to consideration when
   * calculating physics collisions. Bodies always collide based on their world position, but changing
   * the scroll factor is a visual adjustment to where the textures are rendered, which can offset
   * them from physics bodies if not accounted for in your code.
   * @param x The horizontal scroll factor of this Game Object.
   * @param y The vertical scroll factor of this Game Object. If not set it will use the `x` value. Default x.
   */
  setScrollFactor(x: number, y?: number): this;
}
