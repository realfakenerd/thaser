import { Game } from "@thaser/core";
import EventEmitter from "eventemitter3";

/**
 * WebGLRenderer is a class that contains the needed functionality to keep the
 * WebGLRenderingContext state clean. The main idea of the WebGLRenderer is to keep track of
 * any context change that happens for WebGL rendering inside of Phaser. This means
 * if raw webgl functions are called outside the WebGLRenderer of the Phaser WebGL
 * rendering ecosystem they might pollute the current WebGLRenderingContext state producing
 * unexpected behavior. It's recommended that WebGL interaction is done through
 * WebGLRenderer and/or WebGLPipeline.
 */
export default class WebGLRenderer extends EventEmitter {
  /**
   *
   * @param game The Game instance which owns this WebGL Renderer.
   */
  constructor(game: Game);

  /**
   * The local configuration settings of this WebGL Renderer.
   */
  config: object;

  /**
   * The Game instance which owns this WebGL Renderer.
   */
  game: Game;

  /**
   * A constant which allows the renderer to be easily identified as a WebGL Renderer.
   */
  type: number;

  /**
   * An instance of the Pipeline Manager class, that handles all WebGL Pipelines.
   *
   * Use this to manage all of your interactions with pipelines, such as adding, getting,
   * setting and rendering them.
   *
   * The Pipeline Manager class is created in the `init` method and then populated
   * with pipelines during the `boot` method.
   *
   * Prior to Phaser v3.50.0 this was just a plain JavaScript object, not a class.
   */
  pipelines: Phaser.Renderer.WebGL.PipelineManager;

  /**
   * The width of the canvas being rendered to.
   * This is populated in the onResize event handler.
   */
  width: number;

  /**
   * The height of the canvas being rendered to.
   * This is populated in the onResize event handler.
   */
  height: number;

  /**
   * The canvas which this WebGL Renderer draws to.
   */
  canvas: HTMLCanvasElement;

  /**
   * An array of blend modes supported by the WebGL Renderer.
   *
   * This array includes the default blend modes as well as any custom blend modes added through {@link #addBlendMode}.
   */
  blendModes: any[];

  /**
   * This property is set to `true` if the WebGL context of the renderer is lost.
   */
  contextLost: boolean;

  /**
   * Details about the currently scheduled snapshot.
   *
   * If a non-null `callback` is set in this object, a snapshot of the canvas will be taken after the current frame is fully rendered.
   */
  snapshotState: Phaser.Types.Renderer.Snapshot.SnapshotState;

  /**
   * Cached value for the last texture unit that was used.
   */
  currentActiveTexture: number;

  /**
   * Contains the current starting active texture unit.
   * This value is constantly updated and should be treated as read-only by your code.
   */
  startActiveTexture: number;

  /**
   * The maximum number of textures the GPU can handle. The minimum under the WebGL1 spec is 8.
   * This is set via the Game Config `maxTextures` property and should never be changed after boot.
   */
  maxTextures: number;

  /**
   * An array of the available WebGL texture units, used to populate the uSampler uniforms.
   *
   * This array is populated during the init phase and should never be changed after boot.
   */
  textureIndexes: any[];

  /**
   * An array of default temporary WebGL Textures.
   *
   * This array is populated during the init phase and should never be changed after boot.
   */
  tempTextures: any[];

  /**
   * The currently bound texture at texture unit zero, if any.
   */
  textureZero: WebGLTexture | null;

  /**
   * The currently bound normal map texture at texture unit one, if any.
   */
  normalTexture: WebGLTexture | null;

  /**
   * The currently bound framebuffer in use.
   */
  currentFramebuffer: WebGLFramebuffer;

  /**
   * A stack into which the frame buffer objects are pushed and popped.
   */
  fboStack: WebGLFramebuffer[];

  /**
   * Current WebGLProgram in use.
   */
  currentProgram: WebGLProgram;

  /**
   * Current blend mode in use
   */
  currentBlendMode: number;

