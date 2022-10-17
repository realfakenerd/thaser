/**
 * A Phaser Input Event Data object.
 *
 * This object is passed to the registered event listeners and allows you to stop any further propagation.
 */
interface EventData {
  /**
   * The cancelled state of this Event.
   */
  cancelled?: boolean;
  /**
   * Call this method to stop this event from passing any further down the event chain.
   */
  stopPropagation: Function;
}

type HitAreaCallback = (
  hitArea: any,
  x: number,
  y: number,
  gameObject: GameObject
) => void;

interface InputConfiguration {
  /**
   * The object / shape to use as the Hit Area. If not given it will try to create a Rectangle based on the texture frame.
   */
  hitArea?: any;
  /**
   * The callback that determines if the pointer is within the Hit Area shape or not.
   */
  hitAreaCallback?: HitAreaCallback;
  /**
   * If `true` the Interactive Object will be set to be draggable and emit drag events.
   */
  draggable?: boolean;
  /**
   * If `true` the Interactive Object will be set to be a drop zone for draggable objects.
   */
  dropZone?: boolean;
  /**
   * If `true` the Interactive Object will set the `pointer` hand cursor when a pointer is over it. This is a short-cut for setting `cursor: 'pointer'`.
   */
  useHandCursor?: boolean;
  /**
   * The CSS string to be used when the cursor is over this Interactive Object.
   */
  cursor?: string;
  /**
   * If `true` the a pixel perfect function will be set for the hit area callback. Only works with image texture based Game Objects, not Render Textures.
   */
  pixelPerfect?: boolean;
  /**
   * If `pixelPerfect` is set, this is the alpha tolerance threshold value used in the callback.
   */
  alphaTolerance?: number;
}

interface InputPluginContainer {
  /**
   * The unique name of this plugin in the input plugin cache.
   */
  key: string;
  /**
   * The plugin to be stored. Should be the source object, not instantiated.
   */
  plugin: Function;
  /**
   * If this plugin is to be injected into the Input Plugin, this is the property key map used.
   */
  mapping?: string;
}

interface InteractiveObject {
  /**
   * The Game Object to which this Interactive Object is bound.
   */
  gameObject: GameObject;
  /**
   * Is this Interactive Object currently enabled for input events?
   */
  enabled: boolean;
  /**
   * An Interactive Object that is 'always enabled' will receive input even if the parent object is invisible or won't render.
   */
  alwaysEnabled: boolean;
  /**
   * Is this Interactive Object draggable? Enable with `InputPlugin.setDraggable`.
   */
  draggable: boolean;
  /**
   * Is this Interactive Object a drag-targets drop zone? Set when the object is created.
   */
  dropZone: boolean;
  /**
   * Should this Interactive Object change the cursor (via css) when over? (desktop only)
   */
  cursor: boolean | string;
  /**
   * An optional drop target for a draggable Interactive Object.
   */
  target: GameObject;
  /**
   * The most recent Camera to be tested against this Interactive Object.
   */
  camera: Camera;
  /**
   * The hit area for this Interactive Object. Typically a geometry shape, like a Rectangle or Circle.
   */
  hitArea: any;
  /**
   * The 'contains' check callback that the hit area shape will use for all hit tests.
   */
  hitAreaCallback: HitAreaCallback;
  /**
   * If this Interactive Object has been enabled for debug, via `InputPlugin.enableDebug` then this property holds its debug shape.
   */
  hitAreaDebug: Shape;
  /**
   * Was the hitArea for this Interactive Object created based on texture size (false), or a custom shape? (true)
   */
  customHitArea: boolean;
  /**
   * The x coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
   */
  localX: number;
  /**
   * The y coordinate that the Pointer interacted with this object on, relative to the Game Object's top-left position.
   */
  localY: number;
  /**
   * The current drag state of this Interactive Object. 0 = Not being dragged, 1 = being checked for drag, or 2 = being actively dragged.
   */
  dragState: 0 | 1 | 2;
  /**
   * The x coordinate of the Game Object that owns this Interactive Object when the drag started.
   */
  dragStartX: number;
  /**
   * The y coordinate of the Game Object that owns this Interactive Object when the drag started.
   */
  dragStartY: number;
  /**
   * The x coordinate that the Pointer started dragging this Interactive Object from.
   */
  dragStartXGlobal: number;
  /**
   * The y coordinate that the Pointer started dragging this Interactive Object from.
   */
  dragStartYGlobal: number;
  /**
   * The x coordinate that this Interactive Object is currently being dragged to.
   */
  dragX: number;
  /**
   * The y coordinate that this Interactive Object is currently being dragged to.
   */
  dragY: number;
}
