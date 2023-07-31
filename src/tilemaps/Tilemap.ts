/**
 * A Tilemap is a container for Tilemap data. This isn't a display object, rather, it holds data
 * about the map and allows you to add tilesets and tilemap layers to it. A map can have one or
 * more tilemap layers, which are the display objects that actually render the tiles.
 *
 * The Tilemap data can be parsed from a Tiled JSON file, a CSV file or a 2D array. Tiled is a free
 * software package specifically for creating tile maps, and is available from:
 * http://www.mapeditor.org
 *
 * As of Phaser 3.50.0 the Tilemap API now supports the following types of map:
 *
 * 1) Orthogonal
 * 2) Isometric
 * 3) Hexagonal
 * 4) Staggered
 *
 * Prior to this release, only orthogonal maps were supported.
 *
 * Another large change in 3.50 was the consolidation of Tilemap Layers. Previously, you created
 * either a Static or Dynamic Tilemap Layer. However, as of 3.50 the features of both have been
 * merged and the API simplified, so now there is just the single `TilemapLayer` class.
 *
 * A Tilemap has handy methods for getting and manipulating the tiles within a layer, allowing
 * you to build or modify the tilemap data at runtime.
 *
 * Note that all Tilemaps use a base tile size to calculate dimensions from, but that a
 * TilemapLayer may have its own unique tile size that overrides this.
 *
 * As of Phaser 3.21.0, if your tilemap includes layer groups (a feature of Tiled 1.2.0+) these
 * will be traversed and the following properties will impact children:
 *
 * - Opacity (blended with parent) and visibility (parent overrides child)
 * - Vertical and horizontal offset
 *
 * The grouping hierarchy is not preserved and all layers will be flattened into a single array.
 *
 * Group layers are parsed during Tilemap construction but are discarded after parsing so dynamic
 * layers will NOT continue to be affected by a parent.
 *
 * To avoid duplicate layer names, a layer that is a child of a group layer will have its parent
 * group name prepended with a '/'.  For example, consider a group called 'ParentGroup' with a
 * child called 'Layer 1'. In the Tilemap object, 'Layer 1' will have the name
 * 'ParentGroup/Layer 1'.
 */
export default class Tilemap {
  /**
   *
   * @param scene The Scene to which this Tilemap belongs.
   * @param mapData A MapData instance containing Tilemap data.
   */
  constructor(scene: Phaser.Scene, mapData: Phaser.Tilemaps.MapData);

  scene: Phaser.Scene;

  /**
   * The base width of a tile in pixels. Note that individual layers may have a different tile
   * width.
   */
  tileWidth: number;

  /**
   * The base height of a tile in pixels. Note that individual layers may have a different
   * tile height.
   */
  tileHeight: number;

  /**
   * The width of the map (in tiles).
   */
  width: number;

  /**
   * The height of the map (in tiles).
   */
  height: number;

  /**
   * The orientation of the map data (as specified in Tiled), usually 'orthogonal'.
   */
  orientation: string;

  /**
   * The render (draw) order of the map data (as specified in Tiled), usually 'right-down'.
   *
   * The draw orders are:
   *
   * right-down
   * left-down
   * right-up
   * left-up
   *
   * This can be changed via the `setRenderOrder` method.
   */
  renderOrder: string;

  /**
   * The format of the map data.
   */
  format: number;

  /**
   * The version of the map data (as specified in Tiled, usually 1).
   */
  version: number;

  /**
   * Map specific properties as specified in Tiled.
   */
  properties: object;

  /**
   * The width of the map in pixels based on width * tileWidth.
   */
  widthInPixels: number;

  /**
   * The height of the map in pixels based on height * tileHeight.
   */
  heightInPixels: number;

  /**
   * A collection of Images, as parsed from Tiled map data.
   */
  imageCollections: Phaser.Tilemaps.ImageCollection[];

  /**
   * An array of Tiled Image Layers.
   */
  images: any[];

  /**
   * An array of Tilemap layer data.
   */
  layers: Phaser.Tilemaps.LayerData[];

  /**
   * An array of Tilesets used in the map.
   */
  tilesets: Phaser.Tilemaps.Tileset[];

  /**
   * An array of ObjectLayer instances parsed from Tiled object layers.
   */
  objects: Phaser.Tilemaps.ObjectLayer[];

  /**
   * The index of the currently selected LayerData object.
   */
  currentLayerIndex: number;

  /**
   * The length of the horizontal sides of the hexagon.
   * Only used for hexagonal orientation Tilemaps.
   */
  hexSideLength: number;

  /**
   * Sets the rendering (draw) order of the tiles in this map.
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
   *
   * Calling this method _after_ creating Tilemap Layers will **not** automatically
   * update them to use the new render order. If you call this method after creating layers, use their
   * own `setRenderOrder` methods to change them as needed.
   * @param renderOrder The render (draw) order value. Either an integer between 0 and 3, or a string: 'right-down', 'left-down', 'right-up' or 'left-up'.
   */
  setRenderOrder(renderOrder: number | string): this;