  /**
   * Indicates if the the scissor state is enabled in WebGLRenderingContext
   */
  currentScissorEnabled: boolean;

  /**
   * Stores the current scissor data
   */
  currentScissor: Uint32Array;

  /**
   * Stack of scissor data
   */
  scissorStack: Uint32Array;

  /**
   * The handler to invoke when the context is lost.
   * This should not be changed and is set in the boot method.
   */
  contextLostHandler: Function;

  /**
   * The handler to invoke when the context is restored.
   * This should not be changed and is set in the boot method.
   */
  contextRestoredHandler: Function;

  /**
   * The underlying WebGL context of the renderer.
   */
  gl: WebGLRenderingContext;

  /**
   * Array of strings that indicate which WebGL extensions are supported by the browser.
   * This is populated in the `boot` method.
   */
  supportedExtensions: string[];

  /**
   * If the browser supports the `ANGLE_instanced_arrays` extension, this property will hold
   * a reference to the glExtension for it.
   */
  instancedArraysExtension: ANGLE_instanced_arrays;

  /**
   * If the browser supports the `OES_vertex_array_object` extension, this property will hold
   * a reference to the glExtension for it.
   */
  vaoExtension: OES_vertex_array_object;

  /**
   * The WebGL Extensions loaded into the current context.
   */
  extensions: object;

  /**
   * Stores the current WebGL component formats for further use.
   */
  glFormats: any[];

  /**
   * Stores the WebGL texture compression formats that this device and browser supports.
   *
   * Support for using compressed texture formats was added in Phaser version 3.60.
   */
  compression: Phaser.Types.Renderer.WebGL.WebGLTextureCompression;

  /**
   * Cached drawing buffer height to reduce gl calls.
   */
  readonly drawingBufferHeight: number;

  /**
   * A blank 32x32 transparent texture, as used by the Graphics system where needed.
   * This is set in the `boot` method.
   */
  readonly blankTexture: WebGLTexture;

  /**
   * A pure white 4x4 texture, as used by the Graphics system where needed.
   * This is set in the `boot` method.
   */
  readonly whiteTexture: WebGLTexture;

  /**
   * The total number of masks currently stacked.
   */
  maskCount: number;

  /**
   * The mask stack.
   */
  maskStack: Phaser.Display.Masks.GeometryMask[];

  /**
   * Internal property that tracks the currently set mask.
   */
  currentMask: any;

  /**
   * Internal property that tracks the currently set camera mask.
   */
  currentCameraMask: any;

  /**
   * Internal gl function mapping for uniform look-up.
   * https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/uniform
   */
  glFuncMap: any;

  /**
   * The `type` of the Game Object being currently rendered.
   * This can be used by advanced render functions for batching look-ahead.
   */
  currentType: string;

  /**
   * Is the `type` of the Game Object being currently rendered different than the
   * type of the object before it in the display list? I.e. it's a 'new' type.
   */
  newType: boolean;

  /**
   * Does the `type` of the next Game Object in the display list match that
   * of the object being currently rendered?
   */
  nextTypeMatch: boolean;

  /**
   * Is the Game Object being currently rendered the final one in the list?
   */
  finalType: boolean;

  /**
   * The mipmap magFilter to be used when creating textures.
   *
   * You can specify this as a string in the game config, i.e.:
   *
   * `render: { mipmapFilter: 'NEAREST_MIPMAP_LINEAR' }`
   *
   * The 6 options for WebGL1 are, in order from least to most computationally expensive:
   *
   * NEAREST (for pixel art)
   * LINEAR (the default)
   * NEAREST_MIPMAP_NEAREST
   * LINEAR_MIPMAP_NEAREST
   * NEAREST_MIPMAP_LINEAR
   * LINEAR_MIPMAP_LINEAR
   *
   * Mipmaps only work with textures that are fully power-of-two in size.
   *
   * For more details see https://webglfundamentals.org/webgl/lessons/webgl-3d-textures.html
   */
  mipmapFilter: GLenum;

