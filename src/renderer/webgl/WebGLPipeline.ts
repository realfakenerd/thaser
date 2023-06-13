import { Game } from '@thaser/core';
import { WebGLPipelineConfig } from '@thaser/types/renderer/webgl';
import { GetFastValue } from '@thaser/utils';
import { EventEmitter } from 'eventemitter3';
import WebGLRenderer from './WebGLRenderer';

/**
 * The `WebGLPipeline` is a base class used by all of the core Phaser pipelines.
 *
 * It describes the way elements will be rendered in WebGL. Internally, it handles
 * compiling the shaders, creating vertex buffers, assigning primitive topology and
 * binding vertex attributes, all based on the given configuration data.
 *
 * The pipeline is configured by passing in a `WebGLPipelineConfig` object. Please
 * see the documentation for this type to fully understand the configuration options
 * available to you.
 *
 * Usually, you would not extend from this class directly, but would instead extend
 * from one of the core pipelines, such as the Multi Pipeline.
 *
 * The pipeline flow per render-step is as follows:
 *
 * 1) onPreRender - called once at the start of the render step
 * 2) onRender - call for each Scene Camera that needs to render (so can be multiple times per render step)
 * 3) Internal flow:
 * 3a)   bind (only called if a Game Object is using this pipeline and it's not currently active)
 * 3b)   onBind (called for every Game Object that uses this pipeline)
 * 3c)   flush (can be called by a Game Object, internal method or from outside by changing pipeline)
 * 4) onPostRender - called once at the end of the render step
 */
export default class WebGLPipeline extends EventEmitter {
  /**
   *
   * @param config The configuration object for this WebGL Pipeline.
   */
  constructor(config: WebGLPipelineConfig) {
    super();

    const game = config.game;
    const renderer = game.renderer;
    const gl = renderer.gl;

    this.name = GetFastValue(config, 'name', 'WebGLPipeline');
    this.game = game;
  }

  /**
   * Name of the pipeline. Used for identification and setting from Game Objects.
   */
  name: string;

  /**
   * The Phaser Game instance to which this pipeline is bound.
   */
  game: Game;

  /**
   * The WebGL Renderer instance to which this pipeline is bound.
   */
  renderer: WebGLRenderer;

  /**
   * A reference to the WebGL Pipeline Manager.
   *
   * This is initially undefined and only set when this pipeline is added
   * to the manager.
   */
  manager: Phaser.Renderer.WebGL.PipelineManager | null;

  /**
   * The WebGL context this WebGL Pipeline uses.
   */
  gl: WebGLRenderingContext;

  /**
   * The canvas which this WebGL Pipeline renders to.
   */
  view: HTMLCanvasElement;

  /**
   * Width of the current viewport.
   */
  width: number;

  /**
   * Height of the current viewport.
   */
  height: number;

  /**
   * The current number of vertices that have been added to the pipeline batch.
   */
  vertexCount: number;

  /**
   * The total number of vertices that this pipeline batch can hold before it will flush.
   *
   * This defaults to `renderer batchSize * 6`, where `batchSize` is defined in the Renderer Game Config.
   */
  vertexCapacity: number;

  /**
   * Raw byte buffer of vertices.
   *
   * Either set via the config object `vertices` property, or generates a new Array Buffer of
   * size `vertexCapacity * vertexSize`.
   */
  readonly vertexData: ArrayBuffer;

  /**
   * The WebGLBuffer that holds the vertex data.
   *
   * Created from the `vertexData` ArrayBuffer. If `vertices` are set in the config, a `STATIC_DRAW` buffer
   * is created. If not, a `DYNAMIC_DRAW` buffer is created.
   */
  readonly vertexBuffer: WebGLBuffer;

  /**
   * The primitive topology which the pipeline will use to submit draw calls.
   *
   * Defaults to GL_TRIANGLES if not otherwise set in the config.
   */
  topology: GLenum;

