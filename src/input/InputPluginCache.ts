import { GetValue } from '../utils';

interface InputPluginValues {
  key?: string;
  plugin?: Function;
  mapping?: string;
  settingsKey?: string;
  configKey?: string;
}

const inputPlugins: Record<string, InputPluginValues> = {};

export default class InputPluginCache {
  /**
   * Static method called directly by the Core internal Plugins.
   * Key is a reference used to get the plugin from the plugins object (i.e. InputPlugin)
   * Plugin is the object to instantiate to create the plugin
   * Mapping is what the plugin is injected into the Scene.Systems as (i.e. input)
   * @param key A reference used to get this plugin from the plugin cache.
   * @param plugin The plugin to be stored. Should be the core object, not instantiated.
   * @param mapping If this plugin is to be injected into the Input Plugin, this is the property key used.
   * @param settingsKey The key in the Scene Settings to check to see if this plugin should install or not.
   * @param configKey The key in the Game Config to check to see if this plugin should install or not.
   */
  static register(
    key: string,
    plugin: Function,
    mapping: string,
    settingsKey: string,
    configKey: string
  ): void {
    inputPlugins[key] = {
      plugin,
      mapping,
      settingsKey,
      configKey
    };
  }

  /**
   * Returns the input plugin object from the cache based on the given key.
   * @param key The key of the input plugin to get.
   */
  static getPlugin(key: string): InputPluginContainer {
    return inputPlugins[key] as any;
  }

  /**
   * Installs all of the registered Input Plugins into the given target.
   * @param target The target InputPlugin to install the plugins into.
   */
  static install(target: InputPlugin): void {
    const sys = target.scene.sys;
    const settings = sys.settings.input;
    const config = sys.game.config;
    for (const key in inputPlugins) {
      const source = inputPlugins[key].plugin as any;
      const mapping = inputPlugins[key].mapping;
      const settingsKey = inputPlugins[key].settingsKey;
      const configKey = inputPlugins[key].configKey;

      if (GetValue(settings, settingsKey!, config[configKey])) {
        target[mapping] = new source(target);
      }
    }
  }

  /**
   * Removes an input plugin based on the given key.
   * @param key The key of the input plugin to remove.
   */
  static remove(key: string): void {
    if (inputPlugins.hasOwnProperty(key)) {
      delete inputPlugins[key];
    }
  }
}
