import { EventEmitter } from 'eventemitter3';
import FileTypesManager from '../loader/FileTypesManager';
import { Scene } from '../scene';
import Systems from '../scene/Systems';
import { GlobalPlugin } from '../types/plugins';
import { GetFastValue, Remove } from '../utils';
import BasePlugin from './BasePlugin';
import PluginCache from './PluginCache';

interface EntryDef {
  key: string;
  plugin: Function;
  start: boolean;
  mapping: string;
  data: any;
}

/**
 * The PluginManager is responsible for installing and adding plugins to Phaser.
 *
 * It is a global system and therefore belongs to the Game instance, not a specific Scene.
 *
 * It works in conjunction with the PluginCache. Core internal plugins automatically register themselves
 * with the Cache, but it's the Plugin Manager that is responsible for injecting them into the Scenes.
 *
 * There are two types of plugin:
 *
 * 1. A Global Plugin
 * 2. A Scene Plugin
 *
 * A Global Plugin is a plugin that lives within the Plugin Manager rather than a Scene. You can get
 * access to it by calling `PluginManager.get` and providing a key. Any Scene that requests a plugin in
 * this way will all get access to the same plugin instance, allowing you to use a single plugin across
 * multiple Scenes.
 *
 * A Scene Plugin is a plugin dedicated to running within a Scene. These are different to Global Plugins
 * in that their instances do not live within the Plugin Manager, but within the Scene Systems class instead.
 * And that every Scene created is given its own unique instance of a Scene Plugin. Examples of core Scene
 * Plugins include the Input Plugin, the Tween Plugin and the physics Plugins.
 *
 * You can add a plugin to Phaser in three different ways:
 *
 * 1. Preload it
 * 2. Include it in your source code and install it via the Game Config
 * 3. Include it in your source code and install it within a Scene
 *
 * For examples of all of these approaches please see the Phaser 3 Examples Repo `plugins` folder.
 *
 * For information on creating your own plugin please see the Phaser 3 Plugin Template.
 */
export default class PluginManager extends EventEmitter {
  /**
   *
   * @param game The game instance that owns this Plugin Manager.
   */
  constructor(game: Game) {
    super();

    this.game = game;

    if (game.isBooted) {
      this.boot();
    } else {
      game.events.once(GameEvents.BOOT, this.boot, this);
    }
  }

  /**
   * The game instance that owns this Plugin Manager.
   */
  game: Game;

  /**
   * The global plugins currently running and managed by this Plugin Manager.
   * A plugin must have been started at least once in order to appear in this list.
   */
  plugins: GlobalPlugin[] = [];

  /**
   * A list of plugin keys that should be installed into Scenes as well as the Core Plugins.
   */
  scenePlugins: string[] = [];

  /**
   * A temporary list of plugins to install when the game has booted.
   */
  private _pendingGlobal: any[] = [];

  /**
   * A temporary list of scene plugins to install when the game has booted.
   */
  private _pendingScene: any[] = [];

  /**
   * Run once the game has booted and installs all of the plugins configured in the Game Config.
   */
  protected boot(): void {
    let i: number;
    let entry: EntryDef;
    let key: string;
    let plugin;
    let start;
    let mapping;
    let data;
    let config = this.game.config;

    let list = config.installGlobalPlugins;

    list = list.concat(this._pendingGlobal);

    for (i = 0; i < list.length; i++) {
      entry = list[i];

      key = GetFastValue(entry, 'key', null);
      plugin = GetFastValue(entry, 'plugin', null);
      start = GetFastValue(entry, 'start', false);
      mapping = GetFastValue(entry, 'mapping', null);
      data = GetFastValue(entry, 'data', null);
      if (key) {
        if (plugin) {
          this.install(key, plugin, start, mapping, data);
        } else {
          console.warn('Missing `plugin` for key: ' + key);
        }
      }
    }

    list = config.installScenePlugin;
    list = list.concat(this._pendingScene);

    for (i = 0; i < list.length; i++) {
      entry = list[i];

      key = GetFastValue(entry, 'key', null);
      plugin = GetFastValue(entry, 'plugin', null);
      mapping = GetFastValue(entry, 'mapping', null);

      if (key) {
        if (plugin) {
          this.installScenePlugin(key, plugin, mapping);
        } else {
          console.warn('Missing `plugin` for key: ' + key);
        }
      }
    }

    this._pendingGlobal = [];
    this._pendingScene = [];

    this.game.events.once(GameEvents.DESTROY, this.destroy, this);
  }