  /**
   * Uint8 view to the `vertexData` ArrayBuffer. Used for uploading vertex buffer resources to the GPU.
   */
  bytes: Uint8Array;

  /**
   * Float32 view of the array buffer containing the pipeline's vertices.
   */
  vertexViewF32: Float32Array;

  /**
   * Uint32 view of the array buffer containing the pipeline's vertices.
   */
  vertexViewU32: Uint32Array;

  /**
   * Indicates if the current pipeline is active, or not.
   *
   * Toggle this property to enable or disable a pipeline from rendering anything.
   */
  active: boolean;

  /**
   * Holds the most recently assigned texture unit.
   *
   * Treat this value as read-only.
   */
  currentUnit: number;

  /**
   * Some pipelines require the forced use of texture zero (like the light pipeline).
   *
   * This property should be set when that is the case.
   */
  forceZero: boolean;

  /**
   * Indicates if this pipeline has booted or not.
   *
   * A pipeline boots only when the Game instance itself, and all associated systems, is
   * fully ready.
   */
  readonly hasBooted: boolean;

  /**
   * Indicates if this is a Post FX Pipeline, or not.
   */
  readonly isPostFX: boolean;

  /**
   * Indicates if this is a Sprite FX Pipeline, or not.
   */
  readonly isSpriteFX: boolean;

  /**
   * An array of RenderTarget instances that belong to this pipeline.
   */
  renderTargets: Phaser.Renderer.WebGL.RenderTarget[];

  /**
   * A reference to the currently bound Render Target instance from the `WebGLPipeline.renderTargets` array.
   */
  currentRenderTarget: Phaser.Renderer.WebGL.RenderTarget;

  /**
   * An array of all the WebGLShader instances that belong to this pipeline.
   *
   * Shaders manage their own attributes and uniforms, but share the same vertex data buffer,
   * which belongs to this pipeline.
   *
   * Shaders are set in a call to the `setShadersFromConfig` method, which happens automatically,
   * but can also be called at any point in your game. See the method documentation for details.
   */
  shaders: Phaser.Renderer.WebGL.WebGLShader[];

  /**
   * A reference to the currently bound WebGLShader instance from the `WebGLPipeline.shaders` array.
   *
   * For lots of pipelines, this is the only shader, so it is a quick way to reference it without
   * an array look-up.
   */
  currentShader: Phaser.Renderer.WebGL.WebGLShader;

  /**
   * The Projection matrix, used by shaders as 'uProjectionMatrix' uniform.
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
   * The configuration object that was used to create this pipeline.
   *
   * Treat this object as 'read only', because changing it post-creation will not
   * impact this pipeline in any way. However, it is used internally for cloning
   * and post-boot set-up.
   */
  config: Phaser.Types.Renderer.WebGL.WebGLPipelineConfig;

  /**
   * Has the GL Context been reset to the Phaser defaults since the last time
   * this pipeline was bound? This is set automatically when the Pipeline Manager
   * resets itself, usually after handing off to a 3rd party renderer like Spine.
   *
   * You should treat this property as read-only.
   */
  glReset: boolean;

  /**
   * Called when the Game has fully booted and the Renderer has finished setting up.
   *
   * By this stage all Game level systems are now in place. You can perform any final tasks that the
   * pipeline may need, that relies on game systems such as the Texture Manager being ready.
   */
  boot(): void;

  /**
   * This method is called once when this pipeline has finished being set-up
   * at the end of the boot process. By the time this method is called, all
   * of the shaders are ready and configured.
   */
  onBoot(): void;

  /**
   * This method is called once when this pipeline has finished being set-up
   * at the end of the boot process. By the time this method is called, all
   * of the shaders are ready and configured. It's also called if the renderer
   * changes size.
   * @param width The new width of this WebGL Pipeline.
   * @param height The new height of this WebGL Pipeline.
   */
  onResize(width: number, height: number): void;