  /**
   * Adds an image to the map to be used as a tileset. A single map may use multiple tilesets.
   * Note that the tileset name can be found in the JSON file exported from Tiled, or in the Tiled
   * editor.
   * @param tilesetName The name of the tileset as specified in the map data.
   * @param key The key of the Phaser.Cache image used for this tileset. If
   * `undefined` or `null` it will look for an image with a key matching the tilesetName parameter.
   * @param tileWidth The width of the tile (in pixels) in the Tileset Image. If not
   * given it will default to the map's tileWidth value, or the tileWidth specified in the Tiled
   * JSON file.
   * @param tileHeight The height of the tiles (in pixels) in the Tileset Image. If
   * not given it will default to the map's tileHeight value, or the tileHeight specified in the
   * Tiled JSON file.
   * @param tileMargin The margin around the tiles in the sheet (in pixels). If not
   * specified, it will default to 0 or the value specified in the Tiled JSON file.
   * @param tileSpacing The spacing between each the tile in the sheet (in pixels).
   * If not specified, it will default to 0 or the value specified in the Tiled JSON file.
   * @param gid If adding multiple tilesets to a blank map, specify the starting
   * GID this set will use here. Default 0.
   */
  addTilesetImage(
    tilesetName: string,
    key?: string,
    tileWidth?: number,
    tileHeight?: number,
    tileMargin?: number,
    tileSpacing?: number,
    gid?: number
  ): Phaser.Tilemaps.Tileset | null;

  /**
   * Copies the tiles in the source rectangular area to a new destination (all specified in tile
   * coordinates) within the layer. This copies all tile properties & recalculates collision
   * information in the destination region.
   *
   * If no layer specified, the map's current layer is used. This cannot be applied to StaticTilemapLayers.
   * @param srcTileX The x coordinate of the area to copy from, in tiles, not pixels.
   * @param srcTileY The y coordinate of the area to copy from, in tiles, not pixels.
   * @param width The width of the area to copy, in tiles, not pixels.
   * @param height The height of the area to copy, in tiles, not pixels.
   * @param destTileX The x coordinate of the area to copy to, in tiles, not pixels.
   * @param destTileY The y coordinate of the area to copy to, in tiles, not pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  copy(
    srcTileX: number,
    srcTileY: number,
    width: number,
    height: number,
    destTileX: number,
    destTileY: number,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Creates a new and empty Tilemap Layer. The currently selected layer in the map is set to this new layer.
   *
   * Prior to v3.50.0 this method was called `createBlankDynamicLayer`.
   * @param name The name of this layer. Must be unique within the map.
   * @param tileset The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
   * @param x The world x position where the top left of this layer will be placed. Default 0.
   * @param y The world y position where the top left of this layer will be placed. Default 0.
   * @param width The width of the layer in tiles. If not specified, it will default to the map's width.
   * @param height The height of the layer in tiles. If not specified, it will default to the map's height.
   * @param tileWidth The width of the tiles the layer uses for calculations. If not specified, it will default to the map's tileWidth.
   * @param tileHeight The height of the tiles the layer uses for calculations. If not specified, it will default to the map's tileHeight.
   */
  createBlankLayer(
    name: string,
    tileset:
      | string
      | string[]
      | Phaser.Tilemaps.Tileset
      | Phaser.Tilemaps.Tileset[],
    x?: number,
    y?: number,
    width?: number,
    height?: number,
    tileWidth?: number,
    tileHeight?: number
  ): Phaser.Tilemaps.TilemapLayer | null;

  /**
   * Creates a new Tilemap Layer that renders the LayerData associated with the given
   * `layerID`. The currently selected layer in the map is set to this new layer.
   *
   * The `layerID` is important. If you've created your map in Tiled then you can get this by
   * looking in Tiled and looking at the layer name. Or you can open the JSON file it exports and
   * look at the layers[].name value. Either way it must match.
   *
   * Prior to v3.50.0 this method was called `createDynamicLayer`.
   * @param layerID The layer array index value, or if a string is given, the layer name from Tiled.
   * @param tileset The tileset, or an array of tilesets, used to render this layer. Can be a string or a Tileset object.
   * @param x The x position to place the layer in the world. If not specified, it will default to the layer offset from Tiled or 0. Default 0.
   * @param y The y position to place the layer in the world. If not specified, it will default to the layer offset from Tiled or 0. Default 0.
   */
  createLayer(
    layerID: number | string,
    tileset:
      | string
      | string[]
      | Phaser.Tilemaps.Tileset
      | Phaser.Tilemaps.Tileset[],
    x?: number,
    y?: number
  ): Phaser.Tilemaps.TilemapLayer | null;

