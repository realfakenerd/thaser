import { DataManager } from '@thaser/data';
import { Scene, Events as SceneEvents } from '@thaser/scene';
import { EventEmitter } from 'eventemitter3';
import Events from './events';

/**
 * The base class that all Game Objects extend.
 * You don't create GameObjects directly and they cannot be added to the display list.
 * Instead, use them as the base for your own custom classes.
 */
export default class GameObject extends EventEmitter {
  /**
   *
   * @param scene The Scene to which this Game Object belongs.
   * @param type A textual representation of the type of Game Object, i.e. `sprite`.
   */
  constructor(scene: Scene, type: string) {
    super();
    this.scene = scene;
    this.type = type;

    this.on(Events.ADDED_TO_SCENE, this.addedToScene, this);
    this.on(Events.REMOVED_FROM_SCENE, this.removedFromScene, this);
    scene.sys.queueDepthSort();
  }

  /**
   * A reference to the Scene to which this Game Object belongs.
   *
   * Game Objects can only belong to one Scene.
   *
   * You should consider this property as being read-only. You cannot move a
   * Game Object to another Scene by simply changing it.
   */
  scene: Scene;

  /**
   * Holds a reference to the Display List that contains this Game Object.
   *
   * This is set automatically when this Game Object is added to a Scene or Layer.
   *
   * You should treat this property as being read-only.
   */
  displayList: DisplayList | Layer = null as any;

  /**
   * A textual representation of this Game Object, i.e. `sprite`.
   * Used internally by Phaser but is available for your own custom classes to populate.
   */
  type: string;

  /**
   * The current state of this Game Object.
   *
   * Phaser itself will never modify this value, although plugins may do so.
   *
   * Use this property to track the state of a Game Object during its lifetime. For example, it could change from
   * a state of 'moving', to 'attacking', to 'dead'. The state value should be an integer (ideally mapped to a constant
   * in your game code), or a string. These are recommended to keep it light and simple, with fast comparisons.
   * If you need to store complex data about your Game Object, look at using the Data Component instead.
   */
  state: number | string = 0;

  /**
   * The parent Container of this Game Object, if it has one.
   */
  parentContainer: Container = null as any;

  /**
   * The name of this Game Object.
   * Empty by default and never populated by Phaser, this is left for developers to use.
   */
  name: string = '';

  /**
   * The active state of this Game Object.
   * A Game Object with an active state of `true` is processed by the Scenes UpdateList, if added to it.
   * An active object is one which is having its logic and internal systems updated.
   */
  active = true;

  /**
   * The Tab Index of the Game Object.
   * Reserved for future use by plugins and the Input Manager.
   */
  tabIndex = -1;

  /**
   * A Data Manager.
   * It allows you to store, query and get key/value paired information specific to this Game Object.
   * `null` by default. Automatically created if you use `getData` or `setData` or `setDataEnabled`.
   */
  data: DataManager = null as any;

  /**
   * The flags that are compared against `RENDER_MASK` to determine if this Game Object will render or not.
   * The bits are 0001 | 0010 | 0100 | 1000 set by the components Visible, Alpha, Transform and Texture respectively.
   * If those components are not used by your custom class then you can use this bitmask as you wish.
   */
  renderFlags = 15;

  /**
   * A bitmask that controls if this Game Object is drawn by a Camera or not.
   * Not usually set directly, instead call `Camera.ignore`, however you can
   * set this property directly using the Camera.id property:
   */
  cameraFilter = 0;

  /**
   * If this Game Object is enabled for input then this property will contain an InteractiveObject instance.
   * Not usually set directly. Instead call `GameObject.setInteractive()`.
   */
  input: InteractiveObject = null as any;

  /**
   * If this Game Object is enabled for Arcade or Matter Physics then this property will contain a reference to a Physics Body.
   */
  body: Body | StaticBody | BodyType = null as any;

  /**
   * This Game Object will ignore all calls made to its destroy method if this flag is set to `true`.
   * This includes calls that may come from a Group, Container or the Scene itself.
   * While it allows you to persist a Game Object across Scenes, please understand you are entirely
   * responsible for managing references to and from this Game Object.
   */
  ignoreDestroy = false;

  /**
   * Sets the `active` property of this Game Object and returns this Game Object for further chaining.
   * A Game Object with its `active` property set to `true` will be updated by the Scenes UpdateList.
   * @param value True if this Game Object should be set as active, false if not.
   */
  setActive(value: boolean): this {
    this.active = value;
    return this;
  }

  /**
   * Sets the `name` property of this Game Object and returns this Game Object for further chaining.
   * The `name` property is not populated by Phaser and is presented for your own use.
   * @param value The name to be given to this Game Object.
   */
  setName(value: string): this {
    this.name = value;
    return this;
  }