  /**
   * Sets the currently active shader within this pipeline.
   * @param shader The shader to set as being current.
   * @param setAttributes Should the vertex attribute pointers be set? Default false.
   * @param vertexBuffer The vertex buffer to be set before the shader is bound. Defaults to the one owned by this pipeline.
   */
  setShader(
    shader: Phaser.Renderer.WebGL.WebGLShader,
    setAttributes?: boolean,
    vertexBuffer?: WebGLBuffer
  ): this;

  /**
   * Searches all shaders in this pipeline for one matching the given name, then returns it.
   * @param name The index of the shader to set.
   */
  getShaderByName(name: string): Phaser.Renderer.WebGL.WebGLShader;

  /**
   * Destroys all shaders currently set in the `WebGLPipeline.shaders` array and then parses the given
   * `config` object, extracting the shaders from it, creating `WebGLShader` instances and finally
   * setting them into the `shaders` array of this pipeline.
   *
   * This is a destructive process. Be very careful when you call it, should you need to.
   * @param config The configuration object for this WebGL Pipeline.
   */
  setShadersFromConfig(
    config: Phaser.Types.Renderer.WebGL.WebGLPipelineConfig
  ): this;

  /**
   * Custom pipelines can use this method in order to perform any required pre-batch tasks
   * for the given Game Object. It must return the texture unit the Game Object was assigned.
   * @param gameObject The Game Object being rendered or added to the batch.
   * @param frame Optional frame to use. Can override that of the Game Object.
   */
  setGameObject(
    gameObject: Phaser.GameObjects.GameObject,
    frame?: Phaser.Textures.Frame
  ): number;

  /**
   * Check if the current batch of vertices is full.
   *
   * You can optionally provide an `amount` parameter. If given, it will check if the batch
   * needs to flush _if_ the `amount` is added to it. This allows you to test if you should
   * flush before populating the batch.
   * @param amount Will the batch need to flush if this many vertices are added to it? Default 0.
   */
  shouldFlush(amount?: number): boolean;

  /**
   * Resizes the properties used to describe the viewport.
   *
   * This method is called automatically by the renderer during its resize handler.
   * @param width The new width of this WebGL Pipeline.
   * @param height The new height of this WebGL Pipeline.
   */
  resize(width: number, height: number): this;

  /**
   * Adjusts this pipelines ortho Projection Matrix to use the given dimensions
   * and resets the `uProjectionMatrix` uniform on all bound shaders.
   *
   * This method is called automatically by the renderer during its resize handler.
   * @param width The new width of this WebGL Pipeline.
   * @param height The new height of this WebGL Pipeline.
   */
  setProjectionMatrix(width: number, height: number): this;

  /**
   * Adjusts this pipelines ortho Projection Matrix to flip the y
   * and bottom values. Call with 'false' as the parameter to flip
   * them back again.
   * @param flipY Flip the y and bottom values? Default true.
   */
  flipProjectionMatrix(flipY?: boolean): void;

  /**
   * Adjusts this pipelines ortho Projection Matrix to match that of the global
   * WebGL Renderer Projection Matrix.
   *
   * This method is called automatically by the Pipeline Manager when this
   * pipeline is set.
   */
  updateProjectionMatrix(): void;

  /**
   * This method is called every time the Pipeline Manager makes this pipeline the currently active one.
   *
   * It binds the resources and shader needed for this pipeline, including setting the vertex buffer
   * and attribute pointers.
   * @param currentShader The shader to set as being current.
   */
  bind(currentShader?: Phaser.Renderer.WebGL.WebGLShader): this;

  /**
   * This method is called every time the Pipeline Manager rebinds this pipeline.
   *
   * It resets all shaders this pipeline uses, setting their attributes again.
   * @param currentShader The shader to set as being current.
   */
  rebind(currentShader?: Phaser.Renderer.WebGL.WebGLShader): this;