  /**
   * This method will iterate through all of the objects defined in a Tiled Object Layer and then
   * convert the matching results into Phaser Game Objects (by default, Sprites)
   *
   * Objects are matched on one of 4 criteria: The Object ID, the Object GID, the Object Name, or the Object Type.
   *
   * Within Tiled, Object IDs are unique per Object. Object GIDs, however, are shared by all objects
   * using the same image. Finally, Object Names and Types are strings and the same name can be used on multiple
   * Objects in Tiled, they do not have to be unique; Names are specific to Objects while Types can be inherited
   * from Object GIDs using the same image.
   *
   * You set the configuration parameter accordingly, based on which type of criteria you wish
   * to match against. For example, to convert all items on an Object Layer with a `gid` of 26:
   *
   * ```javascript
   * createFromObjects(layerName, {
   *   gid: 26
   * });
   * ```
   *
   * Or, to convert objects with the name 'bonus':
   *
   * ```javascript
   * createFromObjects(layerName, {
   *   name: 'bonus'
   * });
   * ```
   *
   * Or, to convert an object with a specific id:
   *
   * ```javascript
   * createFromObjects(layerName, {
   *   id: 9
   * });
   * ```
   *
   * You should only specify either `id`, `gid`, `name`, `type`, or none of them. Do not add more than
   * one criteria to your config. If you do not specify any criteria, then _all_ objects in the
   * Object Layer will be converted.
   *
   * By default this method will convert objects into `Sprite` instances, but you can override
   * this by providing your own class type:
   *
   * ```javascript
   * createFromObjects(layerName, {
   *   gid: 26,
   *   classType: Coin
   * });
   * ```
   *
   * This will convert all Objects with a gid of 26 into your custom `Coin` class. You can pass
   * any class type here, but it _must_ extend `Phaser.GameObjects.GameObject` as its base class.
   * Your class will always be passed 1 parameter: `scene`, which is a reference to either the Scene
   * specified in the config object or, if not given, the Scene to which this Tilemap belongs. The
   * class must have {@link Phaser.GameObjects.Components.Transform#setPosition} and
   * {@link Phaser.GameObjects.Components.Texture#setTexture} methods.
   *
   * All properties from object are copied into the Game Object, so you can use this as an easy
   * way to configure properties from within the map editor. For example giving an object a
   * property of `alpha: 0.5` in Tiled will be reflected in the Game Object that is created.
   *
   * Custom object properties that do not exist as a Game Object property are set in the
   * Game Objects {@link Phaser.GameObjects.GameObject#data data store}.
   *
   * Objects that are based on tiles (tilemap objects that are defined using the `gid` property) can be considered "hierarchical" by passing the third parameter `useTileset` true.
   * Data such as texture, frame (assuming you've matched tileset and spritesheet geometries),
   * `type` and `properties` will use the tileset information first and then override it with data set at the object level.
   * For instance, a tileset which includes
   * `[... a tileset of 16 elements...], [...ids 0, 1, and 2...], {id: 3, type: 'treadmill', speed:4}`
   * and an object layer which includes
   * `{id: 7, gid: 19, speed:5, rotation:90}`
   * will be interpreted as though it were
   * `{id: 7, gid:19, speed:5, rotation:90, type:'treadmill', texture:..., frame:3}`.
   * You can then suppress this behavior by setting the boolean `ignoreTileset` for each `config` that should ignore
   * object gid tilesets.
   *
   * You can set a `container` property in the config. If given, the class will be added to
   * the Container instance instead of the Scene.
   * You can set named texture-`key` and texture-`frame` properties, which will be set on the resultant object.
   *
   * Finally, you can provide an array of config objects, to convert multiple types of object in
   * a single call:
   *
   * ```javascript
   * createFromObjects(layerName, [
   *   {
   *     gid: 26,
   *     classType: Coin
   *   },
   *   {
   *     id: 9,
   *     classType: BossMonster
   *   },
   *   {
   *     name: 'lava',
   *     classType: LavaTile
   *   },
   *   {
   *     type: 'endzone',
   *     classType: Phaser.GameObjects.Zone
   *   }
   * ]);
   * ```
   *
   * The signature of this method changed significantly in v3.60.0. Prior to this, it did not take config objects.
   * @param objectLayerName The name of the Tiled object layer to create the Game Objects from.
   * @param config A CreateFromObjects configuration object, or an array of them.
   * @param useTileset True if objects that set gids should also search the underlying tile for properties and data. Default true.
   */
  createFromObjects(
    objectLayerName: string,
    config:
      | Phaser.Types.Tilemaps.CreateFromObjectLayerConfig
      | Phaser.Types.Tilemaps.CreateFromObjectLayerConfig[],
    useTileset?: boolean
  ): Phaser.GameObjects.GameObject[];

