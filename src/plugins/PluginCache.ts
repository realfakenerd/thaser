import { CorePluginContainer, CustomPluginContainer } from '../types/plugins';

const corePlugins: Record<string, any> = {};
const customPlugins: Record<string, any> = {};

export default class PluginCache {
  /**
   * Static method called directly by the Core internal Plugins.
   * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
   * Plugin is the object to instantiate to create the plugin
   * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
   * @param key A reference used to get this plugin from the plugin cache.
   * @param plugin The plugin to be stored. Should be the core object, not instantiated.
   * @param mapping If this plugin is to be injected into the Scene Systems, this is the property key map used.
   * @param custom Core Scene plugin or a Custom Scene plugin? Default false.
   */
  static register(
    key: string,
    plugin: Function,
    mapping: string,
    custom = false
  ): void {
    corePlugins[key] = {
      plugin,
      mapping,
      custom
    };
  }

  /**
   * Stores a custom plugin in the global plugin cache.
   * The key must be unique, within the scope of the cache.
   * @param key A reference used to get this plugin from the plugin cache.
   * @param plugin The plugin to be stored. Should be the core object, not instantiated.
   * @param mapping If this plugin is to be injected into the Scene Systems, this is the property key map used.
   * @param data A value to be passed to the plugin's `init` method.
   */
  static registerCustom(
    key: string,
    plugin: Function,
    mapping: string,
    data: any
  ): void {
    customPlugins[key] = {
      plugin,
      mapping,
      data
    };
  }

  /**
   * Checks if the given key is already being used in the core plugin cache.
   * @param key The key to check for.
   */
  static hasCore(key: string): boolean {
    return corePlugins.hasOwnProperty(key);
  }

  /**
   * Checks if the given key is already being used in the custom plugin cache.
   * @param key The key to check for.
   */
  static hasCustom(key: string): boolean {
    return customPlugins.hasOwnProperty(key);
  }

  /**
   * Returns the core plugin object from the cache based on the given key.
   * @param key The key of the core plugin to get.
   */
  static getCore(key: string): CorePluginContainer {
    return corePlugins[key];
  }

  /**
   * Returns the custom plugin object from the cache based on the given key.
   * @param key The key of the custom plugin to get.
   */
  static getCustom(key: string): CustomPluginContainer {
    return customPlugins[key];
  }

  /**
   * Returns an object from the custom cache based on the given key that can be instantiated.
   * @param key The key of the custom plugin to get.
   */
  static getCustomClass(key: string): Function {
    return customPlugins.hasOwnProperty(key) ? customPlugins[key].plguin : null;
  }

  /**
   * Removes a core plugin based on the given key.
   * @param key The key of the core plugin to remove.
   */
  static remove(key: string): void {
    if (corePlugins.hasOwnProperty(key)) {
      delete corePlugins[key];
    }
  }

  /**
   * Removes a custom plugin based on the given key.
   * @param key The key of the custom plugin to remove.
   */
  static removeCustom(key: string): void {
    if (customPlugins.hasOwnProperty(key)) {
      delete customPlugins[key];
    }
  }

  /**
   * Removes all Core Plugins.
   *
   * This includes all of the internal system plugins that Phaser needs, like the Input Plugin and Loader Plugin.
   * So be sure you only call this if you do not wish to run Phaser again.
   */
  static destroyCorePlugins(): void {
    for (const key in corePlugins) {
      if (corePlugins.hasOwnProperty(key)) {
        delete corePlugins[key];
      }
    }
  }

  /**
   * Removes all Custom Plugins.
   */
  static destroyCustomPlugins(): void {
    for (const key in customPlugins) {
      if (customPlugins.hasOwnProperty(key)) {
        delete customPlugins[key];
      }
    }
  }
}