  /**
   * Sets the current state of this Game Object.
   *
   * Phaser itself will never modify the State of a Game Object, although plugins may do so.
   *
   * For example, a Game Object could change from a state of 'moving', to 'attacking', to 'dead'.
   * The state value should typically be an integer (ideally mapped to a constant
   * in your game code), but could also be a string. It is recommended to keep it light and simple.
   * If you need to store complex data about your Game Object, look at using the Data Component instead.
   * @param value The state of the Game Object.
   */
  setState(value: number | string): this {
    this.state = value;
    return this;
  }

  /**
   * Adds a Data Manager component to this Game Object.
   */
  setDataEnabled(): this {
    if (!this.data) {
      this.data = new DataManager(this);
    }
    return this;
  }

  /**
   * Allows you to store a key value pair within this Game Objects Data Manager.
   *
   * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
   * before setting the value.
   *
   * If the key doesn't already exist in the Data Manager then it is created.
   *
   * ```javascript
   * sprite.setData('name', 'Red Gem Stone');
   * ```
   *
   * You can also pass in an object of key value pairs as the first argument:
   *
   * ```javascript
   * sprite.setData({ name: 'Red Gem Stone', level: 2, owner: 'Link', gold: 50 });
   * ```
   *
   * To get a value back again you can call `getData`:
   *
   * ```javascript
   * sprite.getData('gold');
   * ```
   *
   * Or you can access the value directly via the `values` property, where it works like any other variable:
   *
   * ```javascript
   * sprite.data.values.gold += 50;
   * ```
   *
   * When the value is first set, a `setdata` event is emitted from this Game Object.
   *
   * If the key already exists, a `changedata` event is emitted instead, along an event named after the key.
   * For example, if you updated an existing key called `PlayerLives` then it would emit the event `changedata-PlayerLives`.
   * These events will be emitted regardless if you use this method to set the value, or the direct `values` setter.
   *
   * Please note that the data keys are case-sensitive and must be valid JavaScript Object property strings.
   * This means the keys `gold` and `Gold` are treated as two unique values within the Data Manager.
   * @param key The key to set the value for. Or an object of key value pairs. If an object the `data` argument is ignored.
   * @param data The value to set for the given key. If an object is provided as the key this argument is ignored.
   */
  setData(key: string | object, data?: any): this {
    if (!this.data) {
      this.data = new DataManager(this);
    }
    this.data.set(key, data);
    return this;
  }

  /**
   * Increase a value for the given key within this Game Objects Data Manager. If the key doesn't already exist in the Data Manager then it is increased from 0.
   *
   * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
   * before setting the value.
   *
   * If the key doesn't already exist in the Data Manager then it is created.
   *
   * When the value is first set, a `setdata` event is emitted from this Game Object.
   * @param key The key to increase the value for.
   * @param data The value to increase for the given key.
   */
  incData(key: string | object, data?: any): this {
    if (!this.data) {
      this.data = new DataManager(this);
    }
    this.data.inc(key, data);
    return this;
  }

  /**
   * Toggle a boolean value for the given key within this Game Objects Data Manager. If the key doesn't already exist in the Data Manager then it is toggled from false.
   *
   * If the Game Object has not been enabled for data (via `setDataEnabled`) then it will be enabled
   * before setting the value.
   *
   * If the key doesn't already exist in the Data Manager then it is created.
   *
   * When the value is first set, a `setdata` event is emitted from this Game Object.
   * @param key The key to toggle the value for.
   */
  toggleData(key: string | object): this {
    if (!this.data) {
      this.data = new DataManager(this);
    }
    this.data.toggle(key);
    return this;
  }

  /**
   * Retrieves the value for the given key in this Game Objects Data Manager, or undefined if it doesn't exist.
   *
   * You can also access values via the `values` object. For example, if you had a key called `gold` you can do either:
   *
   * ```javascript
   * sprite.getData('gold');
   * ```
   *
   * Or access the value directly:
   *
   * ```javascript
   * sprite.data.values.gold;
   * ```
   *
   * You can also pass in an array of keys, in which case an array of values will be returned:
   *
   * ```javascript
   * sprite.getData([ 'gold', 'armor', 'health' ]);
   * ```
   *
   * This approach is useful for destructuring arrays in ES6.
   * @param key The key of the value to retrieve, or an array of keys.
   */
  getData(key: string | string[]): any {
    if (!this.data) {
      this.data = new DataManager(this);
    }
    return this.data.get(key);
  }