  /**
   * Creates a Sprite for every object matching the given tile indexes in the layer. You can
   * optionally specify if each tile will be replaced with a new tile after the Sprite has been
   * created. This is useful if you want to lay down special tiles in a level that are converted to
   * Sprites, but want to replace the tile itself with a floor tile or similar once converted.
   * @param indexes The tile index, or array of indexes, to create Sprites from.
   * @param replacements The tile index, or array of indexes, to change a converted
   * tile to. Set to `null` to leave the tiles unchanged. If an array is given, it is assumed to be a
   * one-to-one mapping with the indexes array.
   * @param spriteConfig The config object to pass into the Sprite creator (i.e. scene.make.sprite).
   * @param scene The Scene to create the Sprites within.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  createFromTiles(
    indexes: number | any[],
    replacements: number | any[],
    spriteConfig: Phaser.Types.GameObjects.Sprite.SpriteConfig,
    scene?: Phaser.Scene,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.GameObjects.Sprite[] | null;

  /**
   * Sets the tiles in the given rectangular area (in tile coordinates) of the layer with the
   * specified index. Tiles will be set to collide if the given index is a colliding index.
   * Collision information in the region will be recalculated.
   *
   * If no layer specified, the map's current layer is used.
   * This cannot be applied to StaticTilemapLayers.
   * @param index The tile index to fill the area with.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  fill(
    index: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * For each object in the given object layer, run the given filter callback function. Any
   * objects that pass the filter test (i.e. where the callback returns true) will returned as a
   * new array. Similar to Array.prototype.Filter in vanilla JS.
   * @param objectLayer The name of an object layer (from Tiled) or an ObjectLayer instance.
   * @param callback The callback. Each object in the given area will be passed to this callback as the first and only parameter.
   * @param context The context under which the callback should be run.
   */
  filterObjects(
    objectLayer: Phaser.Tilemaps.ObjectLayer | string,
    callback: TilemapFilterCallback,
    context?: object
  ): Phaser.Types.Tilemaps.TiledObject[] | null;

  /**
   * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
   * filter callback function. Any tiles that pass the filter test (i.e. where the callback returns
   * true) will returned as a new array. Similar to Array.prototype.Filter in vanilla JS.
   * If no layer specified, the map's current layer is used.
   * @param callback The callback. Each tile in the given area will be passed to this
   * callback as the first and only parameter. The callback should return true for tiles that pass the
   * filter.
   * @param context The context under which the callback should be run.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to filter.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to filter.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  filterTiles(
    callback: Function,
    context?: object,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile[] | null;

  /**
   * Searches the entire map layer for the first tile matching the given index, then returns that Tile
   * object. If no match is found, it returns null. The search starts from the top-left tile and
   * continues horizontally until it hits the end of the row, then it drops down to the next column.
   * If the reverse boolean is true, it scans starting from the bottom-right corner traveling up to
   * the top-left.
   * If no layer specified, the map's current layer is used.
   * @param index The tile index value to search for.
   * @param skip The number of times to skip a matching tile before returning. Default 0.
   * @param reverse If true it will scan the layer in reverse, starting at the bottom-right. Otherwise it scans from the top-left. Default false.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  findByIndex(
    index: number,
    skip?: number,
    reverse?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Find the first object in the given object layer that satisfies the provided testing function.
   * I.e. finds the first object for which `callback` returns true. Similar to
   * Array.prototype.find in vanilla JS.
   * @param objectLayer The name of an object layer (from Tiled) or an ObjectLayer instance.
   * @param callback The callback. Each object in the given area will be passed to this callback as the first and only parameter.
   * @param context The context under which the callback should be run.
   */
  findObject(
    objectLayer: Phaser.Tilemaps.ObjectLayer | string,
    callback: TilemapFindCallback,
    context?: object
  ): Phaser.Types.Tilemaps.TiledObject | null;