  /**
   * Called by the Scene Systems class. Tells the plugin manager to install all Scene plugins into it.
   *
   * First it will install global references, i.e. references from the Game systems into the Scene Systems (and Scene if mapped.)
   * Then it will install Core Scene Plugins followed by Scene Plugins registered with the PluginManager.
   * Finally it will install any references to Global Plugins that have a Scene mapping property into the Scene itself.
   * @param sys The Scene Systems class to install all the plugins in to.
   * @param globalPlugins An array of global plugins to install.
   * @param scenePlugins An array of scene plugins to install.
   */
  protected addToScene(
    sys: Systems,
    globalPlugins: any[],
    scenePlugins: any[]
  ): void {
    let i: number;
    let pluginKey: keyof Systems;
    let pluginList: any[];
    let game = this.game;
    let scene = sys.scene;
    let map = sys.settings.map;
    let isBooted = sys.settings.isBooted;

    for (i = 0; i < globalPlugins.length; i++) {
      pluginKey = globalPlugins[i];
      if (game[pluginKey]) {
        sys[pluginKey] = game[pluginKey];
        if (map.hasOwnProperty(pluginKey)) {
          scene[map[pluginKey] as keyof Scene] = sys[pluginKey];
        }
      } else if (pluginKey === 'game' && map.hasOwnProperty(pluginKey)) {
        scene[map[pluginKey] as keyof Scene] = game;
      }
    }

    for (let s = 0; s < scenePlugins.length; s++) {
      pluginList = scenePlugins[s];

      for (i = 0; i < pluginList.length; i++) {
        pluginKey = pluginList[i];

        if (!PluginCache.hasCore(pluginKey)) continue;

        const source = PluginCache.getCore(pluginKey);
        const mapKey = source.mapping!;
        const plugin: this = source.plugin(scene, this, mapKey);

        sys[mapKey as keyof Systems] = plugin;

        if (source.custom) {
          scene[mapKey as keyof Scene] = plugin;
        } else if (map.hasOwnProperty(mapKey)) {
          scene[map[mapKey] as keyof Scene] = plugin;
        }

        if (isBooted) {
          plugin.boot();
        }
      }
    }

    pluginList = this.plugins;

    for (i = 0; i < pluginList.length; i++) {
      const entry = pluginList[i];
      if (entry.mapping) {
        scene[entry.mapping as keyof Scene] = entry.plugin;
      }
    }
  }

  /**
   * Called by the Scene Systems class. Returns a list of plugins to be installed.
   */
  protected getDefaultScenePlugins(): string[] {
    let list = this.game.config.defaultPlugins as string[];
    list = list.concat(this.scenePlugins);
    return list;
  }