  /**
   * Pass this Game Object to the Input Manager to enable it for Input.
   *
   * Input works by using hit areas, these are nearly always geometric shapes, such as rectangles or circles, that act as the hit area
   * for the Game Object. However, you can provide your own hit area shape and callback, should you wish to handle some more advanced
   * input detection.
   *
   * If no arguments are provided it will try and create a rectangle hit area based on the texture frame the Game Object is using. If
   * this isn't a texture-bound object, such as a Graphics or BitmapText object, this will fail, and you'll need to provide a specific
   * shape for it to use.
   *
   * You can also provide an Input Configuration Object as the only argument to this method.
   * @param hitArea Either an input configuration object, or a geometric shape that defines the hit area for the Game Object. If not given it will try to create a Rectangle based on the texture frame.
   * @param callback The callback that determines if the pointer is within the Hit Area shape or not. If you provide a shape you must also provide a callback.
   * @param dropZone Should this Game Object be treated as a drop zone target? Default false.
   */
  setInteractive(
    hitArea?: InputConfiguration | any,
    callback?: HitAreaCallback,
    dropZone?: boolean
  ): this {
    this.scene.sys.input.enable(this, hitArea, callback, dropZone);
    return this;
  }

  /**
   * If this Game Object has previously been enabled for input, this will disable it.
   *
   * An object that is disabled for input stops processing or being considered for
   * input events, but can be turned back on again at any time by simply calling
   * `setInteractive()` with no arguments provided.
   *
   * If want to completely remove interaction from this Game Object then use `removeInteractive` instead.
   */
  disableInteractive(): this {
    this.scene.sys.input.disable(this);
    return this;
  }

  /**
   * If this Game Object has previously been enabled for input, this will queue it
   * for removal, causing it to no longer be interactive. The removal happens on
   * the next game step, it is not immediate.
   *
   * The Interactive Object that was assigned to this Game Object will be destroyed,
   * removed from the Input Manager and cleared from this Game Object.
   *
   * If you wish to re-enable this Game Object at a later date you will need to
   * re-create its InteractiveObject by calling `setInteractive` again.
   *
   * If you wish to only temporarily stop an object from receiving input then use
   * `disableInteractive` instead, as that toggles the interactive state, where-as
   * this erases it completely.
   *
   * If you wish to resize a hit area, don't remove and then set it as being
   * interactive. Instead, access the hitarea object directly and resize the shape
   * being used. I.e.: `sprite.input.hitArea.setSize(width, height)` (assuming the
   * shape is a Rectangle, which it is by default.)
   */
  removeInteractive(): this {
    this.scene.sys.input.clear(this);
    this.input = undefined as any;
    return this;
  }

  /**
   * This callback is invoked when this Game Object is added to a Scene.
   *
   * Can be overriden by custom Game Objects, but be aware of some Game Objects that
   * will use this, such as Sprites, to add themselves into the Update List.
   *
   * You can also listen for the `ADDED_TO_SCENE` event from this Game Object.
   */
  addedToScene(): void {}

  /**
   * This callback is invoked when this Game Object is removed from a Scene.
   *
   * Can be overriden by custom Game Objects, but be aware of some Game Objects that
   * will use this, such as Sprites, to removed themselves from the Update List.
   *
   * You can also listen for the `REMOVED_FROM_SCENE` event from this Game Object.
   */
  removedFromScene(): void {}

  /**
   * To be overridden by custom GameObjects. Allows base objects to be used in a Pool.
   * @param args args
   */
  update(...args: any[]): void {}

  /**
   * Returns a JSON representation of the Game Object.
   */
  toJSON(): JSONGameObject {
    return ComponentsToJSON(this);
  }

  /**
   * Compares the renderMask with the renderFlags to see if this Game Object will render or not.
   * Also checks the Game Object against the given Cameras exclusion list.
   * @param camera The Camera to check against this Game Object.
   */
  willRender(camera: Camera): boolean {
    const listWillRender =
      this.displayList && this.displayList.active
        ? this.displayList.willRender(camera)
        : true;

    return !(
      !listWillRender ||
      GameObject.RENDER_MASK !== this.renderFlags ||
      (this.cameraFilter !== 0 && this.cameraFilter & camera.id)
    );
  }

  /**
   * Returns an array containing the display list index of either this Game Object, or if it has one,
   * its parent Container. It then iterates up through all of the parent containers until it hits the
   * root of the display list (which is index 0 in the returned array).
   *
   * Used internally by the InputPlugin but also useful if you wish to find out the display depth of
   * this Game Object and all of its ancestors.
   */
  getIndexList(): number[] {
    let child = this;
    let parent = this.parentContainer;

    const indexes = [];

    while (parent) {
      indexes.unshift(parent.getIndex(child));
      child = parent;
      if (!parent.parentContainer) {
        break;
      } else {
        parent = parent.parentContainer;
      }
    }
    if (this.displayList) {
      indexes.unshift(this.displayList.getIndex(child));
    } else {
      indexes.unshift(this.scene.sys.displayList.getIndex(child));
    }
    return indexes;
  }