  /**
   * Find the first tile in the given rectangular area (in tile coordinates) of the layer that
   * satisfies the provided testing function. I.e. finds the first tile for which `callback` returns
   * true. Similar to Array.prototype.find in vanilla JS.
   * If no layer specified, the maps current layer is used.
   * @param callback The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
   * @param context The context under which the callback should be run.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param layer The Tile layer to run the search on. If not provided will use the current layer.
   */
  findTile(
    callback: FindTileCallback,
    context?: object,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * For each tile in the given rectangular area (in tile coordinates) of the layer, run the given
   * callback. Similar to Array.prototype.forEach in vanilla JS.
   *
   * If no layer specified, the map's current layer is used.
   * @param callback The callback. Each tile in the given area will be passed to this callback as the first and only parameter.
   * @param context The context under which the callback should be run.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area to search.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param layer The Tile layer to run the search on. If not provided will use the current layer.
   */
  forEachTile(
    callback: EachTileCallback,
    context?: object,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Gets the image layer index based on its name.
   * @param name The name of the image to get.
   */
  getImageIndex(name: string): number;

  /**
   * Return a list of all valid imagelayer names loaded in this Tilemap.
   */
  getImageLayerNames(): string[];

  /**
   * Internally used. Returns the index of the object in one of the Tilemaps arrays whose name
   * property matches the given `name`.
   * @param location The Tilemap array to search.
   * @param name The name of the array element to get.
   */
  getIndex(location: any[], name: string): number;

  /**
   * Gets the LayerData from `this.layers` that is associated with the given `layer`, or null if the layer is invalid.
   * @param layer The name of the layer from Tiled, the index of the layer in the map or Tilemap Layer. If not given will default to the maps current layer index.
   */
  getLayer(
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.LayerData;

  /**
   * Gets the ObjectLayer from `this.objects` that has the given `name`, or null if no ObjectLayer is found with that name.
   * @param name The name of the object layer from Tiled.
   */
  getObjectLayer(name?: string): Phaser.Tilemaps.ObjectLayer | null;

  /**
   * Return a list of all valid objectgroup names loaded in this Tilemap.
   */
  getObjectLayerNames(): string[];

  /**
   * Gets the LayerData index of the given `layer` within this.layers, or null if an invalid
   * `layer` is given.
   * @param layer The name of the layer from Tiled, the index of the layer in the map or a Tilemap Layer. If not given will default to the map's current layer index.
   */
  getLayerIndex(layer?: string | number | Phaser.Tilemaps.TilemapLayer): number;

  /**
   * Gets the index of the LayerData within this.layers that has the given `name`, or null if an
   * invalid `name` is given.
   * @param name The name of the layer to get.
   */
  getLayerIndexByName(name: string): number;

  /**
   * Gets a tile at the given tile coordinates from the given layer.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX X position to get the tile from (given in tile units, not pixels).
   * @param tileY Y position to get the tile from (given in tile units, not pixels).
   * @param nonNull If true getTile won't return null for empty tiles, but a Tile object with an index of -1.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  getTileAt(
    tileX: number,
    tileY: number,
    nonNull?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Gets a tile at the given world coordinates from the given layer.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldX X position to get the tile from (given in pixels)
   * @param worldY Y position to get the tile from (given in pixels)
   * @param nonNull If true, function won't return null for empty tiles, but a Tile object with an index of -1.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  getTileAtWorldXY(
    worldX: number,
    worldY: number,
    nonNull?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Return a list of all valid tilelayer names loaded in this Tilemap.
   */
  getTileLayerNames(): string[];

  /**
   * Gets the tiles in the given rectangular area (in tile coordinates) of the layer.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  getTilesWithin(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile[] | null;

  /**
   * Gets the tiles that overlap with the given shape in the given layer. The shape must be a Circle,
   * Line, Rectangle or Triangle. The shape should be in world coordinates.
   *
   * If no layer is specified, the maps current layer is used.
   * @param shape A shape in world (pixel) coordinates
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param camera The Camera to use when factoring in which tiles to return.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  getTilesWithinShape(
    shape:
      | Phaser.Geom.Circle
      | Phaser.Geom.Line
      | Phaser.Geom.Rectangle
      | Phaser.Geom.Triangle,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile[] | null;

  /**
   * Gets the tiles in the given rectangular area (in world coordinates) of the layer.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldX The world x coordinate for the top-left of the area.
   * @param worldY The world y coordinate for the top-left of the area.
   * @param width The width of the area.
   * @param height The height of the area.
   * @param filteringOptions Optional filters to apply when getting the tiles.
   * @param camera The Camera to use when factoring in which tiles to return.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  getTilesWithinWorldXY(
    worldX: number,
    worldY: number,
    width: number,
    height: number,
    filteringOptions?: Phaser.Types.Tilemaps.FilteringOptions,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile[] | null;

  /**
   * Gets the Tileset that has the given `name`, or null if an invalid `name` is given.
   * @param name The name of the Tileset to get.
   */
  getTileset(name: string): Phaser.Tilemaps.Tileset | null;

  /**
   * Gets the index of the Tileset within this.tilesets that has the given `name`, or null if an
   * invalid `name` is given.
   * @param name The name of the Tileset to get.
   */
  getTilesetIndex(name: string): number;

  /**
   * Checks if there is a tile at the given location (in tile coordinates) in the given layer. Returns
   * false if there is no tile or if the tile at that location has an index of -1.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  hasTileAt(
    tileX: number,
    tileY: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): boolean | null;

  /**
   * Checks if there is a tile at the given location (in world coordinates) in the given layer. Returns
   * false if there is no tile or if the tile at that location has an index of -1.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldX The x coordinate, in pixels.
   * @param worldY The y coordinate, in pixels.
   * @param camera The Camera to use when factoring in which tiles to return.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  hasTileAtWorldXY(
    worldX: number,
    worldY: number,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): boolean | null;

  /**
   * The LayerData object that is currently selected in the map. You can set this property using
   * any type supported by setLayer.
   */
  layer: Phaser.Tilemaps.LayerData;

  /**
   * Puts a tile at the given tile coordinates in the specified layer. You can pass in either an index
   * or a Tile object. If you pass in a Tile, all attributes will be copied over to the specified
   * location. If you pass in an index, only the index at the specified location will be changed.
   * Collision information will be recalculated at the specified location.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tile The index of this tile to set or a Tile object.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  putTileAt(
    tile: number | Phaser.Tilemaps.Tile,
    tileX: number,
    tileY: number,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Puts a tile at the given world coordinates (pixels) in the specified layer. You can pass in either
   * an index or a Tile object. If you pass in a Tile, all attributes will be copied over to the
   * specified location. If you pass in an index, only the index at the specified location will be
   * changed. Collision information will be recalculated at the specified location.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tile The index of this tile to set or a Tile object.
   * @param worldX The x coordinate, in pixels.
   * @param worldY The y coordinate, in pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  putTileAtWorldXY(
    tile: number | Phaser.Tilemaps.Tile,
    worldX: number,
    worldY: number,
    recalculateFaces?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Puts an array of tiles or a 2D array of tiles at the given tile coordinates in the specified
   * layer. The array can be composed of either tile indexes or Tile objects. If you pass in a Tile,
   * all attributes will be copied over to the specified location. If you pass in an index, only the
   * index at the specified location will be changed. Collision information will be recalculated
   * within the region tiles were changed.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tile A row (array) or grid (2D array) of Tiles or tile indexes to place.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param recalculateFaces `true` if the faces data should be recalculated.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  putTilesAt(
    tile:
      | number[]
      | number[][]
      | Phaser.Tilemaps.Tile[]
      | Phaser.Tilemaps.Tile[][],
    tileX: number,
    tileY: number,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Randomizes the indexes of a rectangular region of tiles (in tile coordinates) within the
   * specified layer. Each tile will receive a new index. If an array of indexes is passed in, then
   * those will be used for randomly assigning new tile indexes. If an array is not provided, the
   * indexes found within the region (excluding -1) will be used for randomly assigning new tile
   * indexes. This method only modifies tile indexes and does not change collision information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param indexes An array of indexes to randomly draw from during randomization.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  randomize(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    indexes?: number[],
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Calculates interesting faces at the given tile coordinates of the specified layer. Interesting
   * faces are used internally for optimizing collisions against tiles. This method is mostly used
   * internally to optimize recalculating faces when only one tile has been changed.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  calculateFacesAt(
    tileX: number,
    tileY: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Calculates interesting faces within the rectangular area specified (in tile coordinates) of the
   * layer. Interesting faces are used internally for optimizing collisions against tiles. This method
   * is mostly used internally.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  calculateFacesWithin(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Removes the given TilemapLayer from this Tilemap without destroying it.
   *
   * If no layer is specified, the maps current layer is used.
   * @param layer The tile layer to be removed.
   */
  removeLayer(
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Destroys the given TilemapLayer and removes it from this Tilemap.
   *
   * If no layer is specified, the maps current layer is used.
   * @param layer The tile layer to be destroyed.
   */
  destroyLayer(
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Removes all Tilemap Layers from this Tilemap and calls `destroy` on each of them.
   */
  removeAllLayers(): this;

  /**
   * Removes the given Tile, or an array of Tiles, from the layer to which they belong,
   * and optionally recalculates the collision information.
   * @param tiles The Tile to remove, or an array of Tiles.
   * @param replaceIndex After removing the Tile, insert a brand new Tile into its location with the given index. Leave as -1 to just remove the tile. Default -1.
   * @param recalculateFaces `true` if the faces data should be recalculated. Default true.
   */
  removeTile(
    tiles: Phaser.Tilemaps.Tile | Phaser.Tilemaps.Tile[],
    replaceIndex?: number,
    recalculateFaces?: boolean
  ): Phaser.Tilemaps.Tile[];

  /**
   * Removes the tile at the given tile coordinates in the specified layer and updates the layers collision information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param replaceWithNull If `true` (the default), this will replace the tile at the specified location with null instead of a Tile with an index of -1.
   * @param recalculateFaces If `true` (the default), the faces data will be recalculated.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  removeTileAt(
    tileX: number,
    tileY: number,
    replaceWithNull?: boolean,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Removes the tile at the given world coordinates in the specified layer and updates the layers collision information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldX The x coordinate, in pixels.
   * @param worldY The y coordinate, in pixels.
   * @param replaceWithNull If `true` (the default), this will replace the tile at the specified location with null instead of a Tile with an index of -1.
   * @param recalculateFaces If `true` (the default), the faces data will be recalculated.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  removeTileAtWorldXY(
    worldX: number,
    worldY: number,
    replaceWithNull?: boolean,
    recalculateFaces?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tile | null;

  /**
   * Draws a debug representation of the layer to the given Graphics object. This is helpful when you want to
   * get a quick idea of which of your tiles are colliding and which have interesting faces. The tiles
   * are drawn starting at (0, 0) in the Graphics, allowing you to place the debug representation
   * wherever you want on the screen.
   *
   * If no layer is specified, the maps current layer is used.
   *
   * **Note:** This method currently only works with orthogonal tilemap layers.
   * @param graphics The target Graphics object to draw upon.
   * @param styleConfig An object specifying the colors to use for the debug drawing.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  renderDebug(
    graphics: Phaser.GameObjects.Graphics,
    styleConfig?: Phaser.Types.Tilemaps.StyleConfig,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Draws a debug representation of all layers within this Tilemap to the given Graphics object.
   *
   * This is helpful when you want to get a quick idea of which of your tiles are colliding and which
   * have interesting faces. The tiles are drawn starting at (0, 0) in the Graphics, allowing you to
   * place the debug representation wherever you want on the screen.
   * @param graphics The target Graphics object to draw upon.
   * @param styleConfig An object specifying the colors to use for the debug drawing.
   */
  renderDebugFull(
    graphics: Phaser.GameObjects.Graphics,
    styleConfig?: Phaser.Types.Tilemaps.StyleConfig
  ): this;

  /**
   * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
   * `findIndex` and updates their index to match `newIndex`. This only modifies the index and does
   * not change collision information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param findIndex The index of the tile to search for.
   * @param newIndex The index of the tile to replace it with.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  replaceByIndex(
    findIndex: number,
    newIndex: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets collision on the given tile or tiles within a layer by index. You can pass in either a
   * single numeric index or an array of indexes: [2, 3, 15, 20]. The `collides` parameter controls if
   * collision will be enabled (true) or disabled (false).
   *
   * If no layer is specified, the maps current layer is used.
   * @param indexes Either a single tile index, or an array of tile indexes.
   * @param collides If true it will enable collision. If false it will clear collision.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update.
   * @param layer The tile layer to use. If not given the current layer is used.
   * @param updateLayer If true, updates the current tiles on the layer. Set to false if no tiles have been placed for significant performance boost. Default true.
   */
  setCollision(
    indexes: number | any[],
    collides?: boolean,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer,
    updateLayer?: boolean
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets collision on a range of tiles in a layer whose index is between the specified `start` and
   * `stop` (inclusive). Calling this with a start value of 10 and a stop value of 14 would set
   * collision for tiles 10, 11, 12, 13 and 14. The `collides` parameter controls if collision will be
   * enabled (true) or disabled (false).
   *
   * If no layer is specified, the maps current layer is used.
   * @param start The first index of the tile to be set for collision.
   * @param stop The last index of the tile to be set for collision.
   * @param collides If true it will enable collision. If false it will clear collision.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  setCollisionBetween(
    start: number,
    stop: number,
    collides?: boolean,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets collision on the tiles within a layer by checking tile properties. If a tile has a property
   * that matches the given properties object, its collision flag will be set. The `collides`
   * parameter controls if collision will be enabled (true) or disabled (false). Passing in
   * `{ collides: true }` would update the collision flag on any tiles with a "collides" property that
   * has a value of true. Any tile that doesn't have "collides" set to true will be ignored. You can
   * also use an array of values, e.g. `{ types: ["stone", "lava", "sand" ] }`. If a tile has a
   * "types" property that matches any of those values, its collision flag will be updated.
   *
   * If no layer is specified, the maps current layer is used.
   * @param properties An object with tile properties and corresponding values that should be checked.
   * @param collides If true it will enable collision. If false it will clear collision.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  setCollisionByProperty(
    properties: object,
    collides?: boolean,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets collision on all tiles in the given layer, except for tiles that have an index specified in
   * the given array. The `collides` parameter controls if collision will be enabled (true) or
   * disabled (false). Tile indexes not currently in the layer are not affected.
   *
   * If no layer is specified, the maps current layer is used.
   * @param indexes An array of the tile indexes to not be counted for collision.
   * @param collides If true it will enable collision. If false it will clear collision.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  setCollisionByExclusion(
    indexes: number[],
    collides?: boolean,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets collision on the tiles within a layer by checking each tiles collision group data
   * (typically defined in Tiled within the tileset collision editor). If any objects are found within
   * a tiles collision group, the tiles colliding information will be set. The `collides` parameter
   * controls if collision will be enabled (true) or disabled (false).
   *
   * If no layer is specified, the maps current layer is used.
   * @param collides If true it will enable collision. If false it will clear collision.
   * @param recalculateFaces Whether or not to recalculate the tile faces after the update.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  setCollisionFromCollisionGroup(
    collides?: boolean,
    recalculateFaces?: boolean,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets a global collision callback for the given tile index within the layer. This will affect all
   * tiles on this layer that have the same index. If a callback is already set for the tile index it
   * will be replaced. Set the callback to null to remove it. If you want to set a callback for a tile
   * at a specific location on the map then see `setTileLocationCallback`.
   *
   * If no layer is specified, the maps current layer is used.
   * @param indexes Either a single tile index, or an array of tile indexes to have a collision callback set for. All values should be integers.
   * @param callback The callback that will be invoked when the tile is collided with.
   * @param callbackContext The context under which the callback is called.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  setTileIndexCallback(
    indexes: number | number[],
    callback: Function,
    callbackContext: object,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets a collision callback for the given rectangular area (in tile coordinates) within the layer.
   * If a callback is already set for the tile index it will be replaced. Set the callback to null to
   * remove it.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param callback The callback that will be invoked when the tile is collided with.
   * @param callbackContext The context under which the callback is called.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  setTileLocationCallback(
    tileX: number,
    tileY: number,
    width: number,
    height: number,
    callback: Function,
    callbackContext?: object,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Sets the current layer to the LayerData associated with `layer`.
   * @param layer The name of the layer from Tiled, the index of the layer in the map or a TilemapLayer. If not given will default to the maps current layer index.
   */
  setLayer(layer?: string | number | Phaser.Tilemaps.TilemapLayer): this;

  /**
   * Sets the base tile size for the map. Note: this does not necessarily match the tileWidth and
   * tileHeight for all layers. This also updates the base size on all tiles across all layers.
   * @param tileWidth The width of the tiles the map uses for calculations.
   * @param tileHeight The height of the tiles the map uses for calculations.
   */
  setBaseTileSize(tileWidth: number, tileHeight: number): this;

  /**
   * Sets the tile size for a specific `layer`. Note: this does not necessarily match the maps
   * tileWidth and tileHeight for all layers. This will set the tile size for the layer and any
   * tiles the layer has.
   * @param tileWidth The width of the tiles (in pixels) in the layer.
   * @param tileHeight The height of the tiles (in pixels) in the layer.
   * @param layer The name of the layer from Tiled, the index of the layer in the map or a TilemapLayer. If not given will default to the maps current layer index.
   */
  setLayerTileSize(
    tileWidth: number,
    tileHeight: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): this;

  /**
   * Shuffles the tiles in a rectangular region (specified in tile coordinates) within the given
   * layer. It will only randomize the tiles in that area, so if they're all the same nothing will
   * appear to have changed! This method only modifies tile indexes and does not change collision
   * information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  shuffle(
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Scans the given rectangular area (given in tile coordinates) for tiles with an index matching
   * `indexA` and swaps then with `indexB`. This only modifies the index and does not change collision
   * information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileA First tile index.
   * @param tileB Second tile index.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  swapByIndex(
    tileA: number,
    tileB: number,
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Converts from tile X coordinates (tile units) to world X coordinates (pixels), factoring in the
   * layers position, scale and scroll.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  tileToWorldX(
    tileX: number,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): number | null;

  /**
   * Converts from tile Y coordinates (tile units) to world Y coordinates (pixels), factoring in the
   * layers position, scale and scroll.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  tileToWorldY(
    tileY: number,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): number | null;

  /**
   * Converts from tile XY coordinates (tile units) to world XY coordinates (pixels), factoring in the
   * layers position, scale and scroll. This will return a new Vector2 object or update the given
   * `point` object.
   *
   * If no layer is specified, the maps current layer is used.
   * @param tileX The x coordinate, in tiles, not pixels.
   * @param tileY The y coordinate, in tiles, not pixels.
   * @param vec2 A Vector2 to store the coordinates in. If not given a new Vector2 is created.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  tileToWorldXY(
    tileX: number,
    tileY: number,
    vec2?: Phaser.Math.Vector2,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Math.Vector2 | null;

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
   * The probability of any index being picked is (the indexs weight) / (sum of all weights). This
   * method only modifies tile indexes and does not change collision information.
   *
   * If no layer is specified, the maps current layer is used.
   * @param weightedIndexes An array of objects to randomly draw from during randomization. They should be in the form: { index: 0, weight: 4 } or { index: [0, 1], weight: 4 } if you wish to draw from multiple tile indexes.
   * @param tileX The left most tile index (in tile coordinates) to use as the origin of the area.
   * @param tileY The top most tile index (in tile coordinates) to use as the origin of the area.
   * @param width How many tiles wide from the `tileX` index the area will be.
   * @param height How many tiles tall from the `tileY` index the area will be.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  weightedRandomize(
    weightedIndexes: object[],
    tileX?: number,
    tileY?: number,
    width?: number,
    height?: number,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Tilemaps.Tilemap | null;

  /**
   * Converts from world X coordinates (pixels) to tile X coordinates (tile units), factoring in the
   * layers position, scale and scroll.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldX The x coordinate to be converted, in pixels, not tiles.
   * @param snapToFloor Whether or not to round the tile coordinate down to the nearest integer.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  worldToTileX(
    worldX: number,
    snapToFloor?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): number | null;

  /**
   * Converts from world Y coordinates (pixels) to tile Y coordinates (tile units), factoring in the
   * layers position, scale and scroll.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldY The y coordinate to be converted, in pixels, not tiles.
   * @param snapToFloor Whether or not to round the tile coordinate down to the nearest integer.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  worldToTileY(
    worldY: number,
    snapToFloor?: boolean,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): number | null;

  /**
   * Converts from world XY coordinates (pixels) to tile XY coordinates (tile units), factoring in the
   * layers position, scale and scroll. This will return a new Vector2 object or update the given
   * `point` object.
   *
   * If no layer is specified, the maps current layer is used.
   * @param worldX The x coordinate to be converted, in pixels, not tiles.
   * @param worldY The y coordinate to be converted, in pixels, not tiles.
   * @param snapToFloor Whether or not to round the tile coordinate down to the nearest integer.
   * @param vec2 A Vector2 to store the coordinates in. If not given a new Vector2 is created.
   * @param camera The Camera to use when calculating the tile index from the world values.
   * @param layer The tile layer to use. If not given the current layer is used.
   */
  worldToTileXY(
    worldX: number,
    worldY: number,
    snapToFloor?: boolean,
    vec2?: Phaser.Math.Vector2,
    camera?: Phaser.Cameras.Scene2D.Camera,
    layer?: string | number | Phaser.Tilemaps.TilemapLayer
  ): Phaser.Math.Vector2 | null;

  /**
   * Removes all layer data from this Tilemap and nulls the scene reference. This will destroy any
   * TilemapLayers that have been created.
   */
  destroy(): void;
}