  /**
   * Installs a new Scene Plugin into the Plugin Manager and optionally adds it
   * to the given Scene as well. A Scene Plugin added to the manager in this way
   * will be automatically installed into all new Scenes using the key and mapping given.
   *
   * The `key` property is what the plugin is injected into Scene.Systems as.
   * The `mapping` property is optional, and if specified is what the plugin is installed into
   * the Scene as. For example:
   *
   * ```javascript
   * this.plugins.installScenePlugin('powerupsPlugin', pluginCode, 'powerups');
   *
   * // and from within the scene:
   * this.sys.powerupsPlugin; // key value
   * this.powerups; // mapping value
   * ```
   *
   * This method is called automatically by Phaser if you install your plugins using either the
   * Game Configuration object, or by preloading them via the Loader.
   * @param key The property key that will be used to add this plugin to Scene.Systems.
   * @param plugin The plugin code. This should be the non-instantiated version.
   * @param mapping If this plugin is injected into the Phaser.Scene class, this is the property key to use.
   * @param addToScene Optionally automatically add this plugin to the given Scene.
   * @param fromLoader Is this being called by the Loader? Default false.
   */
  installScenePlugin(
    key: string,
    plugin: new (...args: any) => this,
    mapping?: string,
    addToScene?: Scene,
    fromLoader = false
  ): void {
    if (typeof plugin !== 'function') {
      console.warn('Invalid Scene Plugin: ' + key);
      return;
    }

    if (!PluginCache.hasCore(key)) {
      PluginCache.register(key, plugin, mapping!, true);
    }

    if (this.scenePlugins.indexOf(key) === -1) {
      this.scenePlugins.push(key);
    } else if (!fromLoader && PluginCache.hasCore(key)) {
      console.warn(`Scene Plugin key in use: ${key}`);
      return;
    }

    if (addToScene) {
      const instance = new plugin(addToScene, this, key);
      addToScene.sys[key] = instance;

      if (mapping && mapping !== '') {
        addToScene[mapping as keyof Scene] = instance;
      }
      instance.boot();
    }
  }

  /**
   * Installs a new Global Plugin into the Plugin Manager and optionally starts it running.
   * A global plugin belongs to the Plugin Manager, rather than a specific Scene, and can be accessed
   * and used by all Scenes in your game.
   *
   * The `key` property is what you use to access this plugin from the Plugin Manager.
   *
   * ```javascript
   * this.plugins.install('powerupsPlugin', pluginCode);
   *
   * // and from within the scene:
   * this.plugins.get('powerupsPlugin');
   * ```
   *
   * This method is called automatically by Phaser if you install your plugins using either the
   * Game Configuration object, or by preloading them via the Loader.
   *
   * The same plugin can be installed multiple times into the Plugin Manager by simply giving each
   * instance its own unique key.
   * @param key The unique handle given to this plugin within the Plugin Manager.
   * @param plugin The plugin code. This should be the non-instantiated version.
   * @param start Automatically start the plugin running? This is always `true` if you provide a mapping value. Default false.
   * @param mapping If this plugin is injected into the Phaser.Scene class, this is the property key to use.
   * @param data A value passed to the plugin's `init` method.
   */
  install(
    key: string,
    plugin: Function,
    start: boolean = false,
    mapping: string | null = null,
    data: any = null
  ): BasePlugin | null {
    if (typeof plugin !== 'function') {
      console.warn('Invalid Plugin: ' + key);
      return null;
    }

    if (PluginCache.hasCustom(key)) {
      console.warn('Plugin key in use: ' + key);
      return null;
    }

    if (mapping !== null) {
      start = true;
    }

    if (!this.game.isBooted) {
      this._pendingGlobal.push({
        key,
        plugin,
        start,
        mapping,
        data
      });
    } else {
      PluginCache.registerCustom(key, plugin, mapping!, data);

      if (start) return this.start(key);
    }

    return null;
  }

  /**
   * Gets an index of a global plugin based on the given key.
   * @param key The unique plugin key.
   */
  protected getIndex(key: string): number {
    const list = this.plugins;

    let i = 0;
    const length = list.length;
    for (i; i < length; i++) {
      const entry = list[i];
      if (entry.key === key) return i;
    }

    return -1;
  }

  /**
   * Gets a global plugin based on the given key.
   * @param key The unique plugin key.
   */
  protected getEntry(key: string) {
    const idx = this.getIndex(key);
    if (idx !== -1) return this.plugins[idx] as GlobalPlugin;
  }

  /**
   * Checks if the given global plugin, based on its key, is active or not.
   * @param key The unique plugin key.
   */
  isActive(key: string): boolean {
    const entry = this.getEntry(key);
    return (entry && entry.active)!;
  }

