import { GameObject } from '@thaser/gameobjects';
import {
  BlendMode,
  Depth,
  Mask,
  Pipeline,
  Visible
} from '@thaser/gameobjects/components';
import { Scene } from '@thaser/scene';
import Tilemap from './Tilemap';
/**
 * A Tilemap Layer is a Game Object that renders LayerData from a Tilemap when used in combination
 * with one, or more, Tilesets.
 */
export default class TilemapLayer
  extends GameObject
  implements
    Alpha,
    BlendMode,
    ComputedSize,
    Depth,
    Flip,
    GetBounds,
    Mask,
    Origin,
    Pipeline,
    ScrollFactor,
    Transform,
    Visible
{
  /**
   *
   * @param scene The Scene to which this Game Object belongs.
   * @param tilemap The Tilemap this layer is a part of.
   * @param layerIndex The index of the LayerData associated with this layer.
   * @param tileset The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
   * @param x The world x position where the top left of this layer will be placed. Default 0.
   * @param y The world y position where the top left of this layer will be placed. Default 0.
   */
  constructor(
    scene: Scene,
    tilemap: Tilemap,
    layerIndex: number,
    tileset:
      | string
      | string[]
      | Phaser.Tilemaps.Tileset
      | Phaser.Tilemaps.Tileset[],
    x = 0,
    y = 0
  ) {
    super(scene, 'TilemapLayer');

    this.tilemap = tilemap;
    this.layerIndex = layerIndex;
    this.layer = tilemap.layers = [layerIndex];
    this.layer.tilemapLayer = this;

  }

  /**
   * Used internally by physics system to perform fast type checks.
   */
  readonly isTilemap = true;

  /**
   * The Tilemap that this layer is a part of.
   */
  tilemap: Tilemap;

  /**
   * The index of the LayerData associated with this layer.
   */
  layerIndex: number;

  /**
   * The LayerData associated with this layer. LayerData can only be associated with one
   * tilemap layer.
   */
  layer: Phaser.Tilemaps.LayerData;

  /**
   * An array of `Tileset` objects associated with this layer.
   */
  tileset: Phaser.Tilemaps.Tileset[];

  /**
   * The total number of tiles drawn by the renderer in the last frame.
   */
  readonly tilesDrawn: number;

  /**
   * The total number of tiles in this layer. Updated every frame.
   */
  readonly tilesTotal: number;

  /**
   * Used internally during rendering. This holds the tiles that are visible within the Camera.
   */
  culledTiles: Phaser.Tilemaps.Tile[];

  /**
   * You can control if the camera should cull tiles on this layer before rendering them or not.
   *
   * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
   *
   * However, there are some instances when you may wish to disable this, and toggling this flag allows
   * you to do so. Also see `setSkipCull` for a chainable method that does the same thing.
   */
  skipCull: boolean;

  /**
   * The amount of extra tiles to add into the cull rectangle when calculating its horizontal size.
   *
   * See the method `setCullPadding` for more details.
   */
  cullPaddingX: number;

  /**
   * The amount of extra tiles to add into the cull rectangle when calculating its vertical size.
   *
   * See the method `setCullPadding` for more details.
   */
  cullPaddingY: number;

  /**
   * The callback that is invoked when the tiles are culled.
   *
   * It will call a different function based on the map orientation:
   *
   * Orthogonal (the default) is `TilemapComponents.CullTiles`
   * Isometric is `TilemapComponents.IsometricCullTiles`
   * Hexagonal is `TilemapComponents.HexagonalCullTiles`
   * Staggered is `TilemapComponents.StaggeredCullTiles`
   *
   * However, you can override this to call any function you like.
   *
   * It will be sent 4 arguments:
   *
   * 1. The Phaser.Tilemaps.LayerData object for this Layer
   * 2. The Camera that is culling the layer. You can check its `dirty` property to see if it has changed since the last cull.
   * 3. A reference to the `culledTiles` array, which should be used to store the tiles you want rendered.
   * 4. The Render Order constant.
   *
   * See the `TilemapComponents.CullTiles` source code for details on implementing your own culling system.
   */
  cullCallback: Function;

  /**
   * An array holding the mapping between the tile indexes and the tileset they belong to.
   */
  gidMap: Phaser.Tilemaps.Tileset[];

  /**
   * The horizontal origin of this Tilemap Layer.
   */
  readonly originX: number;

  /**
   * The vertical origin of this Tilemap Layer.
   */
  readonly originY: number;

  /**
   * The horizontal display origin of this Tilemap Layer.
   */
  readonly displayOriginX: number;

  /**
   * The vertical display origin of this Tilemap Layer.
   */
  readonly displayOriginY: number;

  /**
   * Sets the rendering (draw) order of the tiles in this layer.
   *
   * The default is 'right-down', meaning it will order the tiles starting from the top-left,
   * drawing to the right and then moving down to the next row.
   *
   * The draw orders are:
   *
   * 0 = right-down
   * 1 = left-down
   * 2 = right-up
   * 3 = left-up
   *
   * Setting the render order does not change the tiles or how they are stored in the layer,
   * it purely impacts the order in which they are rendered.
   *
   * You can provide either an integer (0 to 3), or the string version of the order.
   * @param renderOrder The render (draw) order value. Either an integer between 0 and 3, or a string: 'right-down', 'left-down', 'right-up' or 'left-up'.
   */
  setRenderOrder(renderOrder: number | string): this;

  /**
   * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
   * faces are used internally for optimizing collisions against tiles. This method is mostly used
   * internally to optimize recalculating faces when only one tile has been changed.
   * @param tileX The x coordinate.
   * @param tileY The y coordinate.
   */
  calculateFacesAt(tileX: number, tileY: number): this;

  /**
   * Calculates interesting faces within the rectangular area specified (in tile coordinates) of the
   * layer. Interesting faces are used internally for optimizing collisions against tiles. This method
   * is mostly used internally.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   */
  calculateFacesWithin(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * Creates a Sprite for every object matching the given tile indexes in the layer. You can
   * optionally specify if each tile will be replaced with a new tile after the Sprite has been
   * created. This is useful if you want to lay down special tiles in a level that are converted to
   * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
   * @param indexes The tile index, or array of indexes, to create Sprites from.
   * @param replacements The tile index, or array of indexes, to change a converted
   * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
   * one-to-one mapping with the indexes array.
   * @param spriteConfig The config object to pass into the Sprite creator (i.e.
   * scene.make.sprite).
   * @param scene The Scene to create the Sprites within.
   * @param camera The Camera to use when determining the world XY
   */
  createFromTiles(
    indexes: number | any[],
    replacements: number | any[],
    spriteConfig?: Phaser.Types.GameObjects.Sprite.SpriteConfig,
    scene?: Phaser.Scene,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.GameObjects.Sprite[];

  /**
   * Returns the tiles in the given layer that are within the cameras viewport.
   * This is used internally during rendering.
   * @param camera The Camera to run the cull check against.
   */
  cull(camera?: Phaser.Cameras.Scene2D.Camera): Phaser.Tilemaps.Tile[];

  /**
   * Copies the tiles in the source rectangular area to a new destination (all specified in tile
   * coordinates) within the layer. This copies all tile properties & recalculates collision
   * information in the destination region.
   * @param srcTileX The x coordinate of the area to copy from, in tiles, not pixels.
   * @param srcTileY The y coordinate of the area to copy from, in tiles, not pixels.
   * @param width The width of the area to copy, in tiles, not pixels.
   * @param height The height of the area to copy, in tiles, not pixels.
   * @param destTileX The x coordinate of the area to copy to, in tiles, not pixels.
   * @param destTileY The y coordinate of the area to copy to, in tiles, not pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   */
  copy(
    srcTileX: number,
    srcTileY: number,
    width: number,
    height: number,
    destTileX: number,
    destTileY: number,
    recalculateFaces?: boolean
  ): this;

  /**
   * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
   * specified index. Tiles will be set to collide if the given index is a colliding index.
   * Collision information in the region will be recalculated.
   * @param index The tile index to fill the area with.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   */
  fill(
    index: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    recalculateFaces?: boolean
  ): this;

  /**
   * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
   * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
   * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
   * @param callback The callback. Each tile in the given area will be passed to this
   * callback as the first and only parameter. The callback should return true for tiles that pass the
   * filter.
   * @param context The context under which the callback should be run.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to filter.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to filter.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   */
  filterTiles(
    callback: Function,
    context?: object,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions
  ): Phaser.Tilemaps.Tile[];

  /**
   * Searches the entire map layer for the first tile matching the given index, then returns that Tile
   * object. If no match is found, it returns null. The search starts from the top-left tile and
   * continues horizontally until it hits the end of the row, then it drops down to the next column.
   * If the reverse boolean is true, it scans starting from the bottom-right corner traveling up to
   * the top-left.
   * @param index The tile index value to search for.
   * @param skip The number of times to skip a matching tile before returning. Default 0.
   * @param reverse If true it will scan the layer in reverse, starting at the bottom-right. Otherwise it scans from the top-left. Default false.
   */
  findByIndex(
    index: number,
    skip?: number,
    reverse?: boolean
  ): Phaser.Tilemaps.Tile;

  /**
   * Find the first tile in the given rectangular area (in tile coordinates) of the layer that
   * satisfies the provided testing function. I.e. finds the first tile for which `callback` returns
   * true. Similar to Array.prototype.find in vanilla JS.
   * @param callback The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
   * @param context The context under which the callback should be run.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   */
  findTile(
    callback: FindTileCallback,
    context?: object,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions
  ): Phaser.Tilemaps.Tile | null;

  /**
   * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
   * callback. Similar to Array.prototype.forEach in vanilla JS.
   * @param callback The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
   * @param context The context, or scope, under which the callback should be run.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   */
  forEachTile(
    callback: EachTileCallback,
    context?: object,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions
  ): this;

  /**
   * Sets an additive tint on each Tile within the given area.
   *
   * The tint works by taking the pixel color values from the tileset texture, and then
   * multiplying it by the color value of the tint.
   *
   * If no area values are given then all tiles will be tinted to the given color.
   *
   * To remove a tint call this method with either no parameters, or by passing white `0xffffff` as the tint color.
   *
   * If a tile already has a tint set then calling this method will override that.
   * @param tint The tint color being applied to each tile within the region. Given as a hex value, i.e. `0xff0000` for red. Set to white (`0xffffff`) to reset the tint. Default 0xffffff.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   */
  setTint(
    tint?: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions
  ): this;

  /**
   * Gets a tile at the given tile coordinates from the given layer.
   * @param tileX X position to get the tile from (given in tile units, not pixels).
   * @param tileY Y position to get the tile from (given in tile units, not pixels).
   * @param nonNull If true getTile won't return null for empty tiles, but a Tile object with an index of -1. Default false.
   */
  getTileAt(
    tileX: number,
    tileY: number,
    nonNull?: boolean
  ): Phaser.Tilemaps.Tile;

  /**
   * Gets a tile at the given world coordinates from the given layer.
   * @param worldX X position to get the tile from (given in pixels)
   * @param worldY Y position to get the tile from (given in pixels)
   * @param nonNull If true, function won't return null for empty tiles, but a Tile object with an index of -1. Default false.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  getTileAtWorldXY(
    worldX: number,
    worldY: number,
    nonNull?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Tilemaps.Tile;

  /**
   * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   */
  getTilesWithin(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions
  ): Phaser.Tilemaps.Tile[];

  /**
   * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
   * Line, Rectangle or Triangle. The shape should be in world coordinates.
   * @param shape A shape in world (pixel) coordinates
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param camera The Camera to use when factoring in which tiles to return.
   */
  getTilesWithinShape(
    shape:
      | Phaser.Geom.Circle
      | Phaser.Geom.Line
      | Phaser.Geom.Rectangle
      | Phaser.Geom.Triangle,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Tilemaps.Tile[];

  /**
   * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
   * @param worldX The world x coordinate for the top-left of the area.
   * @param worldY The world y coordinate for the top-left of the area.
   * @param width The width of the area.
   * @param height The height of the area.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param camera The Camera to use when factoring in which tiles to return.
   */
  getTilesWithinWorldXY(
    worldX: number,
    worldY: number,
    width: number,
    height: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Tilemaps.Tile[];

  /**
   * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
   * false if there is no tile or if the tile at that location has an index of -1.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   */
  hasTileAt(tileX: number, tileY: number): boolean;

  /**
   * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
   * false if there is no tile or if the tile at that location has an index of -1.
   * @param worldX The x coordinate, in pixels.
   * @param worldY The y coordinate, in pixels.
   * @param camera The Camera to use when factoring in which tiles to return.
   */
  hasTileAtWorldXY(
    worldX: number,
    worldY: number,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): boolean;

  /**
   * Puts a tile at the given tile coordinates in the specified layer. You can pass in either an index
   * or a Tile object. If you pass in a Tile, all attributes will be copied over to the specified
   * location. If you pass in an index, only the index at the specified location will be changed.
   * Collision information will be recalculated at the specified location.
   * @param tile The index of this tile to set or a Tile object.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   */
  putTileAt(
    tile: number | Phaser.Tilemaps.Tile,
    tileX: number,
    tileY: number,
    recalculateFaces?: boolean
  ): Phaser.Tilemaps.Tile;

  /**
   * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
   * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
   * specified location. If you pass in an index, only the index at the specified location will be
   * changed. Collision information will be recalculated at the specified location.
   * @param tile The index of this tile to set or a Tile object.
   * @param worldX The x coordinate, in pixels.
   * @param worldY The y coordinate, in pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  putTileAtWorldXY(
    tile: number | Phaser.Tilemaps.Tile,
    worldX: number,
    worldY: number,
    recalculateFaces?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Tilemaps.Tile;

  /**
   * Puts an array of tiles or a 2D array of tiles at the given tile coordinates in the specified
   * layer. The array can be composed of either tile indexes or Tile objects. If you pass in a Tile,
   * all attributes will be copied over to the specified location. If you pass in an index, only the
   * index at the specified location will be changed. Collision information will be recalculated
   * within the region tiles were changed.
   * @param tile A row (array) or grid (2D array) of Tiles or tile indexes to place.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   */
  putTilesAt(
    tile:
      | number[]
      | number[][]
      | Phaser.Tilemaps.Tile[]
      | Phaser.Tilemaps.Tile[][],
    tileX: number,
    tileY: number,
    recalculateFaces?: boolean
  ): this;

  /**
   * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
   * specified layer. Each tile will receive a new index. If an array of indexes is passed in, then
   * those will be used for randomly assigning new tile indexes. If an array is not provided, the
   * indexes found within the region (excluding -1) will be used for randomly assigning new tile
   * indexes. This method only modifies tile indexes and does not change collision information.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param indexes An array of indexes to randomly draw from during randomization.
   */
  randomize(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    indexes?: number[]
  ): this;

  /**
   * Removes the tile at the given tile coordinates in the specified layer and updates the layers
   * collision information.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param replaceWithNull If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1. Default true.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   */
  removeTileAt(
    tileX: number,
    tileY: number,
    replaceWithNull?: boolean,
    recalculateFaces?: boolean
  ): Phaser.Tilemaps.Tile;

  /**
   * Removes the tile at the given world coordinates in the specified layer and updates the layers
   * collision information.
   * @param worldX The x coordinate, in pixels.
   * @param worldY The y coordinate, in pixels.
   * @param replaceWithNull If true, this will replace the tile at the specified location with null instead of a Tile with an index of -1. Default true.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  removeTileAtWorldXY(
    worldX: number,
    worldY: number,
    replaceWithNull?: boolean,
    recalculateFaces?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Tilemaps.Tile;

  /**
   * Draws a debug representation of the layer to the given Graphics. This is helpful when you want to
   * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
   * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
   * wherever you want on the screen.
   * @param graphics The target Graphics object to draw upon.
   * @param styleConfig An object specifying the colors to use for the debug drawing.
   */
  renderDebug(
    graphics: Phaser.GameObjects.Graphics,
    styleConfig?: Phaser.Types.Tilemaps.StyleConfig
  ): this;

  /**
   * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
   * `findIndex` and updates their index to match `newIndex`. This only modifies the index and does
   * not change collision information.
   * @param findIndex The index of the tile to search for.
   * @param newIndex The index of the tile to replace it with.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   */
  replaceByIndex(
    findIndex: number,
    newIndex: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * You can control if the Cameras should cull tiles before rendering them or not.
   *
   * By default the camera will try to cull the tiles in this layer, to avoid over-drawing to the renderer.
   *
   * However, there are some instances when you may wish to disable this.
   * @param value Set to `true` to stop culling tiles. Set to `false` to enable culling again. Default true.
   */
  setSkipCull(value?: boolean): this;

  /**
   * When a Camera culls the tiles in this layer it does so using its view into the world, building up a
   * rectangle inside which the tiles must exist or they will be culled. Sometimes you may need to expand the size
   * of this 'cull rectangle', especially if you plan on rotating the Camera viewing the layer. Do so
   * by providing the padding values. The values given are in tiles, not pixels. So if the tile width was 32px
   * and you set `paddingX` to be 4, it would add 32px x 4 to the cull rectangle (adjusted for scale)
   * @param paddingX The amount of extra horizontal tiles to add to the cull check padding. Default 1.
   * @param paddingY The amount of extra vertical tiles to add to the cull check padding. Default 1.
   */
  setCullPadding(paddingX?: number, paddingY?: number): this;

  /**
   * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
   * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
   * collision will be enabled (true) or disabled (false).
   * @param indexes Either a single tile index, or an array of tile indexes.
   * @param collides If true it will enable collision. If false it will clear collision. Default true.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update. Default true.
   * @param updateLayer If true, updates the current tiles on the layer. Set to false if no tiles have been placed for significant performance boost. Default true.
   */
  setCollision(
    indexes: number | any[],
    collides?: boolean,
    recalculateFaces?: boolean,
    updateLayer?: boolean
  ): this;

  /**
   * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
   * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
   * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
   * enabled (true) or disabled (false).
   * @param start The first index of the tile to be set for collision.
   * @param stop The last index of the tile to be set for collision.
   * @param collides If true it will enable collision. If false it will clear collision. Default true.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update. Default true.
   */
  setCollisionBetween(
    start: number,
    stop: number,
    collides?: boolean,
    recalculateFaces?: boolean
  ): this;

  /**
   * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
   * that matches the given properties object, its collision flag will be set. The `collides`
   * parameter controls if collision will be enabled (true) or disabled (false). Passing in
   * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
   * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
   * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
   * "types" property that matches any of those values, its collision flag will be updated.
   * @param properties An object with tile properties and corresponding values that should be checked.
   * @param collides If true it will enable collision. If false it will clear collision. Default true.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update. Default true.
   */
  setCollisionByProperty(
    properties: object,
    collides?: boolean,
    recalculateFaces?: boolean
  ): this;

  /**
   * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
   * the given array. The `collides` parameter controls if collision will be enabled (true) or
   * disabled (false). Tile indexes not currently in the layer are not affected.
   * @param indexes An array of the tile indexes to not be counted for collision.
   * @param collides If true it will enable collision. If false it will clear collision. Default true.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update. Default true.
   */
  setCollisionByExclusion(
    indexes: number[],
    collides?: boolean,
    recalculateFaces?: boolean
  ): this;

  /**
   * Sets collision on the tiles within a layer by checking each tiles collision group data
   * (typically defined in Tiled within the tileset collision editor). If any objects are found within
   * a tiles collision group, the tile's colliding information will be set. The `collides` parameter
   * controls if collision will be enabled (true) or disabled (false).
   * @param collides If true it will enable collision. If false it will clear collision. Default true.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update. Default true.
   */
  setCollisionFromCollisionGroup(
    collides?: boolean,
    recalculateFaces?: boolean
  ): this;

  /**
   * Sets a global collision callback for the given tile index within the layer. This will affect all
   * tiles on this layer that have the same index. If a callback is already set for the tile index it
   * will be replaced. Set the callback to null to remove it. If you want to set a callback for a tile
   * at a specific location on the map then see setTileLocationCallback.
   * @param indexes Either a single tile index, or an array of tile indexes to have a collision callback set for.
   * @param callback The callback that will be invoked when the tile is collided with.
   * @param callbackContext The context under which the callback is called.
   */
  setTileIndexCallback(
    indexes: number | number[],
    callback: Function,
    callbackContext: object
  ): this;

  /**
   * Sets a collision callback for the given rectangular area (in tile coordinates) within the layer.
   * If a callback is already set for the tile index it will be replaced. Set the callback to null to
   * remove it.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param callback The callback that will be invoked when the tile is collided with.
   * @param callbackContext The context, or scope, under which the callback is invoked.
   */
  setTileLocationCallback(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    callback?: Function,
    callbackContext?: object
  ): this;

  /**
   * Shuffles the tiles in a rectangular region (specified in tile coordinates) within the given
   * layer. It will only randomize the tiles in that area, so if they're all the same nothing will
   * appear to have changed! This method only modifies tile indexes and does not change collision
   * information.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   */
  shuffle(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
   * `indexA` and swaps then with `indexB`. This only modifies the index and does not change collision
   * information.
   * @param tileA First tile index.
   * @param tileB Second tile index.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   */
  swapByIndex(
    tileA: number,
    tileB: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * Converts from tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
   * layers position, scale and scroll.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  tileToWorldX(tileX: number, camera?: Phaser.Cameras.Scene2D.Camera): number;

  /**
   * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
   * layers position, scale and scroll.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  tileToWorldY(tileY: number, camera?: Phaser.Cameras.Scene2D.Camera): number;

  /**
   * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
   * layers position, scale and scroll. This will return a new Vector2 object or update the given
   * `point` object.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param point A Vector2 to store the coordinates in. If not given a new Vector2 is created.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  tileToWorldXY(
    tileX: number,
    tileY: number,
    point?: Phaser.Math.Vector2,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Math.Vector2;

  /**
   * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
   * specified layer. Each tile will receive a new index. New indexes are drawn from the given
   * weightedIndexes array. An example weighted array:
   *
   * [
   *  { index: 6, weight: 4 },    // Probability of index 6 is 4 / 8
   *  { index: 7, weight: 2 },    // Probability of index 7 would be 2 / 8
   *  { index: 8, weight: 1.5 },  // Probability of index 8 would be 1.5 / 8
   *  { index: 26, weight: 0.5 }  // Probability of index 27 would be 0.5 / 8
   * ]
   *
   * The probability of any index being choose is (the index's weight) / (sum of all weights). This
   * method only modifies tile indexes and does not change collision information.
   * @param weightedIndexes An array of objects to randomly draw from during randomization. They should be in the form: { index: 0, weight: 4 } or { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   */
  weightedRandomize(
    weightedIndexes: object[],
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number
  ): this;

  /**
   * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
   * layers position, scale and scroll.
   * @param worldX The x coordinate to be converted, in pixels, not tiles.
   * @param snapToFloor Whether or not to round the tile coordinate down to the nearest integer.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  worldToTileX(
    worldX: number,
    snapToFloor?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): number;

  /**
   * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
   * layers position, scale and scroll.
   * @param worldY The y coordinate to be converted, in pixels, not tiles.
   * @param snapToFloor Whether or not to round the tile coordinate down to the nearest integer.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  worldToTileY(
    worldY: number,
    snapToFloor?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): number;

  /**
   * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
   * layers position, scale and scroll. This will return a new Vector2 object or update the given
   * `point` object.
   * @param worldX The x coordinate to be converted, in pixels, not tiles.
   * @param worldY The y coordinate to be converted, in pixels, not tiles.
   * @param snapToFloor Whether or not to round the tile coordinate down to the nearest integer.
   * @param point A Vector2 to store the coordinates in. If not given a new Vector2 is created.
   * @param camera The Camera to use when calculating the tile index from the world values.
   */
  worldToTileXY(
    worldX: number,
    worldY: number,
    snapToFloor?: boolean,
    point?: Phaser.Math.Vector2,
    camera?: Phaser.Cameras.Scene2D.Camera
  ): Phaser.Math.Vector2;

  /**
   * Destroys this TilemapLayer and removes its link to the associated LayerData.
   * @param removeFromTilemap Remove this layer from the parent Tilemap? Default true.
   */
  destroy(removeFromTilemap?: boolean): void;

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
