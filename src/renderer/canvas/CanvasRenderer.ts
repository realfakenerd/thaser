import { Game } from "@thaser/core";
import EventEmitter from "eventemitter3";

/**
             * The Canvas Renderer is responsible for managing 2D canvas rendering contexts,
             * including the one used by the Games canvas. It tracks the internal state of a
             * given context and can renderer textured Game Objects to it, taking into
             * account alpha, blending, and scaling.
             */
export default class CanvasRenderer extends EventEmitter {
    /**
     * 
     * @param game The Phaser Game instance that owns this renderer.
     */
    constructor(game: Game) {}

    /**
     * The local configuration settings of the CanvasRenderer.
     */
    config: object;

    /**
     * The Phaser Game instance that owns this renderer.
     */
    game: Game;

    /**
     * A constant which allows the renderer to be easily identified as a Canvas Renderer.
     */
    type: number;

    /**
     * The total number of Game Objects which were rendered in a frame.
     */
    drawCount: number;

    /**
     * The width of the canvas being rendered to.
     */
    width: number;

    /**
     * The height of the canvas being rendered to.
     */
    height: number;

    /**
     * The canvas element which the Game uses.
     */
    gameCanvas: HTMLCanvasElement;

    /**
     * The canvas context used to render all Cameras in all Scenes during the game loop.
     */
    gameContext: CanvasRenderingContext2D;

    /**
     * The canvas context currently used by the CanvasRenderer for all rendering operations.
     */
    currentContext: CanvasRenderingContext2D;

    /**
     * Should the Canvas use Image Smoothing or not when drawing Sprites?
     */
    antialias: boolean;

    /**
     * The blend modes supported by the Canvas Renderer.
     * 
     * This object maps the {@link Phaser.BlendModes} to canvas compositing operations.
     */
    blendModes: any[];

    /**
     * Details about the currently scheduled snapshot.
     * 
     * If a non-null `callback` is set in this object, a snapshot of the canvas will be taken after the current frame is fully rendered.
     */
    snapshotState: Phaser.Types.Renderer.Snapshot.SnapshotState;

    /**
     * Has this renderer fully booted yet?
     */
    isBooted: boolean;

    /**
     * Prepares the game canvas for rendering.
     */
    init(): void;

    /**
     * The event handler that manages the `resize` event dispatched by the Scale Manager.
     * @param gameSize The default Game Size object. This is the un-modified game dimensions.
     * @param baseSize The base Size object. The game dimensions multiplied by the resolution. The canvas width / height values match this.
     */
    onResize(gameSize: Phaser.Structs.Size, baseSize: Phaser.Structs.Size): void;

    /**
     * Resize the main game canvas.
     * @param width The new width of the renderer.
     * @param height The new height of the renderer.
     */
    resize(width?: number, height?: number): void;

    /**
     * Resets the transformation matrix of the current context to the identity matrix, thus resetting any transformation.
     */
    resetTransform(): void;

    /**
     * Sets the blend mode (compositing operation) of the current context.
     * @param blendMode The new blend mode which should be used.
     */
    setBlendMode(blendMode: string): this;

    /**
     * Changes the Canvas Rendering Context that all draw operations are performed against.
     * @param ctx The new Canvas Rendering Context to draw everything to. Leave empty to reset to the Game Canvas.
     */
    setContext(ctx?: CanvasRenderingContext2D | undefined): this;

    /**
     * Sets the global alpha of the current context.
     * @param alpha The new alpha to use, where 0 is fully transparent and 1 is fully opaque.
     */
    setAlpha(alpha: number): this;

    /**
     * Called at the start of the render loop.
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
    render(scene: Phaser.Scene, children: Phaser.GameObjects.GameObject[], camera: Phaser.Cameras.Scene2D.Camera): void;

    /**
     * Restores the game context's global settings and takes a snapshot if one is scheduled.
     * 
     * The post-render step happens after all Cameras in all Scenes have been rendered.
     */
    postRender(): void;

    /**
     * Takes a snapshot of the given area of the given canvas.
     * 
     * Unlike the other snapshot methods, this one is processed immediately and doesn't wait for the next render.
     * 
     * Snapshots work by creating an Image object from the canvas data, this is a blocking process, which gets
     * more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     * @param canvas The canvas to grab from.
     * @param callback The Function to invoke after the snapshot image is created.
     * @param getPixel Grab a single pixel as a Color object, or an area as an Image object? Default false.
     * @param x The x coordinate to grab from. Default 0.
     * @param y The y coordinate to grab from. Default 0.
     * @param width The width of the area to grab. Default canvas.width.
     * @param height The height of the area to grab. Default canvas.height.
     * @param type The format of the image to create, usually `image/png` or `image/jpeg`. Default 'image/png'.
     * @param encoderOptions The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`. Default 0.92.
     */
    snapshotCanvas(canvas: HTMLCanvasElement, callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback, getPixel?: boolean, x?: number, y?: number, width?: number, height?: number, type?: string, encoderOptions?: number): this;

    /**
     * Schedules a snapshot of the entire game viewport to be taken after the current frame is rendered.
     * 
     * To capture a specific area see the `snapshotArea` method. To capture a specific pixel, see `snapshotPixel`.
     * 
     * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
     * calling this method will override it.
     * 
     * Snapshots work by creating an Image object from the canvas data, this is a blocking process, which gets
     * more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     * @param callback The Function to invoke after the snapshot image is created.
     * @param type The format of the image to create, usually `image/png` or `image/jpeg`. Default 'image/png'.
     * @param encoderOptions The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`. Default 0.92.
     */
    snapshot(callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback, type?: string, encoderOptions?: number): this;

    /**
     * Schedules a snapshot of the given area of the game viewport to be taken after the current frame is rendered.
     * 
     * To capture the whole game viewport see the `snapshot` method. To capture a specific pixel, see `snapshotPixel`.
     * 
     * Only one snapshot can be active _per frame_. If you have already called `snapshotPixel`, for example, then
     * calling this method will override it.
     * 
     * Snapshots work by creating an Image object from the canvas data, this is a blocking process, which gets
     * more expensive the larger the canvas size gets, so please be careful how you employ this in your game.
     * @param x The x coordinate to grab from.
     * @param y The y coordinate to grab from.
     * @param width The width of the area to grab.
     * @param height The height of the area to grab.
     * @param callback The Function to invoke after the snapshot image is created.
     * @param type The format of the image to create, usually `image/png` or `image/jpeg`. Default 'image/png'.
     * @param encoderOptions The image quality, between 0 and 1. Used for image formats with lossy compression, such as `image/jpeg`. Default 0.92.
     */
    snapshotArea(x: number, y: number, width: number, height: number, callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback, type?: string, encoderOptions?: number): this;

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
    snapshotPixel(x: number, y: number, callback: Phaser.Types.Renderer.Snapshot.SnapshotCallback): this;

    /**
     * Takes a Sprite Game Object, or any object that extends it, and draws it to the current context.
     * @param sprite The texture based Game Object to draw.
     * @param frame The frame to draw, doesn't have to be that owned by the Game Object.
     * @param camera The Camera to use for the rendering transform.
     * @param parentTransformMatrix The transform matrix of the parent container, if set.
     */
    batchSprite(sprite: Phaser.GameObjects.GameObject, frame: Phaser.Textures.Frame, camera: Phaser.Cameras.Scene2D.Camera, parentTransformMatrix?: Phaser.GameObjects.Components.TransformMatrix): void;

    /**
     * Destroys all object references in the Canvas Renderer.
     */
    destroy(): void;

}