  /**
   * Binds the vertex buffer to be the active ARRAY_BUFFER on the WebGL context.
   *
   * It first checks to see if it's already set as the active buffer and only
   * binds itself if not.
   * @param buffer The Vertex Buffer to be bound. Defaults to the one owned by this pipeline.
   */
  setVertexBuffer(buffer?: WebGLBuffer): boolean;

  /**
   * This method is called as a result of the `WebGLPipeline.batchQuad` method, right before a quad
   * belonging to a Game Object is about to be added to the batch. When this is called, the
   * renderer has just performed a flush. It will bind the current render target, if any are set
   * and finally call the `onPreBatch` hook.
   * @param gameObject The Game Object or Camera that invoked this pipeline, if any.
   */
  preBatch(
    gameObject?: Phaser.GameObjects.GameObject | Phaser.Cameras.Scene2D.Camera
  ): this;

  /**
   * This method is called as a result of the `WebGLPipeline.batchQuad` method, right after a quad
   * belonging to a Game Object has been added to the batch. When this is called, the
   * renderer has just performed a flush.
   *
   * It calls the `onDraw` hook followed by the `onPostBatch` hook, which can be used to perform
   * additional Post FX Pipeline processing.
   * @param gameObject The Game Object or Camera that invoked this pipeline, if any.
   */
  postBatch(
    gameObject?: Phaser.GameObjects.GameObject | Phaser.Cameras.Scene2D.Camera
  ): this;

  /**
   * This method is only used by Sprite FX and Post FX Pipelines and those that extend from them.
   *
   * This method is called every time the `postBatch` method is called and is passed a
   * reference to the current render target.
   *
   * At the very least a Post FX Pipeline should call `this.bindAndDraw(renderTarget)`,
   * however, you can do as much additional processing as you like in this method if
   * you override it from within your own pipelines.
   * @param renderTarget The Render Target.
   * @param swapTarget A Swap Render Target, useful for double-buffer effects. Only set by SpriteFX Pipelines.
   */
  onDraw(
    renderTarget: Phaser.Renderer.WebGL.RenderTarget,
    swapTarget?: Phaser.Renderer.WebGL.RenderTarget
  ): void;

  /**
   * This method is called every time the Pipeline Manager deactivates this pipeline, swapping from
   * it to another one. This happens after a call to `flush` and before the new pipeline is bound.
   */
  unbind(): void;