  /**
   * Starts a global plugin running.
   *
   * If the plugin was previously active then calling `start` will reset it to an active state and then
   * call its `start` method.
   *
   * If the plugin has never been run before a new instance of it will be created within the Plugin Manager,
   * its active state set and then both of its `init` and `start` methods called, in that order.
   *
   * If the plugin is already running under the given key then nothing happens.
   * @param key The key of the plugin to start.
   * @param runAs Run the plugin under a new key. This allows you to run one plugin multiple times.
   */
  start(key: string, runAs: string = key): BasePlugin {
    let entry = this.getEntry(runAs);

    if (entry && !entry.active) {
      entry.active = true;
      (entry.plugin as any).start();
    } else if (!entry) {
      // @ts-ignore
      entry = this.createEntry(key, runAs);
    }

    return entry ? entry.plugin : (null as any);
  }

  /**
   * Creates a new instance of a global plugin, adds an entry into the plugins array and returns it.
   * @param key - The key of the plugin to create an instance of.
   * @param runAs - Run the plugin under a new key. This allows you to run one plugin multiple times.
   * @return The plugin that was started, or `null` if invalid key given.
   */
  private createEntry(key: string, runAs = key): BasePlugin {
    let entry = PluginCache.getCustom(key);

    if (entry) {
      const instance = new (entry.plugin as any)(this) as any;

      entry = {
        key: runAs,
        plugin: instance,
        // @ts-ignore
        active: true,
        mapping: (entry as any).mapping,
        data: (entry as any).data
      };

      this.plugins.push(entry);

      instance.init((entry as any).data);
      instance.start();
    }

    return entry as any;
  }

  /**
   * Stops a global plugin from running.
   *
   * If the plugin is active then its active state will be set to false and the plugins `stop` method
   * will be called.
   *
   * If the plugin is not already running, nothing will happen.
   * @param key The key of the plugin to stop.
   */
  stop(key: string): this {
    const entry = this.getEntry(key);
    if (entry && entry.active) {
      entry.active = false;
      (entry.plugin as any).stop();
    }

    return this;
  }

  /**
   * Gets a global plugin from the Plugin Manager based on the given key and returns it.
   *
   * If it cannot find an active plugin based on the key, but there is one in the Plugin Cache with the same key,
   * then it will create a new instance of the cached plugin and return that.
   * @param key The key of the plugin to get.
   * @param autoStart Automatically start a new instance of the plugin if found in the cache, but not actively running. Default true.
   */
  get(key: string, autoStart = true): BasePlugin | Function {
    let entry = this.getEntry(key);
    if (entry) return entry.plugin;
    else {
      const plugin = this.getClass(key);
      if (plugin && autoStart) {
        // @ts-ignore
        entry = this.createEntry(key, key);
        return entry ? entry.plugin : (null as any);
      } else if (plugin) return plugin;
    }

    return null as any;
  }

  /**
   * Returns the plugin class from the cache.
   * Used internally by the Plugin Manager.
   * @param key The key of the plugin to get.
   */
  getClass(key: string): BasePlugin {
    return PluginCache.getCustomClass(key) as any;
  }

  /**
   * Removes a global plugin from the Plugin Manager and Plugin Cache.
   *
   * It is up to you to remove all references to this plugin that you may hold within your game code.
   * @param key The key of the plugin to remove.
   */
  removeGlobalPlugin(key: string): void {
    const entry = this.getEntry(key);
    if (entry) {
      Remove(this.plugins, entry);
    }

    PluginCache.removeCustom(key);
  }

  /**
   * Removes a scene plugin from the Plugin Manager and Plugin Cache.
   *
   * This will not remove the plugin from any active Scenes that are already using it.
   *
   * It is up to you to remove all references to this plugin that you may hold within your game code.
   * @param key The key of the plugin to remove.
   */
  removeScenePlugin(key: string): void {
    Remove(this.scenePlugins, key);
    PluginCache.remove(key);
  }