  /**
   * Adds this Game Object to the given Display List.
   *
   * If no Display List is specified, it will default to the Display List owned by the Scene to which
   * this Game Object belongs.
   *
   * A Game Object can only exist on one Display List at any given time, but may move freely between them.
   *
   * If this Game Object is already on another Display List when this method is called, it will first
   * be removed from it, before being added to the new list.
   *
   * You can query which list it is on by looking at the `Phaser.GameObjects.GameObject#displayList` property.
   *
   * If a Game Object isn't on any display list, it will not be rendered. If you just wish to temporarly
   * disable it from rendering, consider using the `setVisible` method, instead.
   * @param displayList The Display List to add to. Defaults to the Scene Display List.
   */
  addToDisplayList(
    displayList: DisplayList | Layer = this.scene.sys.displayList
  ): this {
    if (this.displayList && this.displayList !== displayList) {
      this.removeFromDisplayList();
    }
    if (!displayList.exists(this)) {
      this.displayList = displayList;
      displayList.add(this, true);
      displayList.queueDepthSort();
      this.emit(Events.ADDED_TO_SCENE, this, this.scene);
      displayList.events.emit(SceneEvents.ADDED_TO_SCENE, this, this.scene);
    }

    return this;
  }

  /**
   * Adds this Game Object to the Update List belonging to the Scene.
   *
   * When a Game Object is added to the Update List it will have its `preUpdate` method called
   * every game frame. This method is passed two parameters: `delta` and `time`.
   *
   * If you wish to run your own logic within `preUpdate` then you should always call
   * `preUpdate.super(delta, time)` within it, or it may fail to process required operations,
   * such as Sprite animations.
   */
  addToUpdateList(): this {
    if (this.scene && this.preUpdate) {
      this.scene.sys.updateList.add(this);
    }
    return this;
  }

  /**
   * Removes this Game Object from the Display List it is currently on.
   *
   * A Game Object can only exist on one Display List at any given time, but may move freely removed
   * and added back at a later stage.
   *
   * You can query which list it is on by looking at the `Phaser.GameObjects.GameObject#displayList` property.
   *
   * If a Game Object isn't on any Display List, it will not be rendered. If you just wish to temporarly
   * disable it from rendering, consider using the `setVisible` method, instead.
   */
  removeFromDisplayList(): this {
    const displayList = this.displayList || this.scene.sys.displayList;
    if (displayList.exists(this)) {
      displayList.remove(this, true);
      displayList.queueDepthSort();
      this.displayList = null;
      this.emit(Events.REMOVED_FROM_SCENE, this, this.scene);
      displayList.events.emit(SceneEvents.REMOVED_FROM_SCENE, this, this.scene);
    }
    return this;
  }

  /**
   * Removes this Game Object from the Scene's Update List.
   *
   * When a Game Object is on the Update List, it will have its `preUpdate` method called
   * every game frame. Calling this method will remove it from the list, preventing this.
   *
   * Removing a Game Object from the Update List will stop most internal functions working.
   * For example, removing a Sprite from the Update List will prevent it from being able to
   * run animations.
   */
  removeFromUpdateList(): this {
    if (this.scene && this.preUpdate) {
      this.scene.sys.updateList.remove(this);
    }
    return this;
  }

  /**
   * Destroys this Game Object removing it from the Display List and Update List and
   * severing all ties to parent resources.
   *
   * Also removes itself from the Input Manager and Physics Manager if previously enabled.
   *
   * Use this to remove a Game Object from your game if you don't ever plan to use it again.
   * As long as no reference to it exists within your own code it should become free for
   * garbage collection by the browser.
   *
   * If you just want to temporarily disable an object then look at using the
   * Game Object Pool instead of destroying it, as destroyed objects cannot be resurrected.
   * @param fromScene `True` if this Game Object is being destroyed by the Scene, `false` if not. Default false.
   */
  destroy(fromScene?: boolean): void {
    if (!this.scene || this.ignoreDestroy) {
      return;
    }

    if (fromScene === undefined) {
      fromScene = false;
    }

    if (this.preDestroy) {
      this.preDestroy.call(this);
    }

    this.emit(Events.DESTROY, this, fromScene);

    this.removeAllListeners();

    if (this.postPipelines) {
      this.resetPostPipeline(true);
    }
    this.removeFromDisplayList();
    this.removeFromUpdateList();
    if (this.input) {
      this.scene.sys.input.clear(this);
      this.input = undefined as any;
    }
    if (this.data) {
      this.data.destroy();
      this.data = undefined as any;
    }
    if (this.body) {
      this.body.destroy();
      this.body = undefined;
    }
    this.active = false;
    this.visible = false;
    this.scene = undefined as any;
    this.parentContainer = undefined;
  }

  /**
   * The bitmask that `GameObject.renderFlags` is compared against to determine if the Game Object will render or not.
   */
  static readonly RENDER_MASK = 15;
}