  /**
   * Uploads the vertex data and emits a draw call for the current batch of vertices.
   * @param isPostFlush Was this flush invoked as part of a post-process, or not? Default false.
   */
  flush(isPostFlush?: boolean): this;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called every time the Pipeline Manager makes this the active pipeline. It is called
   * at the end of the `WebGLPipeline.bind` method, after the current shader has been set. The current
   * shader is passed to this hook.
   *
   * For example, if a display list has 3 Sprites in it that all use the same pipeline, this hook will
   * only be called for the first one, as the 2nd and 3rd Sprites do not cause the pipeline to be changed.
   *
   * If you need to listen for that event instead, use the `onBind` hook.
   * @param currentShader The shader that was set as current.
   */
  onActive(currentShader: Phaser.Renderer.WebGL.WebGLShader): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called every time a **Game Object** asks the Pipeline Manager to use this pipeline,
   * even if the pipeline is already active.
   *
   * Unlike the `onActive` method, which is only called when the Pipeline Manager makes this pipeline
   * active, this hook is called for every Game Object that requests use of this pipeline, allowing you to
   * perform per-object set-up, such as loading shader uniform data.
   * @param gameObject The Game Object that invoked this pipeline, if any.
   */
  onBind(gameObject?: Phaser.GameObjects.GameObject): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called when the Pipeline Manager needs to rebind this pipeline. This happens after a
   * pipeline has been cleared, usually when passing control over to a 3rd party WebGL library, like Spine,
   * and then returing to Phaser again.
   */
  onRebind(): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called every time the `batchQuad` or `batchTri` methods are called. If this was
   * as a result of a Game Object, then the Game Object reference is passed to this hook too.
   *
   * This hook is called _after_ the quad (or tri) has been added to the batch, so you can safely
   * call 'flush' from within this.
   *
   * Note that Game Objects may call `batchQuad` or `batchTri` multiple times for a single draw,
   * for example the Graphics Game Object.
   * @param gameObject The Game Object that invoked this pipeline, if any.
   */
  onBatch(gameObject?: Phaser.GameObjects.GameObject): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called immediately before a **Game Object** is about to add itself to the batch.
   * @param gameObject The Game Object that invoked this pipeline, if any.
   */
  onPreBatch(gameObject?: Phaser.GameObjects.GameObject): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called immediately after a **Game Object** has been added to the batch.
   * @param gameObject The Game Object that invoked this pipeline, if any.
   */
  onPostBatch(gameObject?: Phaser.GameObjects.GameObject): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called once per frame, right before anything has been rendered, but after the canvas
   * has been cleared. If this pipeline has a render target, it will also have been cleared by this point.
   */
  onPreRender(): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called _once per frame_, by every Camera in a Scene that wants to render.
   *
   * It is called at the start of the rendering process, before anything has been drawn to the Camera.
   * @param scene The Scene being rendered.
   * @param camera The Scene Camera being rendered with.
   */
  onRender(scene: Phaser.Scene, camera: Phaser.Cameras.Scene2D.Camera): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called _once per frame_, after all rendering has happened and snapshots have been taken.
   *
   * It is called at the very end of the rendering process, once all Cameras, for all Scenes, have
   * been rendered.
   */
  onPostRender(): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called every time this pipeline is asked to flush its batch.
   *
   * It is called immediately before the `gl.bufferData` and `gl.drawArrays` calls are made, so you can
   * perform any final pre-render modifications. To apply changes post-render, see `onAfterFlush`.
   * @param isPostFlush Was this flush invoked as part of a post-process, or not? Default false.
   */
  onBeforeFlush(isPostFlush?: boolean): void;

  /**
   * By default this is an empty method hook that you can override and use in your own custom pipelines.
   *
   * This method is called immediately after this pipeline has finished flushing its batch.
   *
   * It is called after the `gl.drawArrays` call.
   *
   * You can perform additional post-render effects, but be careful not to call `flush`
   * on this pipeline from within this method, or you'll cause an infinite loop.
   *
   * To apply changes pre-render, see `onBeforeFlush`.
   * @param isPostFlush Was this flush invoked as part of a post-process, or not? Default false.
   */
  onAfterFlush(isPostFlush?: boolean): void;

  /**
   * Adds a single vertex to the current vertex buffer and increments the
   * `vertexCount` property by 1.
   *
   * This method is called directly by `batchTri` and `batchQuad`.
   *
   * It does not perform any batch limit checking itself, so if you need to call
   * this method directly, do so in the same way that `batchQuad` does, for example.
   * @param x The vertex x position.
   * @param y The vertex y position.
   * @param u UV u value.
   * @param v UV v value.
   * @param unit Texture unit to which the texture needs to be bound.
   * @param tintEffect The tint effect for the shader to use.
   * @param tint The tint color value.
   */
  batchVert(
    x: number,
    y: number,
    u: number,
    v: number,
    unit: number,
    tintEffect: number | boolean,
    tint: number
  ): void;