  /**
   * The number of times the renderer had to flush this frame, due to running out of texture units.
   */
  textureFlush: number;

  /**
   * Are the WebGL Textures in their default state?
   *
   * Used to avoid constant gl binds.
   */
  isTextureClean: boolean;

  /**
   * Has this renderer fully booted yet?
   */
  isBooted: boolean;

  /**
   * A Render Target you can use to capture the current state of the Renderer.
   *
   * A Render Target encapsulates a framebuffer and texture for the WebGL Renderer.
   */
  renderTarget: Phaser.Renderer.WebGL.RenderTarget;

  /**
   * The global game Projection matrix, used by shaders as 'uProjectionMatrix' uniform.
   */
  projectionMatrix: Phaser.Math.Matrix4;

  /**
   * The cached width of the Projection matrix.
   */
  projectionWidth: number;

  /**
   * The cached height of the Projection matrix.
   */
  projectionHeight: number;

  /**
   * Creates a new WebGLRenderingContext and initializes all internal state.
   * @param config The configuration object for the renderer.
   */
  init(config: object): this;

  /**
   * The event handler that manages the `resize` event dispatched by the Scale Manager.
   * @param gameSize The default Game Size object. This is the un-modified game dimensions.
   * @param baseSize The base Size object. The game dimensions. The canvas width / height values match this.
   */
  onResize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size): void;

  /**
   * Binds the WebGL Renderers Render Target, so all drawn content is now redirected to it.
   *
   * Make sure to call `endCapture` when you are finished.
   * @param width Optional new width of the Render Target.
   * @param height Optional new height of the Render Target.
   */
  beginCapture(width?: number, height?: number): void;

  /**
   * Unbinds the WebGL Renderers Render Target and returns it, stopping any further content being drawn to it.
   *
   * If the viewport or scissors were modified during the capture, you should reset them by calling
   * `resetViewport` and `resetScissor` accordingly.
   */
  endCapture(): Phaser.Renderer.WebGL.RenderTarget;

  /**
   * Resizes the drawing buffer to match that required by the Scale Manager.
   * @param width The new width of the renderer.
   * @param height The new height of the renderer.
   */
  resize(width?: number, height?: number): this;

  /**
   * Determines which compressed texture formats this browser and device supports.
   *
   * Called automatically as part of the WebGL Renderer init process. If you need to investigate
   * which formats it supports, see the `Phaser.Renderer.WebGL.WebGLRenderer#compression` property instead.
   */
  getCompressedTextures(): Phaser.Types.Renderer.WebGL.WebGLTextureCompression;

  /**
   * Returns a compressed texture format GLenum name based on the given format.
   * @param baseFormat The Base Format to check.
   * @param format An optional GLenum format to check within the base format.
   */
  getCompressedTextureName(baseFormat: string, format?: GLenum): string;

  /**
   * Checks if the given compressed texture format is supported, or not.
   * @param baseFormat The Base Format to check.
   * @param format An optional GLenum format to check within the base format.
   */
  supportsCompressedTexture(baseFormat: string, format?: GLenum): boolean;

  /**
   * Gets the aspect ratio of the WebGLRenderer dimensions.
   */
  getAspectRatio(): number;

  /**
   * Sets the Projection Matrix of this renderer to the given dimensions.
   * @param width The new width of the Projection Matrix.
   * @param height The new height of the Projection Matrix.
   */
  setProjectionMatrix(width: number, height: number): this;

  /**
   * Resets the Projection Matrix back to this renderers width and height.
   *
   * This is called during `endCapture`, should the matrix have been changed
   * as a result of the capture process.
   */
  resetProjectionMatrix(): void;

  /**
   * Checks if a WebGL extension is supported
   * @param extensionName Name of the WebGL extension
   */
  hasExtension(extensionName: string): boolean;

  /**
   * Loads a WebGL extension
   * @param extensionName The name of the extension to load.
   */
  getExtension(extensionName: string): object;

  /**
   * Flushes the current pipeline if the pipeline is bound
   */
  flush(): void;

  /**
   * Pushes a new scissor state. This is used to set nested scissor states.
   * @param x The x position of the scissor.
   * @param y The y position of the scissor.
   * @param width The width of the scissor.
   * @param height The height of the scissor.
   * @param drawingBufferHeight Optional drawingBufferHeight override value.
   */
  pushScissor(
    x: number,
    y: number,
    width: number,
    height: number,
    drawingBufferHeight?: number
  ): number[];

  /**
   * Sets the current scissor state.
   * @param x The x position of the scissor.
   * @param y The y position of the scissor.
   * @param width The width of the scissor.
   * @param height The height of the scissor.
   * @param drawingBufferHeight Optional drawingBufferHeight override value.
   */
  setScissor(
    x: number,
    y: number,
    width: number,
    height: number,
    drawingBufferHeight?: number
  ): void;

  /**
   * Resets the gl scissor state to be whatever the current scissor is, if there is one, without
   * modifying the scissor stack.
   */
  resetScissor(): void;

  /**
   * Pops the last scissor state and sets it.
   */
  popScissor(): void;

  /**
   * Is there an active stencil mask?
   */
  hasActiveStencilMask(): boolean;

  /**
   * Resets the gl viewport to the current renderer dimensions.
   */
  resetViewport(): void;

  /**
   * Sets the blend mode to the value given.
   *
   * If the current blend mode is different from the one given, the pipeline is flushed and the new
   * blend mode is enabled.
   * @param blendModeId The blend mode to be set. Can be a `BlendModes` const or an integer value.
   * @param force Force the blend mode to be set, regardless of the currently set blend mode. Default false.
   */
  setBlendMode(blendModeId: number, force?: boolean): boolean;

  /**
   * Creates a new custom blend mode for the renderer.
   *
   * See https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants#Blending_modes
   * @param func An array containing the WebGL functions to use for the source and the destination blending factors, respectively. See the possible constants for {@link WebGLRenderingContext#blendFunc()}.
   * @param equation The equation to use for combining the RGB and alpha components of a new pixel with a rendered one. See the possible constants for {@link WebGLRenderingContext#blendEquation()}.
   */
  addBlendMode(func: GLenum[], equation: GLenum): number;

  /**
   * Updates the function bound to a given custom blend mode.
   * @param index The index of the custom blend mode.
   * @param func The function to use for the blend mode.
   * @param equation The equation to use for the blend mode.
   */
  updateBlendMode(index: number, func: Function, equation: Function): this;

  /**
   * Removes a custom blend mode from the renderer.
   * Any Game Objects still using this blend mode will error, so be sure to clear them first.
   * @param index The index of the custom blend mode to be removed.
   */
  removeBlendMode(index: number): this;

  /**
   * Activates the Texture Source and assigns it the next available texture unit.
   * If none are available, it will flush the current pipeline first.
   * @param textureSource The Texture Source to be assigned the texture unit.
   */
  setTextureSource(textureSource: Phaser.Textures.TextureSource): number;

  /**
   * Checks to see if the given diffuse and normal map textures are already bound, or not.
   * @param texture The WebGL diffuse texture.
   * @param normalMap The WebGL normal map texture.
   */
  isNewNormalMap(texture: WebGLTexture, normalMap: WebGLTexture): boolean;

  /**
   * Binds a texture directly to texture unit zero then activates it.
   * If the texture is already at unit zero, it skips the bind.
   * Make sure to call `clearTextureZero` after using this method.
   * @param texture The WebGL texture that needs to be bound.
   * @param flush Flush the pipeline if the texture is different? Default false.
   */
  setTextureZero(texture: WebGLTexture, flush?: boolean): void;

  /**
   * Clears the texture that was directly bound to texture unit zero.
   */
  clearTextureZero(): void;

  /**
   * Binds a texture directly to texture unit one then activates it.
   * If the texture is already at unit one, it skips the bind.
   * Make sure to call `clearNormalMap` after using this method.
   * @param texture The WebGL texture that needs to be bound.
   */
  setNormalMap(texture: WebGLTexture): void;

  /**
   * Clears the texture that was directly bound to texture unit one and
   * increases the start active texture counter.
   */
  clearNormalMap(): void;

  /**
   * Activates each texture, in turn, then binds them all to `null`.
   * @param all Reset all textures, or just the first two? Default false.
   */
  unbindTextures(all?: boolean): void;

  /**
   * Flushes the current pipeline, then resets the first two textures
   * back to the default temporary textures, resets the start active
   * counter and sets texture unit 1 as being active.
   * @param all Reset all textures, or just the first two? Default false.
   */
  resetTextures(all?: boolean): void;

  /**
   * Binds a texture at a texture unit. If a texture is already
   * bound to that unit it will force a flush on the current pipeline.
   * @param texture The WebGL texture that needs to be bound.
   */
  setTexture2D(texture: WebGLTexture): number;

  /**
   * Pushes a new framebuffer onto the FBO stack and makes it the currently bound framebuffer.
   *
   * If there was another framebuffer already bound it will force a pipeline flush.
   *
   * Call `popFramebuffer` to remove it again.
   * @param framebuffer The framebuffer that needs to be bound.
   * @param updateScissor Set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack. Default false.
   * @param resetTextures Should the WebGL Textures be reset after the new framebuffer is bound? Default false.
   * @param setViewport Should the WebGL viewport be set? Default true.
   */
  pushFramebuffer(
    framebuffer: WebGLFramebuffer,
    updateScissor?: boolean,
    resetTextures?: boolean,
    setViewport?: boolean
  ): this;

  /**
   * Sets the given framebuffer as the active and currently bound framebuffer.
   *
   * If there was another framebuffer already bound it will force a pipeline flush.
   *
   * Typically, you should call `pushFramebuffer` instead of this method.
   * @param framebuffer The framebuffer that needs to be bound.
   * @param updateScissor If a framebuffer is given, set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack. Default false.
   * @param resetTextures Should the WebGL Textures be reset after the new framebuffer is bound? Default false.
   * @param setViewport Should the WebGL viewport be set? Default true.
   */
  setFramebuffer(
    framebuffer: WebGLFramebuffer,
    updateScissor?: boolean,
    resetTextures?: boolean,
    setViewport?: boolean
  ): this;

  /**
   * Pops the previous framebuffer from the fbo stack and sets it.
   * @param updateScissor If a framebuffer is given, set the gl scissor to match the frame buffer size? Or, if `null` given, pop the scissor from the stack. Default false.
   * @param resetTextures Should the WebGL Textures be reset after the new framebuffer is bound? Default false.
   * @param setViewport Should the WebGL viewport be set? Default true.
   */
  popFramebuffer(
    updateScissor?: boolean,
    resetTextures?: boolean,
    setViewport?: boolean
  ): WebGLFramebuffer;

  /**
   * Binds a shader program.
   *
   * If there was a different program already bound it will force a pipeline flush first.
   *
   * If the same program given to this method is already set as the current program, no change
   * will take place and this method will return `false`.
   * @param program The program that needs to be bound.
   */
  setProgram(program: WebGLProgram): boolean;

  /**
   * Rebinds whatever program `WebGLRenderer.currentProgram` is set as, without
   * changing anything, or flushing.
   */
  resetProgram(): this;

  /**
   * Creates a texture from an image source. If the source is not valid it creates an empty texture.
   * @param source The source of the texture.
   * @param width The width of the texture.
   * @param height The height of the texture.
   * @param scaleMode The scale mode to be used by the texture.
   * @param forceClamp Force the texture to use the CLAMP_TO_EDGE wrap mode, even if a power of two? Default false.
   */
  createTextureFromSource(
    source: object,
    width: number,
    height: number,
    scaleMode: number,
    forceClamp?: boolean
  ): WebGLTexture | null;

  /**
   * A wrapper for creating a WebGLTexture. If no pixel data is passed it will create an empty texture.
   * @param mipLevel Mip level of the texture.
   * @param minFilter Filtering of the texture.
   * @param magFilter Filtering of the texture.
   * @param wrapT Wrapping mode of the texture.
   * @param wrapS Wrapping mode of the texture.
   * @param format Which format does the texture use.
   * @param pixels pixel data.
   * @param width Width of the texture in pixels.
   * @param height Height of the texture in pixels.
   * @param pma Does the texture have premultiplied alpha? Default true.
   * @param forceSize If `true` it will use the width and height passed to this method, regardless of the pixels dimension. Default false.
   * @param flipY Sets the `UNPACK_FLIP_Y_WEBGL` flag the WebGL Texture uses during upload. Default false.
   */
  createTexture2D(
    mipLevel: number,
    minFilter: number,
    magFilter: number,
    wrapT: number,
    wrapS: number,
    format: number,
    pixels: object | undefined,
    width: number,
    height: number,
    pma?: boolean,
    forceSize?: boolean,
    flipY?: boolean
  ): WebGLTexture;

  /**
   * Creates a WebGL Framebuffer object and optionally binds a depth stencil render buffer.
   * @param width If `addDepthStencilBuffer` is true, this controls the width of the depth stencil.
   * @param height If `addDepthStencilBuffer` is true, this controls the height of the depth stencil.
   * @param renderTexture The color texture where the color pixels are written.
   * @param addDepthStencilBuffer Create a Renderbuffer for the depth stencil? Default false.
   */
  createFramebuffer(
    width: number,
    height: number,
    renderTexture: WebGLTexture,
    addDepthStencilBuffer?: boolean
  ): WebGLFramebuffer;

  /**
   * Creates a WebGLProgram instance based on the given vertex and fragment shader source.
   *
   * Then compiles, attaches and links the program before returning it.
   * @param vertexShader The vertex shader source code as a single string.
   * @param fragmentShader The fragment shader source code as a single string.
   */
  createProgram(vertexShader: string, fragmentShader: string): WebGLProgram;

  /**
   * Wrapper for creating a vertex buffer.
   * @param initialDataOrSize It's either ArrayBuffer or an integer indicating the size of the vbo
   * @param bufferUsage How the buffer is used. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW
   */
  createVertexBuffer(
    initialDataOrSize: ArrayBuffer,
    bufferUsage: number
  ): WebGLBuffer;

  /**
   * Wrapper for creating a vertex buffer.
   * @param initialDataOrSize Either ArrayBuffer or an integer indicating the size of the vbo.
   * @param bufferUsage How the buffer is used. gl.DYNAMIC_DRAW, gl.STATIC_DRAW or gl.STREAM_DRAW.
   */
  createIndexBuffer(
    initialDataOrSize: ArrayBuffer,
    bufferUsage: number
  ): WebGLBuffer;

  /**
   * Calls `GL.deleteTexture` on the given WebGLTexture and also optionally
   * resets the currently defined textures.
   * @param texture The WebGL Texture to be deleted.
   * @param reset Call the `resetTextures` method after deleting this texture? Default false.
   */
  deleteTexture(texture: WebGLTexture, reset?: boolean): this;

  /**
   * Deletes a WebGLFramebuffer from the GL instance.
   * @param framebuffer The Framebuffer to be deleted.
   */
  deleteFramebuffer(framebuffer: WebGLFramebuffer): this;

  /**
   * Deletes a WebGLProgram from the GL instance.
   * @param program The shader program to be deleted.
   */
  deleteProgram(program: WebGLProgram): this;

  /**
   * Deletes a WebGLBuffer from the GL instance.
   * @param vertexBuffer The WebGLBuffer to be deleted.
   */
  deleteBuffer(vertexBuffer: WebGLBuffer): this;

  /**
   * Controls the pre-render operations for the given camera.
   * Handles any clipping needed by the camera and renders the background color if a color is visible.
   * @param camera The Camera to pre-render.
   */
  preRenderCamera(camera: Phaser.Cameras.Scene2D.Camera): void;

  /**
   * Controls the post-render operations for the given camera.
   *
   * Renders the foreground camera effects like flash and fading, then resets the current scissor state.
   * @param camera The Camera to post-render.
   */
  postRenderCamera(camera: Phaser.Cameras.Scene2D.Camera): void;

  /**
   * Clears the current vertex buffer and updates pipelines.
   */
  preRender(): void;

  /**
   * The core render step for a Scene Camera.
   *
   * Iterates through the given array of Game Objects and renders them with the given Camera.
   *
   * This is called by the `CameraManager.render` method. The Camera Manager instance belongs to a Scene, and is invoked
   * by the Scene Systems.render method.
   *
   * This method is not called if `Camera.visible` is `false`, or `Camera.alpha` is zero.
   * @param scene The Scene to render.
   * @param children An array of filtered Game Objects that can be rendered by the given Camera.
   * @param camera The Scene Camera to render with.
   */
  render(
    scene: Phaser.Scene,
    children: Phaser.GameObjects.GameObject[],
    camera: Phaser.Cameras.Scene2D.Camera
  ): void;

  /**
   * The post-render step happens after all Cameras in all Scenes have been rendered.
   */
  postRender(): void;

  /**
   * Schedules a snapshot of the entire game viewport to be taken after the current frame is rendered.
   *
   * To capture a specific area see the `snapshotArea` method. To capture a specific pixel, see `snapshotPixel`.
   *
   * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
   * calling this method will override it.
   *
   * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
   * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
   * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
   * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
   * @param callback The Function to invoke after the snapshot image is created.
   * @param type The format of the image to create, usually `image/png` or `image/jpeg`. Default 'image/png'.
   * @param encoderOptions The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`. Default 0.92.
   */
  snapshot(
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback,
    type?: string,
    encoderOptions?: number
  ): this;

  /**
   * Schedules a snapshot of the given area of the game viewport to be taken after the current frame is rendered.
   *
   * To capture the whole game viewport see the `snapshot` method. To capture a specific pixel, see `snapshotPixel`.
   *
   * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
   * calling this method will override it.
   *
   * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
   * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
   * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
   * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
   * @param x The x coordinate to grab from.
   * @param y The y coordinate to grab from.
   * @param width The width of the area to grab.
   * @param height The height of the area to grab.
   * @param callback The Function to invoke after the snapshot image is created.
   * @param type The format of the image to create, usually `image/png` or `image/jpeg`. Default 'image/png'.
   * @param encoderOptions The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`. Default 0.92.
   */
  snapshotArea(
    x: number,
    y: number,
    width: number,
    height: number,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback,
    type?: string,
    encoderOptions?: number
  ): this;

  /**
   * Schedules a snapshot of the given pixel from the game viewport to be taken after the current frame is rendered.
   *
   * To capture the whole game viewport see the `snapshot` method. To capture a specific area, see `snapshotArea`.
   *
   * Only one snapshot can be active _per frame_. If you have already called `snapshotArea`, for example, then
   * calling this method will override it.
   *
   * Unlike the other two snapshot methods, this one will return a `Color` object containing the color data for
   * the requested pixel. It doesn't need to create an internal Canvas or Image object, so is a lot faster to execute,
   * using less memory.
   * @param x The x coordinate of the pixel to get.
   * @param y The y coordinate of the pixel to get.
   * @param callback The Function to invoke after the snapshot pixel data is extracted.
   */
  snapshotPixel(
    x: number,
    y: number,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback
  ): this;

  /**
   * Takes a snapshot of the given area of the given frame buffer.
   *
   * Unlike the other snapshot methods, this one is processed immediately and doesn't wait for the next render.
   *
   * Snapshots work by using the WebGL `readPixels` feature to grab every pixel from the frame buffer into an ArrayBufferView.
   * It then parses this, copying the contents to a temporary Canvas and finally creating an Image object from it,
   * which is the image returned to the callback provided. All in all, this is a computationally expensive and blocking process,
   * which gets more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
   * @param framebuffer The framebuffer to grab from.
   * @param bufferWidth The width of the framebuffer.
   * @param bufferHeight The height of the framebuffer.
   * @param callback The Function to invoke after the snapshot image is created.
   * @param getPixel Grab a single pixel as a Color object, or an area as an Image object? Default false.
   * @param x The x coordinate to grab from. Default 0.
   * @param y The y coordinate to grab from. Default 0.
   * @param width The width of the area to grab. Default bufferWidth.
   * @param height The height of the area to grab. Default bufferHeight.
   * @param type The format of the image to create, usually `image/png` or `image/jpeg`. Default 'image/png'.
   * @param encoderOptions The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`. Default 0.92.
   */
  snapshotFramebuffer(
    framebuffer: WebGLFramebuffer,
    bufferWidth: number,
    bufferHeight: number,
    callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback,
    getPixel?: boolean,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    type?: string,
    encoderOptions?: number
  ): this;

  /**
   * Creates a new WebGL Texture based on the given Canvas Element.
   *
   * If the `dstTexture` parameter is given, the WebGL Texture is updated, rather than created fresh.
   * @param srcCanvas The Canvas to create the WebGL Texture from
   * @param dstTexture The destination WebGL Texture to set.
   * @param noRepeat Should this canvas be allowed to set `REPEAT` (such as for Text objects?) Default false.
   * @param flipY Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`? Default false.
   */
  canvasToTexture(
    srcCanvas: HTMLCanvasElement,
    dstTexture?: WebGLTexture,
    noRepeat?: boolean,
    flipY?: boolean
  ): WebGLTexture;

  /**
   * Creates a new WebGL Texture based on the given Canvas Element.
   * @param srcCanvas The Canvas to create the WebGL Texture from
   * @param noRepeat Should this canvas be allowed to set `REPEAT` (such as for Text objects?) Default false.
   * @param flipY Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`? Default false.
   */
  createCanvasTexture(
    srcCanvas: HTMLCanvasElement,
    noRepeat?: boolean,
    flipY?: boolean
  ): WebGLTexture;

  /**
   * Updates a WebGL Texture based on the given Canvas Element.
   * @param srcCanvas The Canvas to update the WebGL Texture from.
   * @param dstTexture The destination WebGL Texture to update.
   * @param flipY Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`? Default false.
   */
  updateCanvasTexture(
    srcCanvas: HTMLCanvasElement,
    dstTexture: WebGLTexture,
    flipY?: boolean
  ): WebGLTexture;

  /**
   * Creates a new WebGL Texture based on the given HTML Video Element.
   * @param srcVideo The Video to create the WebGL Texture from
   * @param noRepeat Should this canvas be allowed to set `REPEAT`? Default false.
   * @param flipY Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`? Default false.
   */
  createVideoTexture(
    srcVideo: HTMLVideoElement,
    noRepeat?: boolean,
    flipY?: boolean
  ): WebGLTexture;

  /**
   * Updates a WebGL Texture based on the given HTML Video Element.
   * @param srcVideo The Video to update the WebGL Texture with.
   * @param dstTexture The destination WebGL Texture to update.
   * @param flipY Should the WebGL Texture set `UNPACK_MULTIPLY_FLIP_Y`? Default false.
   */
  updateVideoTexture(
    srcVideo: HTMLVideoElement,
    dstTexture: WebGLTexture,
    flipY?: boolean
  ): WebGLTexture;

  /**
   * Sets the minification and magnification filter for a texture.
   * @param texture The texture to set the filter for.
   * @param filter The filter to set. 0 for linear filtering, 1 for nearest neighbor (blocky) filtering.
   */
  setTextureFilter(texture: number, filter: number): this;

  /**
   * Returns the largest texture size (either width or height) that can be created.
   * Note that VRAM may not allow a texture of any given size, it just expresses
   * hardware / driver support for a given size.
   */
  getMaxTextureSize(): number;

  /**
   * Destroy this WebGLRenderer, cleaning up all related resources such as pipelines, native textures, etc.
   */
  destroy(): void;
}
