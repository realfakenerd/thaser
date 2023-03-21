import { Scene } from '@thaser/scene';
import { Animation, PlayAnimationConfig } from '@thaser/types/animations';
import GameObject from '../GameObject';

/**
 * A Sprite Game Object.
 *
 * A Sprite Game Object is used for the display of both static and animated images in your game.
 * Sprites can have input events and physics bodies. They can also be tweened, tinted, scrolled
 * and animated.
 *
 * The main difference between a Sprite and an Image Game Object is that you cannot animate Images.
 * As such, Sprites take a fraction longer to process and have a larger API footprint due to the Animation
 * Component. If you do not require animation then you can safely use Images to replace Sprites in all cases.
 */
export default class Sprite
  extends GameObject
  implements
    Phaser.GameObjects.Components.Alpha,
    Phaser.GameObjects.Components.BlendMode,
    Phaser.GameObjects.Components.Depth,
    Phaser.GameObjects.Components.Flip,
    Phaser.GameObjects.Components.FX,
    Phaser.GameObjects.Components.GetBounds,
    Phaser.GameObjects.Components.Mask,
    Phaser.GameObjects.Components.Origin,
    Phaser.GameObjects.Components.Pipeline,
    Phaser.GameObjects.Components.ScrollFactor,
    Phaser.GameObjects.Components.Size,
    Phaser.GameObjects.Components.TextureCrop,
    Phaser.GameObjects.Components.Tint,
    Phaser.GameObjects.Components.Transform,
    Phaser.GameObjects.Components.Visible
{
  /**
   *
   * @param scene The Scene to which this Game Object belongs. A Game Object can only belong to one Scene at a time.
   * @param x The horizontal position of this Game Object in the world.
   * @param y The vertical position of this Game Object in the world.
   * @param texture The key, or instance of the Texture this Game Object will use to render with, as stored in the Texture Manager.
   * @param frame An optional frame from the Texture this Game Object is rendering with.
   */
  constructor(
    scene: Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number
  ) {
    super(this, scene, 'Sprite');
  }

  /**
   * The internal crop data object, as used by `setCrop` and passed to the `Frame.setCropUVs` method.
   */
  private _crop = this.resetCropObject();

  /**
   * The Animation State component of this Sprite.
   *
   * This component provides features to apply animations to this Sprite.
   * It is responsible for playing, loading, queuing animations for later playback,
   * mixing between animations and setting the current animation frame to this Sprite.
   */
  anims: Phaser.Animations.AnimationState;

  /**
   * Update this Sprite's animations.
   * @param time The current timestamp.
   * @param delta The delta time, in ms, elapsed since the last frame.
   */
  protected preUpdate(time: number, delta: number): void;

  /**
   * Start playing the given animation on this Sprite.
   *
   * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
   *
   * The benefit of a global animation is that multiple Sprites can all play the same animation, without
   * having to duplicate the data. You can just create it once and then play it on any Sprite.
   *
   * The following code shows how to create a global repeating animation. The animation will be created
   * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
   *
   * ```javascript
   * var config = {
   *     key: 'run',
   *     frames: 'muybridge',
   *     frameRate: 15,
   *     repeat: -1
   * };
   *
   * //  This code should be run from within a Scene:
   * this.anims.create(config);
   * ```
   *
   * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
   * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
   * creating a global animation, however the resulting data is kept locally in this Sprite.
   *
   * With the animation created, either globally or locally, you can now play it on this Sprite:
   *
   * ```javascript
   * this.add.sprite(x, y).play('run');
   * ```
   *
   * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
   * object instead:
   *
   * ```javascript
   * this.add.sprite(x, y).play({ key: 'run', frameRate: 24 });
   * ```
   *
   * When playing an animation on a Sprite it will first check to see if it can find a matching key
   * locally within the Sprite. If it can, it will play the local animation. If not, it will then
   * search the global Animation Manager and look for it there.
   *
   * If you need a Sprite to be able to play both local and global animations, make sure they don't
   * have conflicting keys.
   *
   * See the documentation for the `PlayAnimationConfig` config object for more details about this.
   *
   * Also, see the documentation in the Animation Manager for further details on creating animations.
   * @param key The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
   * @param ignoreIfPlaying If an animation is already playing then ignore this call. Default false.
   */
  play(
    key: string | Animation | PlayAnimationConfig,
    ignoreIfPlaying?: boolean
  ): this;

  /**
   * Start playing the given animation on this Sprite, in reverse.
   *
   * Animations in Phaser can either belong to the global Animation Manager, or specifically to this Sprite.
   *
   * The benefit of a global animation is that multiple Sprites can all play the same animation, without
   * having to duplicate the data. You can just create it once and then play it on any Sprite.
   *
   * The following code shows how to create a global repeating animation. The animation will be created
   * from all of the frames within the sprite sheet that was loaded with the key 'muybridge':
   *
   * ```javascript
   * var config = {
   *     key: 'run',
   *     frames: 'muybridge',
   *     frameRate: 15,
   *     repeat: -1
   * };
   *
   * //  This code should be run from within a Scene:
   * this.anims.create(config);
   * ```
   *
   * However, if you wish to create an animation that is unique to this Sprite, and this Sprite alone,
   * you can call the `Animation.create` method instead. It accepts the exact same parameters as when
   * creating a global animation, however the resulting data is kept locally in this Sprite.
   *
   * With the animation created, either globally or locally, you can now play it on this Sprite:
   *
   * ```javascript
   * this.add.sprite(x, y).playReverse('run');
   * ```
   *
   * Alternatively, if you wish to run it at a different frame rate, for example, you can pass a config
   * object instead:
   *
   * ```javascript
   * this.add.sprite(x, y).playReverse({ key: 'run', frameRate: 24 });
   * ```
   *
   * When playing an animation on a Sprite it will first check to see if it can find a matching key
   * locally within the Sprite. If it can, it will play the local animation. If not, it will then
   * search the global Animation Manager and look for it there.
   *
   * If you need a Sprite to be able to play both local and global animations, make sure they don't
   * have conflicting keys.
   *
   * See the documentation for the `PlayAnimationConfig` config object for more details about this.
   *
   * Also, see the documentation in the Animation Manager for further details on creating animations.
   * @param key The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
   * @param ignoreIfPlaying If an animation is already playing then ignore this call. Default false.
   */
  playReverse(
    key:
      | string
      | Phaser.Animations.Animation
      | Phaser.Types.Animations.PlayAnimationConfig,
    ignoreIfPlaying?: boolean
  ): this;

  /**
   * Waits for the specified delay, in milliseconds, then starts playback of the given animation.
   *
   * If the animation _also_ has a delay value set in its config, it will be **added** to the delay given here.
   *
   * If an animation is already running and a new animation is given to this method, it will wait for
   * the given delay before starting the new animation.
   *
   * If no animation is currently running, the given one begins after the delay.
   *
   * When playing an animation on a Sprite it will first check to see if it can find a matching key
   * locally within the Sprite. If it can, it will play the local animation. If not, it will then
   * search the global Animation Manager and look for it there.
   *
   * Prior to Phaser 3.50 this method was called 'delayedPlay'.
   * @param key The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
   * @param delay The delay, in milliseconds, to wait before starting the animation playing.
   */
  playAfterDelay(
    key:
      | string
      | Phaser.Animations.Animation
      | Phaser.Types.Animations.PlayAnimationConfig,
    delay: number
  ): this;

  /**
   * Waits for the current animation to complete the `repeatCount` number of repeat cycles, then starts playback
   * of the given animation.
   *
   * You can use this to ensure there are no harsh jumps between two sets of animations, i.e. going from an
   * idle animation to a walking animation, by making them blend smoothly into each other.
   *
   * If no animation is currently running, the given one will start immediately.
   *
   * When playing an animation on a Sprite it will first check to see if it can find a matching key
   * locally within the Sprite. If it can, it will play the local animation. If not, it will then
   * search the global Animation Manager and look for it there.
   * @param key The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object.
   * @param repeatCount How many times should the animation repeat before the next one starts? Default 1.
   */
  playAfterRepeat(
    key:
      | string
      | Phaser.Animations.Animation
      | Phaser.Types.Animations.PlayAnimationConfig,
    repeatCount?: number
  ): this;

  /**
   * Sets an animation, or an array of animations, to be played immediately after the current one completes or stops.
   *
   * The current animation must enter a 'completed' state for this to happen, i.e. finish all of its repeats, delays, etc,
   * or have the `stop` method called directly on it.
   *
   * An animation set to repeat forever will never enter a completed state.
   *
   * You can chain a new animation at any point, including before the current one starts playing, during it,
   * or when it ends (via its `animationcomplete` event).
   *
   * Chained animations are specific to a Game Object, meaning different Game Objects can have different chained
   * animations without impacting the animation they're playing.
   *
   * Call this method with no arguments to reset all currently chained animations.
   *
   * When playing an animation on a Sprite it will first check to see if it can find a matching key
   * locally within the Sprite. If it can, it will play the local animation. If not, it will then
   * search the global Animation Manager and look for it there.
   * @param key The string-based key of the animation to play, or an Animation instance, or a `PlayAnimationConfig` object, or an array of them.
   */
  chain(
    key?:
      | string
      | Phaser.Animations.Animation
      | Phaser.Types.Animations.PlayAnimationConfig
      | string[]
      | Phaser.Animations.Animation[]
      | Phaser.Types.Animations.PlayAnimationConfig[]
  ): this;

  /**
   * Immediately stops the current animation from playing and dispatches the `ANIMATION_STOP` events.
   *
   * If no animation is playing, no event will be dispatched.
   *
   * If there is another animation queued (via the `chain` method) then it will start playing immediately.
   */
  stop(): this;

  /**
   * Stops the current animation from playing after the specified time delay, given in milliseconds.
   *
   * It then dispatches the `ANIMATION_STOP` event.
   *
   * If no animation is running, no events will be dispatched.
   *
   * If there is another animation in the queue (set via the `chain` method) then it will start playing,
   * when the current one stops.
   * @param delay The number of milliseconds to wait before stopping this animation.
   */
  stopAfterDelay(delay: number): this;

  /**
   * Stops the current animation from playing after the given number of repeats.
   *
   * It then dispatches the `ANIMATION_STOP` event.
   *
   * If no animation is running, no events will be dispatched.
   *
   * If there is another animation in the queue (set via the `chain` method) then it will start playing,
   * when the current one stops.
   * @param repeatCount How many times should the animation repeat before stopping? Default 1.
   */
  stopAfterRepeat(repeatCount?: number): this;

  /**
   * Stops the current animation from playing when it next sets the given frame.
   * If this frame doesn't exist within the animation it will not stop it from playing.
   *
   * It then dispatches the `ANIMATION_STOP` event.
   *
   * If no animation is running, no events will be dispatched.
   *
   * If there is another animation in the queue (set via the `chain` method) then it will start playing,
   * when the current one stops.
   * @param frame The frame to check before stopping this animation.
   */
  stopOnFrame(frame: Phaser.Animations.AnimationFrame): this;

  /**
   * Build a JSON representation of this Sprite.
   */
  toJSON(): Phaser.Types.GameObjects.JSONGameObject;

  /**
   * Clears all alpha values associated with this Game Object.
   *
   * Immediately sets the alpha levels back to 1 (fully opaque).
   */
  clearAlpha(): this;

  /**
   * Set the Alpha level of this Game Object. The alpha controls the opacity of the Game Object as it renders.
   * Alpha values are provided as a float between 0, fully transparent, and 1, fully opaque.
   *
   * If your game is running under WebGL you can optionally specify four different alpha values, each of which
   * correspond to the four corners of the Game Object. Under Canvas only the `topLeft` value given is used.
   * @param topLeft The alpha value used for the top-left of the Game Object. If this is the only value given it's applied across the whole Game Object. Default 1.
   * @param topRight The alpha value used for the top-right of the Game Object. WebGL only.
   * @param bottomLeft The alpha value used for the bottom-left of the Game Object. WebGL only.
   * @param bottomRight The alpha value used for the bottom-right of the Game Object. WebGL only.
   */
  setAlpha(
    topLeft?: number,
    topRight?: number,
    bottomLeft?: number,
    bottomRight?: number
  ): this;

  /**
   * The alpha value of the Game Object.
   *
   * This is a global value, impacting the entire Game Object, not just a region of it.
   */
  alpha: number;

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
   * The horizontally flipped state of the Game Object.
   *
   * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   */
  flipX: boolean;

  /**
   * The vertically flipped state of the Game Object.
   *
   * A Game Object that is flipped vertically will render inversed on the vertical axis (i.e. upside down)
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   */
  flipY: boolean;

  /**
   * Toggles the horizontal flipped state of this Game Object.
   *
   * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   */
  toggleFlipX(): this;

  /**
   * Toggles the vertical flipped state of this Game Object.
   */
  toggleFlipY(): this;

  /**
   * Sets the horizontal flipped state of this Game Object.
   *
   * A Game Object that is flipped horizontally will render inversed on the horizontal axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   * @param value The flipped state. `false` for no flip, or `true` to be flipped.
   */
  setFlipX(value: boolean): this;

  /**
   * Sets the vertical flipped state of this Game Object.
   * @param value The flipped state. `false` for no flip, or `true` to be flipped.
   */
  setFlipY(value: boolean): this;

  /**
   * Sets the horizontal and vertical flipped state of this Game Object.
   *
   * A Game Object that is flipped will render inversed on the flipped axis.
   * Flipping always takes place from the middle of the texture and does not impact the scale value.
   * If this Game Object has a physics body, it will not change the body. This is a rendering toggle only.
   * @param x The horizontal flipped state. `false` for no flip, or `true` to be flipped.
   * @param y The horizontal flipped state. `false` for no flip, or `true` to be flipped.
   */
  setFlip(x: boolean, y: boolean): this;

  /**
   * Resets the horizontal and vertical flipped state of this Game Object back to their default un-flipped state.
   */
  resetFlip(): this;

  /**
   * The amount of extra padding to be applied to this Game Object
   * when it is being rendered by a SpriteFX Pipeline.
   *
   * Lots of FX require additional spacing added to the texture the
   * Game Object uses, for example a glow or shadow effect, and this
   * method allows you to control how much extra padding is included
   * in addition to the texture size.
   */
  fxPadding: number;

  /**
   * Sets the amount of extra padding to be applied to this Game Object
   * when it is being rendered by a SpriteFX Pipeline.
   *
   * Lots of FX require additional spacing added to the texture the
   * Game Object uses, for example a glow or shadow effect, and this
   * method allows you to control how much extra padding is included
   * in addition to the texture size.
   * @param padding The amount of padding to add to the texture. Default 0.
   */
  setFXPadding(padding?: number): this;

  /**
   * This callback is invoked when this Game Object is copied by a SpriteFX Pipeline.
   *
   * This happens when the pipeline uses its `copySprite` method.
   *
   * It's invoked prior to the copy, allowing you to set shader uniforms, etc on the pipeline.
   * @param pipeline The SpriteFX Pipeline that invoked this callback.
   */
  onFXCopy(pipeline: Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline): void;

  /**
   * This callback is invoked when this Game Object is rendered by a SpriteFX Pipeline.
   *
   * This happens when the pipeline uses its `drawSprite` method.
   *
   * It's invoked prior to the draw, allowing you to set shader uniforms, etc on the pipeline.
   * @param pipeline The SpriteFX Pipeline that invoked this callback.
   */
  onFX(pipeline: Phaser.Renderer.WebGL.Pipelines.SpriteFXPipeline): void;

  /**
   * Gets the center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   */
  getCenter<O extends Phaser.Math.Vector2>(output?: O): O;

  /**
   * Gets the top-left corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getTopLeft<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the top-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getTopCenter<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the top-right corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getTopRight<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the left-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getLeftCenter<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the right-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getRightCenter<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the bottom-left corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getBottomLeft<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the bottom-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getBottomCenter<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the bottom-right corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getBottomRight<O extends Phaser.Math.Vector2>(
    output?: O,
    includeParent?: boolean
  ): O;

  /**
   * Gets the bounds of this Game Object, regardless of origin.
   * The values are stored and returned in a Rectangle, or Rectangle-like, object.
   * @param output An object to store the values in. If not provided a new Rectangle will be created.
   */
  getBounds<O extends Phaser.Geom.Rectangle>(output?: O): O;

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
   * The horizontal origin of this Game Object.
   * The origin maps the relationship between the size and position of the Game Object.
   * The default value is 0.5, meaning all Game Objects are positioned based on their center.
   * Setting the value to 0 means the position now relates to the left of the Game Object.
   */
  originX: number;

  /**
   * The vertical origin of this Game Object.
   * The origin maps the relationship between the size and position of the Game Object.
   * The default value is 0.5, meaning all Game Objects are positioned based on their center.
   * Setting the value to 0 means the position now relates to the top of the Game Object.
   */
  originY: number;

  /**
   * The horizontal display origin of this Game Object.
   * The origin is a normalized value between 0 and 1.
   * The displayOrigin is a pixel value, based on the size of the Game Object combined with the origin.
   */
  displayOriginX: number;

  /**
   * The vertical display origin of this Game Object.
   * The origin is a normalized value between 0 and 1.
   * The displayOrigin is a pixel value, based on the size of the Game Object combined with the origin.
   */
  displayOriginY: number;

  /**
   * Sets the origin of this Game Object.
   *
   * The values are given in the range 0 to 1.
   * @param x The horizontal origin value. Default 0.5.
   * @param y The vertical origin value. If not defined it will be set to the value of `x`. Default x.
   */
  setOrigin(x?: number, y?: number): this;

  /**
   * Sets the origin of this Game Object based on the Pivot values in its Frame.
   */
  setOriginFromFrame(): this;

  /**
   * Sets the display origin of this Game Object.
   * The difference between this and setting the origin is that you can use pixel values for setting the display origin.
   * @param x The horizontal display origin value. Default 0.
   * @param y The vertical display origin value. If not defined it will be set to the value of `x`. Default x.
   */
  setDisplayOrigin(x?: number, y?: number): this;

  /**
   * Updates the Display Origin cached values internally stored on this Game Object.
   * You don't usually call this directly, but it is exposed for edge-cases where you may.
   */
  updateDisplayOrigin(): this;

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

  /**
   * The native (un-scaled) width of this Game Object.
   *
   * Changing this value will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or use
   * the `displayWidth` property.
   */
  width: number;

  /**
   * The native (un-scaled) height of this Game Object.
   *
   * Changing this value will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or use
   * the `displayHeight` property.
   */
  height: number;

  /**
   * The displayed width of this Game Object.
   *
   * This value takes into account the scale factor.
   *
   * Setting this value will adjust the Game Object's scale property.
   */
  displayWidth: number;

  /**
   * The displayed height of this Game Object.
   *
   * This value takes into account the scale factor.
   *
   * Setting this value will adjust the Game Object's scale property.
   */
  displayHeight: number;

  /**
   * Sets the size of this Game Object to be that of the given Frame.
   *
   * This will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or call the
   * `setDisplaySize` method, which is the same thing as changing the scale but allows you
   * to do so by giving pixel values.
   *
   * If you have enabled this Game Object for input, changing the size will _not_ change the
   * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
   * @param frame The frame to base the size of this Game Object on.
   */
  setSizeToFrame(frame: Phaser.Textures.Frame): this;

  /**
   * Sets the internal size of this Game Object, as used for frame or physics body creation.
   *
   * This will not change the size that the Game Object is rendered in-game.
   * For that you need to either set the scale of the Game Object (`setScale`) or call the
   * `setDisplaySize` method, which is the same thing as changing the scale but allows you
   * to do so by giving pixel values.
   *
   * If you have enabled this Game Object for input, changing the size will _not_ change the
   * size of the hit area. To do this you should adjust the `input.hitArea` object directly.
   * @param width The width of this Game Object.
   * @param height The height of this Game Object.
   */
  setSize(width: number, height: number): this;

  /**
   * Sets the display size of this Game Object.
   *
   * Calling this will adjust the scale.
   * @param width The width of this Game Object.
   * @param height The height of this Game Object.
   */
  setDisplaySize(width: number, height: number): this;

  /**
   * The Texture this Game Object is using to render with.
   */
  texture: Phaser.Textures.Texture | Phaser.Textures.CanvasTexture;

  /**
   * The Texture Frame this Game Object is using to render with.
   */
  frame: Phaser.Textures.Frame;

  /**
   * A boolean flag indicating if this Game Object is being cropped or not.
   * You can toggle this at any time after `setCrop` has been called, to turn cropping on or off.
   * Equally, calling `setCrop` with no arguments will reset the crop and disable it.
   */
  isCropped: boolean;

  /**
   * Applies a crop to a texture based Game Object, such as a Sprite or Image.
   *
   * The crop is a rectangle that limits the area of the texture frame that is visible during rendering.
   *
   * Cropping a Game Object does not change its size, dimensions, physics body or hit area, it just
   * changes what is shown when rendered.
   *
   * The crop coordinates are relative to the texture frame, not the Game Object, meaning 0 x 0 is the top-left.
   *
   * Therefore, if you had a Game Object that had an 800x600 sized texture, and you wanted to show only the left
   * half of it, you could call `setCrop(0, 0, 400, 600)`.
   *
   * It is also scaled to match the Game Object scale automatically. Therefore a crop rect of 100x50 would crop
   * an area of 200x100 when applied to a Game Object that had a scale factor of 2.
   *
   * You can either pass in numeric values directly, or you can provide a single Rectangle object as the first argument.
   *
   * Call this method with no arguments at all to reset the crop, or toggle the property `isCropped` to `false`.
   *
   * You should do this if the crop rectangle becomes the same size as the frame itself, as it will allow
   * the renderer to skip several internal calculations.
   * @param x The x coordinate to start the crop from. Or a Phaser.Geom.Rectangle object, in which case the rest of the arguments are ignored.
   * @param y The y coordinate to start the crop from.
   * @param width The width of the crop rectangle in pixels.
   * @param height The height of the crop rectangle in pixels.
   */
  setCrop(
    x?: number | Phaser.Geom.Rectangle,
    y?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * Sets the texture and frame this Game Object will use to render with.
   *
   * Textures are referenced by their string-based keys, as stored in the Texture Manager.
   * @param key The key of the texture to be used, as stored in the Texture Manager.
   * @param frame The name or index of the frame within the Texture.
   */
  setTexture(key: string, frame?: string | number): this;

  /**
   * Sets the frame this Game Object will use to render with.
   *
   * The Frame has to belong to the current Texture being used.
   *
   * It can be either a string or an index.
   *
   * Calling `setFrame` will modify the `width` and `height` properties of your Game Object.
   * It will also change the `origin` if the Frame has a custom pivot point, as exported from packages like Texture Packer.
   * @param frame The name or index of the frame within the Texture.
   * @param updateSize Should this call adjust the size of the Game Object? Default true.
   * @param updateOrigin Should this call adjust the origin of the Game Object? Default true.
   */
  setFrame(
    frame: string | number,
    updateSize?: boolean,
    updateOrigin?: boolean
  ): this;

  /**
   * The tint value being applied to the top-left vertice of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
   */
  tintTopLeft: number;

  /**
   * The tint value being applied to the top-right vertice of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
   */
  tintTopRight: number;

  /**
   * The tint value being applied to the bottom-left vertice of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
   */
  tintBottomLeft: number;

  /**
   * The tint value being applied to the bottom-right vertice of the Game Object.
   * This value is interpolated from the corner to the center of the Game Object.
   * The value should be set as a hex number, i.e. 0xff0000 for red, or 0xff00ff for purple.
   */
  tintBottomRight: number;

  /**
   * The tint fill mode.
   *
   * `false` = An additive tint (the default), where vertices colors are blended with the texture.
   * `true` = A fill tint, where the vertices colors replace the texture, but respects texture alpha.
   */
  tintFill: boolean;

  /**
   * Clears all tint values associated with this Game Object.
   *
   * Immediately sets the color values back to 0xffffff and the tint type to 'additive',
   * which results in no visible change to the texture.
   */
  clearTint(): this;

  /**
   * Sets an additive tint on this Game Object.
   *
   * The tint works by taking the pixel color values from the Game Objects texture, and then
   * multiplying it by the color value of the tint. You can provide either one color value,
   * in which case the whole Game Object will be tinted in that color. Or you can provide a color
   * per corner. The colors are blended together across the extent of the Game Object.
   *
   * To modify the tint color once set, either call this method again with new values or use the
   * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
   * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
   *
   * To remove a tint call `clearTint`.
   *
   * To swap this from being an additive tint to a fill based tint set the property `tintFill` to `true`.
   * @param topLeft The tint being applied to the top-left of the Game Object. If no other values are given this value is applied evenly, tinting the whole Game Object. Default 0xffffff.
   * @param topRight The tint being applied to the top-right of the Game Object.
   * @param bottomLeft The tint being applied to the bottom-left of the Game Object.
   * @param bottomRight The tint being applied to the bottom-right of the Game Object.
   */
  setTint(
    topLeft?: number,
    topRight?: number,
    bottomLeft?: number,
    bottomRight?: number
  ): this;

  /**
   * Sets a fill-based tint on this Game Object.
   *
   * Unlike an additive tint, a fill-tint literally replaces the pixel colors from the texture
   * with those in the tint. You can use this for effects such as making a player flash 'white'
   * if hit by something. You can provide either one color value, in which case the whole
   * Game Object will be rendered in that color. Or you can provide a color per corner. The colors
   * are blended together across the extent of the Game Object.
   *
   * To modify the tint color once set, either call this method again with new values or use the
   * `tint` property to set all colors at once. Or, use the properties `tintTopLeft`, `tintTopRight,
   * `tintBottomLeft` and `tintBottomRight` to set the corner color values independently.
   *
   * To remove a tint call `clearTint`.
   *
   * To swap this from being a fill-tint to an additive tint set the property `tintFill` to `false`.
   * @param topLeft The tint being applied to the top-left of the Game Object. If not other values are given this value is applied evenly, tinting the whole Game Object. Default 0xffffff.
   * @param topRight The tint being applied to the top-right of the Game Object.
   * @param bottomLeft The tint being applied to the bottom-left of the Game Object.
   * @param bottomRight The tint being applied to the bottom-right of the Game Object.
   */
  setTintFill(
    topLeft?: number,
    topRight?: number,
    bottomLeft?: number,
    bottomRight?: number
  ): this;

  /**
   * The tint value being applied to the whole of the Game Object.
   * This property is a setter-only. Use the properties `tintTopLeft` etc to read the current tint value.
   */
  tint: number;

  /**
   * Does this Game Object have a tint applied?
   *
   * It checks to see if the 4 tint properties are set to the value 0xffffff
   * and that the `tintFill` property is `false`. This indicates that a Game Object isn't tinted.
   */
  readonly isTinted: boolean;

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
}
