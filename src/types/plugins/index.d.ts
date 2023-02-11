export interface CorePluginContainer {
  /**
   * The unique name of this plugin in the core plugin cache.
   */
  key: string;
  /**
   * The plugin to be stored. Should be the source object, not instantiated.
   */
  plugin: Function;
  /**
   * If this plugin is to be injected into the Scene Systems, this is the property key map used.
   */
  mapping?: string;
  /**
   * Core Scene plugin or a Custom Scene plugin?
   */
  custom?: boolean;
}

export interface CustomPluginContainer {
  /**
   * The unique name of this plugin in the custom plugin cache.
   */
  key: string;
  /**
   * The plugin to be stored. Should be the source object, not instantiated.
   */
  plugin: Function;
}

export interface GlobalPlugin {
  /**
   * The unique name of this plugin within the plugin cache.
   */
  key: string;
  /**
   * An instance of the plugin.
   */
  plugin: Function;
  /**
   * Is the plugin active or not?
   */
  active?: boolean;
  /**
   * If this plugin is to be injected into the Scene Systems, this is the property key map used.
   */
  mapping?: string;
}