  /**
   * Adds the vertices data into the batch and flushes if full.
   *
   * Assumes 6 vertices in the following arrangement:
   *
   * ```
   * 0----3
   * |\  B|
   * | \  |
   * |  \ |
   * | A \|
   * |    \
   * 1----2
   * ```
   *
   * Where tx0/ty0 = 0, tx1/ty1 = 1, tx2/ty2 = 2 and tx3/ty3 = 3
   * @param gameObject The Game Object, if any, drawing this quad.
   * @param x0 The top-left x position.
   * @param y0 The top-left y position.
   * @param x1 The bottom-left x position.
   * @param y1 The bottom-left y position.
   * @param x2 The bottom-right x position.
   * @param y2 The bottom-right y position.
   * @param x3 The top-right x position.
   * @param y3 The top-right y position.
   * @param u0 UV u0 value.
   * @param v0 UV v0 value.
   * @param u1 UV u1 value.
   * @param v1 UV v1 value.
   * @param tintTL The top-left tint color value.
   * @param tintTR The top-right tint color value.
   * @param tintBL The bottom-left tint color value.
   * @param tintBR The bottom-right tint color value.
   * @param tintEffect The tint effect for the shader to use.
   * @param texture WebGLTexture that will be assigned to the current batch if a flush occurs.
   * @param unit Texture unit to which the texture needs to be bound. Default 0.
   */
  batchQuad(
    gameObject: Phaser.GameObjects.GameObject | null,
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number,
    tintTL: number,
    tintTR: number,
    tintBL: number,
    tintBR: number,
    tintEffect: number | boolean,
    texture?: WebGLTexture,
    unit?: number
  ): boolean;

  /**
   * Adds the vertices data into the batch and flushes if full.
   *
   * Assumes 3 vertices in the following arrangement:
   *
   * ```
   * 0
   * |\
   * | \
   * |  \
   * |   \
   * |    \
   * 1-----2
   * ```
   * @param gameObject The Game Object, if any, drawing this quad.
   * @param x1 The bottom-left x position.
   * @param y1 The bottom-left y position.
   * @param x2 The bottom-right x position.
   * @param y2 The bottom-right y position.
   * @param x3 The top-right x position.
   * @param y3 The top-right y position.
   * @param u0 UV u0 value.
   * @param v0 UV v0 value.
   * @param u1 UV u1 value.
   * @param v1 UV v1 value.
   * @param tintTL The top-left tint color value.
   * @param tintTR The top-right tint color value.
   * @param tintBL The bottom-left tint color value.
   * @param tintEffect The tint effect for the shader to use.
   * @param texture WebGLTexture that will be assigned to the current batch if a flush occurs.
   * @param unit Texture unit to which the texture needs to be bound. Default 0.
   */
  batchTri(
    gameObject: Phaser.GameObjects.GameObject | null,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
    u0: number,
    v0: number,
    u1: number,
    v1: number,
    tintTL: number,
    tintTR: number,
    tintBL: number,
    tintEffect: number | boolean,
    texture?: WebGLTexture,
    unit?: number
  ): boolean;

  /**
   * Pushes a filled rectangle into the vertex batch.
   *
   * The dimensions are run through `Math.floor` before the quad is generated.
   *
   * Rectangle has no transform values and isn't transformed into the local space.
   *
   * Used for directly batching untransformed rectangles, such as Camera background colors.
   * @param x Horizontal top left coordinate of the rectangle.
   * @param y Vertical top left coordinate of the rectangle.
   * @param width Width of the rectangle.
   * @param height Height of the rectangle.
   * @param color Color of the rectangle to draw.
   * @param alpha Alpha value of the rectangle to draw.
   * @param texture WebGLTexture that will be assigned to the current batch if a flush occurs.
   * @param flipUV Flip the vertical UV coordinates of the texture before rendering? Default true.
   */
  drawFillRect(
    x: number,
    y: number,
    width: number,
    height: number,
    color: number,
    alpha: number,
    texture?: WebGLTexture,
    flipUV?: boolean
  ): void;

  /**
   * Sets the texture to be bound to the next available texture unit and returns
   * the unit id.
   * @param texture WebGLTexture that will be assigned to the current batch. If not given uses `whiteTexture`.
   */
  setTexture2D(texture?: WebGLTexture): number;

  /**
   * Activates the given WebGL Texture and binds it to the requested texture slot.
   * @param target The WebGLTexture to activate and bind.
   * @param unit The WebGL texture ID to activate. Defaults to `gl.TEXTURE0`. Default 0.
   */
  bindTexture(target?: WebGLTexture, unit?: number): this;