  /**
   * Registers a new type of Game Object with the global Game Object Factory and / or Creator.
   * This is usually called from within your Plugin code and is a helpful short-cut for creating
   * new Game Objects.
   *
   * The key is the property that will be injected into the factories and used to create the
   * Game Object. For example:
   *
   * ```javascript
   * this.plugins.registerGameObject('clown', clownFactoryCallback, clownCreatorCallback);
   * // later in your game code:
   * this.add.clown();
   * this.make.clown();
   * ```
   *
   * The callbacks are what are called when the factories try to create a Game Object
   * matching the given key. It's important to understand that the callbacks are invoked within
   * the context of the GameObjectFactory. In this context there are several properties available
   * to use:
   *
   * this.scene - A reference to the Scene that owns the GameObjectFactory.
   * this.displayList - A reference to the Display List the Scene owns.
   * this.updateList - A reference to the Update List the Scene owns.
   *
   * See the GameObjectFactory and GameObjectCreator classes for more details.
   * Any public property or method listed is available from your callbacks under `this`.
   * @param key The key of the Game Object that the given callbacks will create, i.e. `image`, `sprite`.
   * @param factoryCallback The callback to invoke when the Game Object Factory is called.
   * @param creatorCallback The callback to invoke when the Game Object Creator is called.
   */
  registerGameObject(
    key: string,
    factoryCallback?: Function,
    creatorCallback?: Function
  ) {
    if (factoryCallback) {
      GameObjectFactory.register(key, factoryCallback);
    }

    if (creatorCallback) {
      GameObjectCreator.register(key, creatorCallback);
    }

    return this;
  }

  /**
   * Removes a previously registered Game Object from the global Game Object Factory and / or Creator.
   * This is usually called from within your Plugin destruction code to help clean-up after your plugin has been removed.
   * @param key The key of the Game Object to be removed from the factories.
   * @param removeFromFactory Should the Game Object be removed from the Game Object Factory? Default true.
   * @param removeFromCreator Should the Game Object be removed from the Game Object Creator? Default true.
   */
  removeGameObject(
    key: string,
    removeFromFactory = true,
    removeFromCreator = true
  ) {
    if (removeFromFactory) {
      GameObjectFactory.remove(key);
    }

    if (removeFromCreator) {
      GameObjectCreator.remove(key);
    }

    return this;
  }

  /**
   * Registers a new file type with the global File Types Manager, making it available to all Loader
   * Plugins created after this.
   *
   * This is usually called from within your Plugin code and is a helpful short-cut for creating
   * new loader file types.
   *
   * The key is the property that will be injected into the Loader Plugin and used to load the
   * files. For example:
   *
   * ```javascript
   * this.plugins.registerFileType('wad', doomWadLoaderCallback);
   * // later in your preload code:
   * this.load.wad();
   * ```
   *
   * The callback is what is called when the loader tries to load a file  matching the given key.
   * It's important to understand that the callback is invoked within
   * the context of the LoaderPlugin. In this context there are several properties / methods available
   * to use:
   *
   * this.addFile - A method to add the new file to the load queue.
   * this.scene - The Scene that owns the Loader Plugin instance.
   *
   * See the LoaderPlugin class for more details. Any public property or method listed is available from
   * your callback under `this`.
   * @param key The key of the Game Object that the given callbacks will create, i.e. `image`, `sprite`.
   * @param callback The callback to invoke when the Game Object Factory is called.
   * @param addToScene Optionally add this file type into the Loader Plugin owned by the given Scene.
   */
  registerFileType(key: string, callback: Function, addToScene?: Scene): void {
    FileTypesManager.register(key, callback);
    if (addToScene && addToScene.sys.load) {
      addToScene.sys.load[key] = callback;
    }
  }

  /**
   * Destroys this Plugin Manager and all associated plugins.
   * It will iterate all plugins found and call their `destroy` methods.
   *
   * The PluginCache will remove all custom plugins.
   */
  destroy(): void {
    for (var i = 0; i < this.plugins.length; i++) {
      (this.plugins[i].plugin as any).destroy();
    }

    PluginCache.destroyCustomPlugins();

    if (this.game.noReturn) {
      PluginCache.destroyCorePlugins();
    }

    this.game = null;
    this.plugins = [];
    this.scenePlugins = [];
  }
}