  /**
   * Activates the given Render Target texture and binds it to the
   * requested WebGL texture slot.
   * @param target The Render Target to activate and bind.
   * @param unit The WebGL texture ID to activate. Defaults to `gl.TEXTURE0`. Default 0.
   */
  bindRenderTarget(
    target?: Phaser.Renderer.WebGL.RenderTarget,
    unit?: number
  ): this;

  /**
   * Sets the current duration into a 1f uniform value based on the given name.
   *
   * This can be used for mapping time uniform values, such as `iTime`.
   * @param name The name of the uniform to set.
   */
  setTime(name: string): this;

  /**
   * Sets a boolean uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param value The new value of the `boolean` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  setBoolean(
    name: string,
    value: boolean,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 1f uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x The new value of the `float` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set1f(
    name: string,
    x: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 2f uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x The new X component of the `vec2` uniform.
   * @param y The new Y component of the `vec2` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set2f(
    name: string,
    x: number,
    y: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 3f uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x The new X component of the `vec3` uniform.
   * @param y The new Y component of the `vec3` uniform.
   * @param z The new Z component of the `vec3` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set3f(
    name: string,
    x: number,
    y: number,
    z: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 4f uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x X component of the uniform
   * @param y Y component of the uniform
   * @param z Z component of the uniform
   * @param w W component of the uniform
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set4f(
    name: string,
    x: number,
    y: number,
    z: number,
    w: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 1fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set1fv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 2fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set2fv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 3fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set3fv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 4fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set4fv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 1iv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set1iv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 2iv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set2iv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 3iv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set3iv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 4iv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param arr The new value to be used for the uniform variable.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set4iv(
    name: string,
    arr: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 1i uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x The new value of the `int` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set1i(
    name: string,
    x: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 2i uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x The new X component of the `ivec2` uniform.
   * @param y The new Y component of the `ivec2` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set2i(
    name: string,
    x: number,
    y: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 3i uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x The new X component of the `ivec3` uniform.
   * @param y The new Y component of the `ivec3` uniform.
   * @param z The new Z component of the `ivec3` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set3i(
    name: string,
    x: number,
    y: number,
    z: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a 4i uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param x X component of the uniform.
   * @param y Y component of the uniform.
   * @param z Z component of the uniform.
   * @param w W component of the uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  set4i(
    name: string,
    x: number,
    y: number,
    z: number,
    w: number,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a matrix 2fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param transpose Whether to transpose the matrix. Should be `false`.
   * @param matrix The new values for the `mat2` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  setMatrix2fv(
    name: string,
    transpose: boolean,
    matrix: number[] | Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a matrix 3fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param transpose Whether to transpose the matrix. Should be `false`.
   * @param matrix The new values for the `mat3` uniform.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  setMatrix3fv(
    name: string,
    transpose: boolean,
    matrix: Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Sets a matrix 4fv uniform value based on the given name on the currently set shader.
   *
   * The current shader is bound, before the uniform is set, making it active within the
   * WebGLRenderer. This means you can safely call this method from a location such as
   * a Scene `create` or `update` method. However, when working within a Shader file
   * directly, use the `WebGLShader` method equivalent instead, to avoid the program
   * being set.
   * @param name The name of the uniform to set.
   * @param transpose Whether to transpose the matrix. Should be `false`.
   * @param matrix The matrix data. If using a Matrix4 this should be the `Matrix4.val` property.
   * @param shader The shader to set the value on. If not given, the `currentShader` is used.
   */
  setMatrix4fv(
    name: string,
    transpose: boolean,
    matrix: Float32Array,
    shader?: Phaser.Renderer.WebGL.WebGLShader
  ): this;

  /**
   * Destroys all shader instances, removes all object references and nulls all external references.
   */
  destroy(): this;
}
